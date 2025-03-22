import { useEffect, useState, useRef } from "react";
import { darkModeTheme } from "../themeManager/themes";

function SchematicEditor() {
  const canvasRef = useRef(null);
  const scale = useRef(1);
  const middleMouse = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const currentGridPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    const ctx = canvas.getContext("2d");
    const gridSize = 20;
    const numGrid = 20;

    const drawGrid = () => {
      ctx.save(); // Clear the canvas with transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.fillStyle = darkModeTheme.primary;
      ctx.beginPath();
      // ctx.rect(0, 0, canvas.width, canvas.height);

      ctx.fill();
      ctx.save();

      ctx.scale(scale.current, scale.current);

      for (let x = 0; x < canvas.width / scale.current; x += gridSize) {
        for (let y = 0; y < canvas.height / scale.current; y += gridSize) {
          ctx.moveTo(x - 2, y);
          ctx.lineTo(x + 2, y);
          ctx.moveTo(x, y - 2);
          ctx.lineTo(x, y + 2);
        }
      }

      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      ctx.restore();
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const { deltaX, deltaY } = event;
      resizeCanvas();

      ctx.translate(currentGridPosRef.current.x, currentGridPosRef.current.y);

      const zoomIntensity = 0.1;
      const zoom = Math.exp((deltaY * zoomIntensity) / 100);
      scale.current *= zoom;

      drawGrid();
    };

    const mousedown = (event) => {
      if (event.buttons == 4) {
        event.preventDefault();
        middleMouse.current = true;
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const mouseup = (event) => {
      middleMouse.current = false;
    };

    const mousemove = (event) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
      if (middleMouse.current) {
        const dx = mousePosRef.current.x - lastMousePosRef.current.x;
        const dy = mousePosRef.current.y - lastMousePosRef.current.y;
        currentPosRef.current = {
          x: currentPosRef.current.x + dx,
          y: currentPosRef.current.y + dy,
        };

        currentGridPosRef.current = {
          x: currentPosRef.current.x + dx,
          y: currentPosRef.current.y + dy,
        };

        // console.log(currentGridPosRef.current);

        ctx.translate(dx, dy);

        lastMousePosRef.current = { x: event.clientX, y: event.clientY };

        drawGrid();
      }
    };

    const resizeHandler = (event) => {
      resizeCanvas();

      drawGrid();
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("resize", resizeHandler);

    drawGrid();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        backgroundColor: darkModeTheme.primary,
      }}
    />
  );
}

export default SchematicEditor;
