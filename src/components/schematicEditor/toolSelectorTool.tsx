import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const buttonSize = "5em";

function ToolSelectorTool({ toolEnum, setCurrentTool, currentTool }) {
  return (
    <Button
      onClick={() => {
        currentTool == toolEnum
          ? setCurrentTool(null)
          : setCurrentTool(toolEnum);
      }}
      type={currentTool === toolEnum ? "primary" : "default"}
      style={{ height: buttonSize, width: buttonSize }}
      title={toolEnum.name} // This adds a tooltip on hover
    >
      {toolEnum.icon}
    </Button>
  );
}

export default ToolSelectorTool;
