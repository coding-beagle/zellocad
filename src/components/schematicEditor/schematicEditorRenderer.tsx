// This class will handle the rendering of the schematic editor.
// It aims to provide an easy way to convert between on-screen coordinates,
// and the schematicGrid coordinates, as well as handling all of the schematic
// elements that need to be rendered.

import { darkModeTheme } from "../themeManager/themes";
import { NonElectronicSchematicElement } from "./nonTronicSchematicElement";
import { Placable } from "./placable";

import { PlacableInstantiater } from "./placableInstantiater";
import { SchematicElement } from "./schematicElement";

interface SchematicGridProps {
  width: number;
  height: number;
  rows: number;
  columns: number;
  scale?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  initialTransformX?: number;
  initialTransformY?: number;
}

class SchematicGridRenderer {
  ctx: CanvasRenderingContext2D;
  elements: (SchematicElement | NonElectronicSchematicElement)[]; // not sure if we should mix these, could make resolving netlists harder
  placableSelectorHandler: PlacableInstantiater;

  // schematic meta stuff
  gridSizePx: { x: number; y: number };
  gridRowColumns: { rows: number; columns: number };
  scale: number;
  currentTransform: { x: number; y: number } = { x: 0, y: 0 };
  canvasSize: { x: number; y: number };

  // mouse stuff
  currentMousePos: { x: number; y: number } = { x: 0, y: 0 };
  lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  leftMouse: boolean = false;
  rightMouse: boolean = false;
  middleMouse: boolean = false;

  // Selection box properties
  isSelecting: boolean = false;
  selectionStart: { x: number; y: number } | null = null;
  selectionEnd: { x: number; y: number } | null = null;

  // Tool stuff
  currentTool: SchematicElement | NonElectronicSchematicElement | null = null;

  constructor(
    ctx: CanvasRenderingContext2D,
    elements: SchematicElement[],
    props: SchematicGridProps
  ) {
    const {
      width,
      height,
      rows,
      columns,
      scale = 1,
      canvasWidth,
      canvasHeight,
      initialTransformX = (canvasWidth - width) / 2, // make sure schematic starts in the middle
      initialTransformY = (canvasHeight - height) / 2,
    } = props;
    this.gridSizePx = { x: width, y: height };
    this.gridRowColumns = { rows: rows, columns: columns };
    this.scale = scale;
    this.ctx = ctx;
    Placable.ctx = ctx;
    this.canvasSize = { x: canvasWidth, y: canvasHeight };
    this.currentTransform = { x: initialTransformX, y: initialTransformY };
    this.elements = elements;

    this.placableSelectorHandler = new PlacableInstantiater();

    this.drawGrid();
    this.transform();
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

    this.elements.forEach((element) => element.draw());

    this.ctx.save();
    if (this.currentTool !== null) {
      const mouseGridPositions = this.getGridPosFromScreenCoords(
        this.currentMousePos.x,
        this.currentMousePos.y
      );
      const gridScreenPos = this.getScreenPosFromSchemGrid(
        mouseGridPositions.x,
        mouseGridPositions.y
      );
      this.currentTool.drawGhost(gridScreenPos.x, gridScreenPos.y);
    }
    this.ctx.restore();

    this.drawSelectionBox(); // Add selection box rendering
  }

  drawSelectionBox() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.isSelecting && this.selectionStart && this.selectionEnd) {
      const startX = Math.min(this.selectionStart.x, this.selectionEnd.x);
      const startY = Math.min(this.selectionStart.y, this.selectionEnd.y);
      const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
      const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);

      this.ctx.save();
      this.ctx.strokeStyle = darkModeTheme.accent;
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeRect(startX, startY, width, height);
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  getScreenPosFromSchemGrid(x: number, y: number): { x: number; y: number } {
    const gridSizeX = this.gridSizePx.x / this.gridRowColumns.rows;
    const gridSizeY = this.gridSizePx.y / this.gridRowColumns.columns;

    return {
      x:
        (Math.max(1, Math.min(x, this.gridRowColumns.rows)) * gridSizeX) /
        this.scale,
      y:
        (Math.max(1, Math.min(y, this.gridRowColumns.columns)) * gridSizeY) /
        this.scale,
    };
  }

  clamp = (number: number, numMin: number, numMax: number) => {
    return number > numMax ? numMax : number < numMin ? numMin : number;
  };

  getGridPosFromScreenCoords(
    x: number,
    y: number,
    round: boolean = true,
    clamp: boolean = true
  ) {
    const gridSizeX = this.gridSizePx.x / this.gridRowColumns.rows;
    const gridSizeY = this.gridSizePx.y / this.gridRowColumns.columns;
    let gridX, gridY;
    if (round) {
      gridX = Math.round(
        ((x - this.currentTransform.x) / gridSizeX) * this.scale
      );
      gridY = Math.round(
        ((y - this.currentTransform.y) / gridSizeY) * this.scale
      );
    } else {
      gridX = ((x - this.currentTransform.x) / gridSizeX) * this.scale;
      gridY = ((y - this.currentTransform.y) / gridSizeY) * this.scale;
    }

    if (clamp) {
      return {
        x: this.clamp(gridX, 1, this.gridRowColumns.rows - 1),
        y: this.clamp(gridY, 1, this.gridRowColumns.columns - 1),
      };
    }
    return {
      x: gridX,
      y: gridY,
    };
  }

  // make sure we translate to currentTransform on resize events
  transform() {
    this.ctx.translate(this.currentTransform.x, this.currentTransform.y);
  }

  // handles the case where we start dragging from right and select left!
  normalizeSelectionBox() {
    const selectionCorner1 = this.getGridPosFromScreenCoords(
      this.selectionStart.x,
      this.selectionStart.y,
      false
    );
    const selectionCorner2 = this.getGridPosFromScreenCoords(
      this.selectionEnd.x,
      this.selectionEnd.y,
      false
    );

    return {
      x1:
        selectionCorner1.x < selectionCorner2.x
          ? selectionCorner1.x
          : selectionCorner2.x,
      y1:
        selectionCorner1.y < selectionCorner2.y
          ? selectionCorner1.y
          : selectionCorner2.y,
      x2:
        selectionCorner1.x > selectionCorner2.x
          ? selectionCorner1.x
          : selectionCorner2.x,
      y2:
        selectionCorner1.y > selectionCorner2.y
          ? selectionCorner1.y
          : selectionCorner2.y,
    };
  }

  resolveSelection() {
    const selectionBox = this.normalizeSelectionBox();
    // console.log(selectionBox);
  }

  mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    this.currentMousePos = { x: e.clientX, y: e.clientY };

    const dx = this.currentMousePos.x - this.lastMousePos.x;
    const dy = this.currentMousePos.y - this.lastMousePos.y;

    if (this.middleMouse) {
      this.currentTransform.x += dx;
      this.currentTransform.y += dy;
      this.ctx.translate(dx, dy);
      this.drawGrid();
    }

    this.currentTool = this.placableSelectorHandler.getCurrentSelectedTool();
    if (this.currentTool !== null) {
      this.drawGrid();
    }

    if (this.isSelecting && this.selectionStart) {
      this.selectionEnd = { x: e.clientX, y: e.clientY };
      this.drawGrid();
    }

    this.lastMousePos = { x: e.clientX, y: e.clientY };
  }

  mouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    switch (e.buttons) {
      case 1:
        this.leftMouse = true;
        this.isSelecting = true;
        this.selectionStart = { x: e.clientX, y: e.clientY };
        this.selectionEnd = { x: e.clientX, y: e.clientY };
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
        if (this.isSelecting) {
          this.resolveSelection();
          this.isSelecting = false;
          this.selectionStart = null;
          this.selectionEnd = null;
        }
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
    this.drawGrid();
  }

  handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const { deltaX, deltaY } = e;

    const zoomIntensity = 0.1;
    const zoom = Math.exp((deltaY * zoomIntensity) / 100);

    if (this.scale * zoom > 5 || this.scale * zoom < 0.2) {
      return;
    }

    this.scale *= zoom;

    this.drawGrid();
  }

  handleContext(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
  }
}

export default SchematicGridRenderer;
export type { SchematicGridProps };
