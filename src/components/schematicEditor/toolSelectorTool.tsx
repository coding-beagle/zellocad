import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const buttonSize = "5em";

function ToolSelectorTool({
  name,
  toolEnum,
  setCurrentTool,
  currentTool,
  icon,
}) {
  return (
    <Button
      onClick={() => {
        currentTool == toolEnum
          ? setCurrentTool(null)
          : setCurrentTool(toolEnum);
      }}
      type={currentTool === toolEnum ? "primary" : "default"}
      style={{ height: buttonSize, width: buttonSize }}
      title={name} // This adds a tooltip on hover
    >
      <FontAwesomeIcon icon={icon} size={"3x"} />
    </Button>
  );
}

export default ToolSelectorTool;
