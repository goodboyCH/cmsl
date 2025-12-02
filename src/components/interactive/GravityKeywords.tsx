"use client";
import { useEffect, useRef } from "react";
import Matter from "matter-js";

const KEYWORDS = ["AI", "Alloy", "Data", "Atomic", "Future", "Simulation", "Lab"];

export function GravityKeywords() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Runner = Matter.Runner;

    const engine = Engine.create();
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: 400, // 높이 조절
        wireframes: false,
        background: "transparent",
      },
    });

    // 벽 생성 (양옆과 바닥)
    const ground = Bodies.rectangle(window.innerWidth / 2, 410, window.innerWidth, 20, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(0, 200, 20, 400, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(window.innerWidth, 200, 20, 400, { isStatic: true, render: { visible: false } });

    // 키워드 박스 생성
    const keywords = KEYWORDS.map((text, i) => {
      return Bodies.rectangle(
        Math.random() * window.innerWidth * 0.8 + 50, // 랜덤 X 위치
        Math.random() * -500, // 화면 위에서 떨어짐
        120, // 너비
        50,  // 높이
        {
          chamfer: { radius: 20 }, // 둥근 모서리
          render: {
            fillStyle: i % 2 === 0 ? "#06b6d4" : "#334155", // Cyan or Slate
            text: {
              content: text,
              color: "#ffffff",
              size: 16,
              family: "Arial",
            },
          } as any, // Matter.js 타입 이슈 우회
        }
      );
    });

    World.add(engine.world, [ground, leftWall, rightWall, ...keywords]);

    // 마우스 상호작용 추가
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mouseConstraint);

    // 렌더링 루프 시작
    Runner.run(engine);
    Render.run(render);

    // 커스텀 렌더링 (텍스트를 박스 위에 그리기 위해 hook 사용)
    Matter.Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      keywords.forEach((body, index) => {
        const { x, y } = body.position;
        const angle = body.angle;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(KEYWORDS[index], 0, 0);
        ctx.restore();
      });
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return <div ref={sceneRef} className="w-full h-[400px] overflow-hidden cursor-grab active:cursor-grabbing" />;
}