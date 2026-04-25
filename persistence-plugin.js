import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default function persistencePlugin() {
  return {
    name: 'persistence-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split('?')[0];
        fs.appendFileSync('server-requests.log', `[${new Date().toISOString()}] Request: ${req.method} ${req.url} (Cleaned: ${url})\n`);
        
        if (url === '/api/update-author' && req.method === 'POST') {
          console.log('[Persistence] Update Author request received');
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { originalName, updatedAuthor } = JSON.parse(body);
              const dataDir = path.resolve(process.cwd(), 'data');
              const files = fs.readdirSync(dataDir);

              // We need to track which works are processed
              let matchedWorks = new Set();

              // 1. Update .txt files
              files.filter(f => f.endsWith('.txt')).forEach(file => {
                const filePath = path.join(dataDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const lines = content.split('\n');
                let changed = false;
                let lastAuthorLineIndex = -1;

                let newLines = lines.map((line, index) => {
                  const parts = line.split('|').map(p => p.trim());
                  if (parts[0] === originalName) {
                    changed = true;
                    lastAuthorLineIndex = index;
                    // match by originalName or name (for renamed works)
                    const work = updatedAuthor.works.find(w => (w.originalName || w.name) === parts[1]);
                    if (work) {
                      matchedWorks.add(work.id);
                      // keep original extra fields if not provided
                      return `${updatedAuthor.name} | ${work.name} | ${work.type || parts[2] || ''} | ${work.examInfo || parts[3] || ''} | ${parts[4] || ''} | ${work.description || parts[5] || ''} | ${parts[6] || ''}`;
                    }
                    // If the work is no longer in updatedAuthor.works, it means it was deleted by the user
                    return null;
                  }
                  return line;
                });
                
                newLines = newLines.filter(line => line !== null);

                // Add new works that haven't been matched yet
                if (changed) {
                  const newWorks = updatedAuthor.works.filter(w => !matchedWorks.has(w.id));
                  newWorks.forEach(w => {
                    newLines.splice(lastAuthorLineIndex + 1, 0, `${updatedAuthor.name} | ${w.name} | ${w.type || ''} | ${w.examInfo || ''} |  | ${w.description || ''} | `);
                    lastAuthorLineIndex++;
                    matchedWorks.add(w.id);
                  });
                  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
                }
              });

              // 3. Update authors_master.json
              const masterPath = path.join(dataDir, 'authors_master.json');
              let authorsMaster = fs.existsSync(masterPath) ? JSON.parse(fs.readFileSync(masterPath, 'utf-8')) : {};
              
              const id = updatedAuthor.id || (originalName.toLowerCase().replace(/[^a-z0-9çğıöşü]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
              
              authorsMaster[id] = {
                ...(authorsMaster[id] || {}),
                name: updatedAuthor.name,
                image: updatedAuthor.image || '',
                bio: updatedAuthor.bio || '',
                wikiPage: updatedAuthor.wikiPage || '',
                awards: updatedAuthor.awards || [],
                movements: updatedAuthor.movements || [],
                examCount: updatedAuthor.examCount || (authorsMaster[id] ? authorsMaster[id].examCount : 0)
              };

              fs.writeFileSync(masterPath, JSON.stringify(authorsMaster, null, 2), 'utf-8');

              exec('node buildJson.cjs', () => { console.log(`[Persistence] Updated author ${originalName}`); });
              res.statusCode = 200; res.end(JSON.stringify({ success: true }));
            } catch (err) { 
              fs.appendFileSync('persistence-error.log', `[${new Date().toISOString()}] Update Author Error: ${err.message}\n`);
              res.statusCode = 500; 
              res.end(JSON.stringify({ error: err.message })); 
            }
          });
        } else if (url === '/api/delete-author' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { authorName } = JSON.parse(body);
              const dataDir = path.resolve(process.cwd(), 'data');
              const files = fs.readdirSync(dataDir);
              
              // 1. Remove from all .txt files
              files.filter(f => f.endsWith('.txt')).forEach(file => {
                const filePath = path.join(dataDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const lines = content.split('\n');
                const newLines = lines.filter(line => {
                  const parts = line.split('|').map(p => p.trim());
                  return parts[0] !== authorName;
                });
                if (lines.length !== newLines.length) {
                  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
                }
              });

              // 2. Remove from authors_master.json
              const masterPath = path.join(dataDir, 'authors_master.json');
              if (fs.existsSync(masterPath)) {
                let authorsMaster = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
                const id = authorName.toLowerCase().replace(/[^a-z0-9çğıöşü]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                if (authorsMaster[id]) {
                  delete authorsMaster[id];
                  fs.writeFileSync(masterPath, JSON.stringify(authorsMaster, null, 2), 'utf-8');
                }
              }

              exec('node buildJson.cjs', () => { console.log(`[Persistence] Deleted author ${authorName}`); });
              res.statusCode = 200; res.end(JSON.stringify({ success: true }));
            } catch (err) { res.statusCode = 500; res.end(JSON.stringify({ error: err.message })); }
          });
        } else if (url === '/api/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { type, filePath, content } = JSON.parse(body);
              const absolutePath = path.resolve(process.cwd(), filePath);
              if (type === 'json') fs.writeFileSync(absolutePath, JSON.stringify(content, null, 2), 'utf-8');
              else if (type === 'txt') {
                const lines = content.map(row => `${row.author} | ${row.work} | ${row.type} | ${row.extraInfo || ''} |  | ${row.description} | `);
                fs.writeFileSync(absolutePath, lines.join('\n'), 'utf-8');
              }
              exec('node buildJson.cjs');
              res.statusCode = 200; res.end(JSON.stringify({ success: true }));
            } catch (err) { res.statusCode = 500; res.end(JSON.stringify({ error: err.message })); }
          });
        } else if (url === '/api/source-data' && req.method === 'GET') {
          const dataDir = path.resolve(process.cwd(), 'data');
          const files = fs.readdirSync(dataDir);
          const results = {};
          files.forEach(file => {
            const filePath = path.join(dataDir, file);
            const ext = path.extname(file);
            if (ext === '.json') results[file] = { type: 'json', content: JSON.parse(fs.readFileSync(filePath, 'utf-8')) };
            else if (ext === '.txt') {
              const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(l => l.trim().length > 0).map(line => {
                const parts = line.split('|').map(p => p.trim());
                return { author: parts[0], work: parts[1], type: parts[2], extraInfo: parts[3], description: parts[4] };
              });
              results[file] = { type: 'txt', content: lines };
            }
          });
          res.statusCode = 200; res.end(JSON.stringify(results));
        } else {
          next();
        }
      });
    }
  };
}
