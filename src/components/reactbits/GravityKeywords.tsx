"use client";
import { useEffect, useRef } from "react";
import Matter from "matter-js";

const KEYWORDS = ["AI", "Alloy", "Data", "Atomic", "Future", "Simulation", "Lab"];

export function GravityKeywords() {
  const sceneRef = useRef<HTMLDivElement>(null);

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
        height: 400,
        wireframes: false,
        background: "transparent",
        pixelRatio: 1,
      },
    });

    const ground = Bodies.rectangle(window.innerWidth / 2, 410, window.innerWidth, 20, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(0, 200, 20, 400, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(window.innerWidth, 200, 20, 400, { isStatic: true, render: { visible: false } });

    const keywords = KEYWORDS.map((text, i) => {
      return Bodies.rectangle(
        Math.random() * window.innerWidth * 0.8 + 50,
        Math.random() * -500 - 100,
        120, 50,
        {
          chamfer: { radius: 20 },
          render: {
            fillStyle: i % 2 === 0 ? "#06b6d4" : "#334155",
            // @ts-ignore -> Matter.js 타입 정의 누락 방지
            text: { content: text, color: "#ffffff", size: 16, family: "Arial" },
          } as any, // 타입 오류 강제 회피
        }
      );
    });

    World.add(engine.world, [ground, leftWall, rightWall, ...keywords]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    // 🛑 [수정된 부분] TypeScript 오류 해결: (mouseConstraint.mouse as any) 사용
    // mousewheel 이벤트가 Matter.js 내부엔 있지만 타입 정의엔 없어서 any로 우회합니다.
    const mouseAny = mouseConstraint.mouse as any;
    if (mouseAny.element && mouseAny.mousewheel) {
        mouseAny.element.removeEventListener("mousewheel", mouseAny.mousewheel);
        mouseAny.element.removeEventListener("DOMMouseScroll", mouseAny.mousewheel);
    }

    World.add(engine.world, mouseConstraint);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

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
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return <div ref={sceneRef} className="w-full h-[400px] overflow-hidden cursor-grab active:cursor-grabbing touch-none" />;
}