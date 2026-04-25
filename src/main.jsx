import { ViteReactSSG } from 'vite-react-ssg';
import App from './App.jsx';
import { routes } from './routes.jsx';
import './index.css';

export const createRoot = ViteReactSSG({ routes });
