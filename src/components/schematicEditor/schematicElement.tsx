import { Placable } from "./placable";

class SchematicElement extends Placable {
  constructor(
    startPosition: { x: number; y: number },
    name: string,
    tooltipIcon: React.ReactNode // Allows for JSX elements like FontAwesome icons or SVGs
  ) {
    super(startPosition, name, tooltipIcon);
  }
}

export { SchematicElement };
