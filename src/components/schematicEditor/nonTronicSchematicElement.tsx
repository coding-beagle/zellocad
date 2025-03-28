import { Placable } from "./placable";

class NonElectronicSchematicElement extends Placable {
  constructor(
    startPosition: { x: number; y: number },
    name: string,
    tooltipIcon: React.ReactNode
  ) {
    super(startPosition, name, tooltipIcon);
  }

  drawGhost(x: number, y: number): void {
    super.drawGhost(x, y);
  }
}

export { NonElectronicSchematicElement };
