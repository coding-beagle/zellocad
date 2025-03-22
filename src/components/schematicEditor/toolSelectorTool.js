import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const buttonSize = "5em";

function ToolSelectorTool({ name, setCurrentTool, currentTool, icon }) {
  return (
    <Button
      onClick={() => {
        currentTool == name ? setCurrentTool(null) : setCurrentTool(name);
      }}
      type={currentTool === name ? "primary" : "default"}
      style={{ height: buttonSize, width: buttonSize }} // Updated to make the button square
    >
      <FontAwesomeIcon icon={icon} size={"3x"} />
    </Button>
  );
}

export default ToolSelectorTool;
