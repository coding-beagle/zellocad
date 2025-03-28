import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NonElectronicSchematicElement } from "../nonTronicSchematicElement";
import { darkModeTheme } from "../../themeManager/themes";

class LineTool extends NonElectronicSchematicElement {
  constructor(startPos: { x: number; y: number }) {
    super(startPos, "Line", <FontAwesomeIcon icon={faSlash} />);
  }

  static drawGhost(x: number, y: number): void {
    this.ctx.moveTo(x - 5, y);
    this.ctx.lineTo(x + 5, y);
    this.ctx.moveTo(x, y - 5);
    this.ctx.lineTo(x, y + 5);

    this.ctx.stroke();
  }
}

export default LineTool;
