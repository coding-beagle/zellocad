import { Placable } from "../placable";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class LineTool extends Placable {
  constructor(startPos: { x: number; y: number }) {
    super(startPos, "Line", <FontAwesomeIcon icon={faSlash} />);
  }
}

export default LineTool;
