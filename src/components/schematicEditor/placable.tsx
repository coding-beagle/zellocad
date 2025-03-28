// base class for anything placable on the schematic sheet

abstract class Placable {
  static ctx: CanvasRenderingContext2D | null = null;

  startPosition: { x: number; y: number };
  name: string;
  tooltipIcon: React.ReactNode;
  selectionHitbox: { x: number; y: number; width: number; height: number };
  isSelected: boolean;

  constructor(
    startPosition: { x: number; y: number },
    name: string,
    tooltipIcon: React.ReactNode
  ) {
    this.startPosition = startPosition;
    this.name = name;
    this.tooltipIcon = tooltipIcon;
    this.selectionHitbox = null;
  }

  draw(): void {
    console.log("Drawing: ", this.name);
  }

  selectionInHitbox(x1: number, y1: number, x2: number, y2: number): boolean {
    if (!this.selectionHitbox) {
      return false;
    }

    const hitboxRight = this.selectionHitbox.x + this.selectionHitbox.width;
    const hitboxBottom = this.selectionHitbox.y + this.selectionHitbox.height;

    const rectLeft = Math.min(x1, x2);
    const rectRight = Math.max(x1, x2);
    const rectTop = Math.min(y1, y2);
    const rectBottom = Math.max(y1, y2);

    return (
      this.selectionHitbox.x >= rectLeft &&
      hitboxRight <= rectRight &&
      this.selectionHitbox.y >= rectTop &&
      hitboxBottom <= rectBottom
    );
  }

  handleTranslation(): void {
    // Dummy implementation
    console.log("Handling translation...");
  }

  handleRotation(): void {
    // Dummy implementation
    console.log("Handling rotation...");
  }

  handleFlipping(): void {
    // Dummy implementation
    console.log("Handling flipping...");
  }

  static setCanvasContext(context: CanvasRenderingContext2D): void {
    Placable.ctx = context;
  }

  static getCanvasContext(): CanvasRenderingContext2D | null {
    return Placable.ctx;
  }
}

export { Placable };
