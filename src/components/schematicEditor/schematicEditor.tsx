import React, { useRef, useEffect } from "react";
import SchematicGridRenderer, {
  SchematicGridProps,
} from "./schematicEditorRenderer";
import { darkModeTheme } from "../themeManager/themes";
import { render } from "@testing-library/react";

const SchematicEditor: React.FC<SchematicGridProps> = ({
  width,
  height,
  rows,
  columns,
  scale = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SchematicGridRenderer | null>(null);

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
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridRenderer = new SchematicGridRenderer(ctx, {
      width,
      height,
      rows,
      columns,
      scale,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    rendererRef.current = gridRenderer;

    ctx.clearRect(0, 0, width, height);
    gridRenderer.drawGrid();

    return () => {
      // Cleanup code if necessary
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      style={{
        border: "none",
        backgroundColor: darkModeTheme.primary,
        // cursor: "crosshair", // Optional: changes cursor to indicate interactivity
      }}
    />
  );
};

export default SchematicEditor;
