// CSS 모듈 타입 선언
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
