import { useEffect, useState, useRef } from "react";
import { darkModeTheme } from "../themeManager/themes";
import { Menu } from "antd";
import ToolSelector from "./toolSelector";

function SchematicEditor() {
  const canvasRef = useRef(null);
  const scale = useRef(1);
  const middleMouse = useRef(false);
  const leftMouse = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const currentGridPosRef = useRef({ x: 0, y: 0 });
  const selectStartPosRef = useRef({ x: 0, y: 0 });
  const topLeftOfSchemRef = useRef({ x: 0, y: 0 });

  const [currentTool, setCurrentTool] = useState(null);
  const [canDrag, setCanDrag] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    const ctx = canvas.getContext("2d");
    const gridSize = 40;

    const schematicWidth = 1600;
    const schematicHeight = 900;

    const drawGrid = () => {
      ctx.save(); // Clear the canvas with transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.fillStyle = darkModeTheme.primary;
      ctx.beginPath();
      ctx.rect(
        0,
        0,
        schematicWidth / scale.current,
        schematicHeight / scale.current
      );
      ctx.closePath();

      ctx.fill();

      for (
        let x = gridSize / scale.current;
        x < schematicWidth / scale.current - gridSize / scale.current;
        x += gridSize / scale.current
      ) {
        for (
          let y = gridSize / scale.current;
          y < schematicHeight / scale.current - gridSize / scale.current;
          y += gridSize / scale.current
        ) {
          ctx.moveTo(x - 1, y);
          ctx.lineTo(x + 1, y);
          ctx.moveTo(x, y - 1);
          ctx.lineTo(x, y + 1);
        }
      }

      ctx.strokeStyle = "#ddd";
      ctx.stroke();

      if (leftMouse.current) {
        ctx.save(); // Clear the canvas with transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.beginPath();
        ctx.strokeStyle = darkModeTheme.accent;
        ctx.rect(
          selectStartPosRef.current.x,
          selectStartPosRef.current.y,
          mousePosRef.current.x - selectStartPosRef.current.x,
          mousePosRef.current.y - selectStartPosRef.current.y
        );
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const { deltaX, deltaY } = event;
      resizeCanvas();

      ctx.translate(topLeftOfSchemRef.current.x, topLeftOfSchemRef.current.y);

      const zoomIntensity = 0.1;
      const zoom = Math.exp((deltaY * zoomIntensity) / 100);
      scale.current *= zoom;

      drawGrid();
    };

    const mousedown = (event) => {
      if (event.buttons == 1) {
        leftMouse.current = true;
        selectStartPosRef.current = mousePosRef.current;
      }
      if (event.buttons == 4) {
        event.preventDefault();
        middleMouse.current = true;
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const mouseup = (event) => {
      middleMouse.current = false;
      leftMouse.current = false;
      drawGrid();
    };

    const mousemove = (event) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };

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

      console.log(topLeftOfSchemRef.current);

      if (middleMouse.current) {
        ctx.translate(dx, dy);
        topLeftOfSchemRef.current = {
          x: topLeftOfSchemRef.current.x + dx,
          y: topLeftOfSchemRef.current.y + dy,
        };
      }

      lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      drawGrid();
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
    <div>
      <ToolSelector currentTool={currentTool} setCurrentTool={setCurrentTool} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: darkModeTheme.primary,
          padding: 0,
        }}
      />
    </div>
  );
}

export default SchematicEditor;
