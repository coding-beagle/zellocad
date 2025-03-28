import React, { useRef, useEffect } from "react";
import SchematicGridRenderer, {
  SchematicGridProps,
} from "./schematicEditorRenderer";
import { darkModeTheme } from "../themeManager/themes";

const SchematicEditor: React.FC<SchematicGridProps> = ({
  width,
  height,
  rows,
  columns,
  scale = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SchematicGridRenderer | null>(null);
  const elements = useRef([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    rendererRef.current.mouseMove(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    rendererRef.current.mouseDown(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    rendererRef.current.mouseUp(e);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    rendererRef.current.handleWheel(e);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    rendererRef.current.handleContext(e);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    const currentElements = elements.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridRenderer = new SchematicGridRenderer(ctx, currentElements, {
      width,
      height,
      rows,
      columns,
      scale,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    rendererRef.current = gridRenderer;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        rendererRef.current.canvasSize = {
          x: window.innerWidth,
          y: window.innerHeight,
        };
        rendererRef.current.drawGrid();
        rendererRef.current.transform();
        rendererRef.current.drawGrid();
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      style={{
        border: "none",
        backgroundColor: darkModeTheme.primary,
      }}
    />
  );
};

export default SchematicEditor;
