abstract class Placable {
  static ctx: CanvasRenderingContext2D | null = null;

  startPosition: { x: number; y: number };
  name: string;
  tooltipIcon: React.ReactNode;
  selectionHitbox: { x: number; y: number; width: number; height: number }; // Replace `any` with the appropriate type if known

  constructor(
    startPosition: { x: number; y: number },
    name: string,
    tooltipIcon: React.ReactNode
  ) {
    this.startPosition = startPosition;
    this.name = name;
    this.tooltipIcon = tooltipIcon;
    this.selectionHitbox = null; // Initialize with a default value
  }

  draw(): void {
    console.log("Drawing: ", this.name);
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
