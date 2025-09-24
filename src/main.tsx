import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ScrollToTop } from './components/ScrollToTop.tsx'; // 1. import
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollToTop /> {/* 2. App 컴포넌트 위에 추가 */}
    <App />
  </BrowserRouter>
);