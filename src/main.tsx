import { createRoot } from 'react-dom/client';
// 1. react-router-dom에서 BrowserRouter를 가져옵니다.
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // 2. <App /> 컴포넌트를 <BrowserRouter>로 감싸줍니다.
  <BrowserRouter>
    <App />
  </BrowserRouter>
);