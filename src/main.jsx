import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes.jsx';
import './index.css';

export const createRoot = ViteReactSSG({ routes });
