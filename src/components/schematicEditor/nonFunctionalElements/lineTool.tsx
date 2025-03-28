import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NonElectronicSchematicElement } from "../nonTronicSchematicElement";

class LineTool extends NonElectronicSchematicElement {
  constructor(startPos: { x: number; y: number }) {
    super(startPos, "Line", <FontAwesomeIcon icon={faSlash} />);
  }

  drawGhost(x: number, y: number): void {
    super.drawGhost(x, y);
  }
}

export default LineTool;
