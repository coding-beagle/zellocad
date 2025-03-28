import { Placable } from "./placable";

class SchematicElement extends Placable {
  constructor(
    startPosition: { x: number; y: number },
    name: string,
    tooltipIcon: React.ReactNode
  ) {
    super(startPosition, name, tooltipIcon);
  }
}

export { SchematicElement };
