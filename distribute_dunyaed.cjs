const fs = require('fs');
const path = require('path');

const mappings = {
  "eski-yunan.txt": ["Homeros", "Hesiodos", "Sappho", "Aisopos (Ezop)", "Aiskhylos", "Sophokles", "Euripides", "Aristophanes", "Sokrates", "Platon (Eflatun)", "Aristoteles"],
  "latin.txt": ["Plautus", "Terentius", "Vergilius", "Seneca", "Tacitus", "Cicero", "Ovidius"],
  "italyan.txt": ["Dante Alighieri", "Petrarca", "Boccaccio", "Ariosto", "Tasso", "Machiavelli", "Pirandello", "Umberto Eco", "Italo Calvino"],
  "ispanyol.txt": ["Miguel de Cervantes", "Lope de Vega", "Miguel de Unamuno", "Federico García Lorca"],
  "fransiz.txt": ["Montaigne", "Pierre Corneille", "Jean Racine", "Molière", "La Fontaine", "Nicolas Boileau", "Montesquieu", "Voltaire", "Jean-Jacques Rousseau", "Denis Diderot", "Alphonse de Lamartine", "Chateaubriand", "Alexandre Dumas-Père", "Victor Hugo", "Honoré de Balzac", "Stendhal", "Gustave Flaubert", "Emile Zola", "Goncourt Kardeşler", "Goncourt Kardeşler (Edmond ve Jules)", "Alphonse Daudet", "Guy de Maupassant", "Jules Verne", "George Sand", "Anatole France", "Paul Bourget", "Marcel Proust", "André Gide", "Jean-Paul Sartre", "Albert Camus", "Milan Kundera", "Paul Verlaine", "André Breton", "Antoine de Saint-Exupéry"],
  "norvec.txt": ["Henrik Ibsen", "Knut Hamsun"],
  "iskoc.txt": ["Walter Scott", "Robert Louis Stevenson"],
  "danimarka.txt": ["Hans Christian Andersen"],
  "hirvat.txt": ["İvo Andriç"],
  "hint.txt": ["Beydaba", "Rabindranath Tagore"],
  "klasik-iran.txt": ["Sadi-i Şirazi"],
  "alman.txt": ["Goethe", "Schiller", "Rainer Maria Rilke", "Thomas Mann", "Erich Maria Remarque", "Heinrich Böll", "Bertolt Brecht", "Franz Kafka", "Hermann Hesse", "Stefan Zweig", "Robert Musil", "Grimm Kardeşler", "Wilhelm Grimm (Grimm Kardeşler)", "Günter Grass"],
  "ingiliz.txt": ["Geoffrey Chaucer", "Thomas More", "William Shakespeare", "Francis Bacon", "John Milton", "Daniel Defoe", "Jonathan Swift", "Lord Byron", "Samuel Taylor Coleridge", "Mary Shelley", "Jane Austen", "Charles Dickens", "George Eliot", "Thomas Hardy", "Oscar Wilde", "Bernard Shaw", "H. G. Wells", "James Joyce", "Virginia Woolf", "George Orwell", "Aldous Huxley", "T. S. Eliot", "Agatha Christie", "Samuel Beckett"],
  "rus.txt": ["Aleksandr Puşkin", "Nikolay Gogol", "İvan Turgenyev", "Fyodor Dostoyevski", "Lev Tolstoy", "İvan Gonçarov", "Anton Çehov", "Maksim Gorki", "Yevgeni Zamyatin", "Vladimir Mayakovski", "Grigori Petrov"],
  "amerikan.txt": ["Herman Melville", "Edgar Allan Poe", "Walt Whitman", "Mark Twain", "Jack London", "Henry James", "William Faulkner", "John Steinbeck", "Saul Bellow", "Arthur Miller", "Erica Jong", "Sylvia Plath", "Harper Lee", "Ernest Hemingway"],
  "latin-amerika.txt": ["Jorge Luis Borges", "Gabriel García Márquez", "Octavio Paz", "Paulo Coelho"]
};

// Create an author to file map
const authorToFile = {};
for (const [file, authors] of Object.entries(mappings)) {
  for (const author of authors) {
    authorToFile[author] = file;
  }
}

const sourceFile = 'data/dunyaed.txt';
const lines = fs.readFileSync(sourceFile, 'utf-8').split('\n');

const outBuffers = {};

lines.forEach(line => {
  if (!line.trim()) return;
  const parts = line.split('|').map(s => s.trim());
  let author = parts[0];
  
  if (author === "(Not: Dosyada Puşkin'in eserlerine dair detaylı açıklama bulunmamaktadır, sadece adı geçmektedir.)") return;
  
  let targetFile = authorToFile[author];
  
  // Eğer tam eşleşme yoksa, isimle başlayanları bul (örn: "Goncourt Kardeşler (Edmond ve Jules)")
  if (!targetFile) {
    const matchedAuthor = Object.keys(authorToFile).find(a => author.includes(a) || a.includes(author));
    if (matchedAuthor) {
      targetFile = authorToFile[matchedAuthor];
    } else {
      console.log("ESLESMEYEN YAZAR:", author);
      targetFile = 'diger.txt'; // Fallback
    }
  }

  if (!outBuffers[targetFile]) outBuffers[targetFile] = [];
  outBuffers[targetFile].push(line);
});

// Write buffers to files
for (const [file, fileLines] of Object.entries(outBuffers)) {
  fs.writeFileSync(path.join('data', file), fileLines.join('\n') + '\n', 'utf-8');
}

console.log("Tüm veriler başarıyla alt dosyalara dağıtıldı.");
