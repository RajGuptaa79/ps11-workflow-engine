import { useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext.jsx";
import DiagramBlankPage from "../../../pages/DiagramPage.jsx";

export default function PolkaField() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const { theme } = useTheme();
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const lightDotColor = { r: 0, g: 0, b: 0 };
  const darkDotColor = { r: 255, g: 255, b: 255 };

  const dotColor = isDark ? lightDotColor : darkDotColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    const dots = [];
    const spacing = 26;
    const baseRadius = 1.25;
    const influenceRadius = 220;
    const maxLift = 25;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots.length = 0;

      for (let y = spacing / 2; y < rect.height; y += spacing) {
        for (let x = spacing / 2; x < rect.width; x += spacing) {
          dots.push({ x, y });
        }
      }
    };

    const getBaseColor = () => {
      if (theme === "dark") {
        return { r: 255, g: 255, b: 255, a: 0.24 };
      }
      return { r: 0, g: 0, b: 0, a: 0.18 };
    };

    const draw = () => {
      const rect = parent.getBoundingClientRect();
      const base = getBaseColor();

      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const dot of dots) {
        const dx = mouseRef.current.x - dot.x;
        const dy = mouseRef.current.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let lift = 0;
        let scale = 1;
        let alpha = base.a;
        let glow = 0;

        if (mouseRef.current.active && dist < influenceRadius) {
          const t = 1 - dist / influenceRadius;
          const eased = Math.pow(t, 1.8);
          lift = eased * maxLift;
          scale = 1 + eased * 0.08;
          alpha = base.a + eased * (theme === "dark" ? 0.26 : 0.16);
        }

        const drawR = dotColor.r;
        const drawG = dotColor.g;
        const drawB = dotColor.b;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y - lift, baseRadius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${drawR + 100}, ${drawG + 100}, ${drawB + 100}, ${alpha})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="polka-canvas" />;
}
