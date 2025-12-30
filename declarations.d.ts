// CSS 모듈 타입 선언
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-quill-new/dist/quill.snow.css';
declare module 'react-quill-new/dist/quill.bubble.css';
