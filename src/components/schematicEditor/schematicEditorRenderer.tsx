// This class will handle the rendering of the schematic editor.
// It aims to provide an easy way to convert between on-screen coordinates,
// and the schematicGrid coordinates, as well as handling all of the schematic
// elements that need to be rendered.

import { darkModeTheme } from "../themeManager/themes";

interface SchematicGridProps {
  width: number;
  height: number;
  rows: number;
  columns: number;
  scale?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

class SchematicGridRenderer {
  ctx: CanvasRenderingContext2D;

  // schematic meta stuff
  gridSizePx: { x: number; y: number };
  gridRowColumns: { rows: number; columns: number };
  scale: number;
  currentTransform: { x: number; y: number } = { x: 0, y: 0 };
  canvasSize: { x: number; y: number };

  // mouse stuff
  currentMousePos: { x: number; y: number };
  lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  leftMouse: boolean = false;
  rightMouse: boolean = false;
  middleMouse: boolean = false;

  constructor(ctx: CanvasRenderingContext2D, props: SchematicGridProps) {
    const {
      width,
      height,
      rows,
      columns,
      scale = 1,
      canvasWidth,
      canvasHeight,
    } = props;
    this.gridSizePx = { x: width, y: height };
    this.gridRowColumns = { rows: rows, columns: columns };
    this.scale = scale;
    this.ctx = ctx;
    this.canvasSize = { x: canvasWidth, y: canvasHeight };
  }

  clearGrid() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
    this.ctx.restore();
  }

  drawSchematicSheet() {
    this.ctx.fillStyle = darkModeTheme.primary;
    this.ctx.beginPath();
    this.ctx.rect(
      0,
      0,
      this.gridSizePx.x / this.scale,
      this.gridSizePx.y / this.scale
    );
    this.ctx.closePath();
    this.ctx.fill();

    // draw dot things
    for (let x = 1; x < this.gridRowColumns.rows; x++) {
      for (let y = 1; y < this.gridRowColumns.columns; y++) {
        const gridX =
          (x * this.gridSizePx.x) / this.gridRowColumns.rows / this.scale;
        const gridY =
          (y * this.gridSizePx.y) / this.gridRowColumns.columns / this.scale;
        this.ctx.moveTo(gridX - 1, gridY);
        this.ctx.lineTo(gridX + 1, gridY);
        this.ctx.moveTo(gridX, gridY - 1);
        this.ctx.lineTo(gridX, gridY + 1);
      }
    }

    this.ctx.strokeStyle = "#ddd";
    this.ctx.stroke();
  }

  // main render loop
  drawGrid() {
    this.clearGrid();
    this.drawSchematicSheet();
  }

  getScreenPosFromSchemGrid(x: number, y: number): { x: number; y: number };
  getScreenPosFromSchemGrid(pos: { x: number; y: number }): {
    x: number;
    y: number;
  };
  getScreenPosFromSchemGrid(
    xOrPos: number | { x: number; y: number },
    y?: number
  ): { x: number; y: number } {
    const gridSizeX = this.gridSizePx.x / this.gridRowColumns.rows;
    const gridSizeY = this.gridSizePx.y / this.gridRowColumns.columns;

    if (typeof xOrPos === "object") {
      return {
        x:
          (Math.max(1, Math.min(xOrPos.x, this.gridRowColumns.rows)) *
            gridSizeX) /
          this.scale,
        y:
          (Math.max(1, Math.min(xOrPos.y, this.gridRowColumns.columns)) *
            gridSizeY) /
          this.scale,
      };
    } else {
      return {
        x:
          (Math.max(1, Math.min(xOrPos, this.gridRowColumns.rows)) *
            gridSizeX) /
          this.scale,
        y:
          (Math.max(1, Math.min(y!, this.gridRowColumns.columns)) * gridSizeY) /
          this.scale,
      };
    }
  }

  mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    this.currentMousePos = { x: e.clientX, y: e.clientY };

    const dx = this.currentMousePos.x - this.lastMousePos.x;
    const dy = this.currentMousePos.y - this.lastMousePos.y;

    if (this.middleMouse) {
      this.ctx.translate(dx, dy);
    }

    this.lastMousePos = { x: e.clientX, y: e.clientY };
    this.drawGrid();
  }

  mouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    switch (e.buttons) {
      case 1:
        this.leftMouse = true;
        break;
      case 2:
        this.rightMouse = true;
        e.preventDefault();
        break;
      case 4:
        this.middleMouse = true;
        break;
      default:
        return;
    }
  }

  mouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    switch (e.button) {
      case 0:
        this.leftMouse = false;
        break;
      case 2:
        this.rightMouse = false;
        e.preventDefault();
        break;
      case 1:
        this.middleMouse = false;
        break;
      default:
        return;
    }
  }
}

export default SchematicGridRenderer;
export type { SchematicGridProps };
