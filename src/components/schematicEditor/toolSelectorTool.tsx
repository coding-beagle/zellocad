import { Button } from "antd";

const buttonSize = "5em";

function ToolSelectorTool({
  setRender,
  toolClass,
  setCurrentTool,
  currentTool,
}) {
  return (
    <Button
      onClick={() => {
        currentTool() === toolClass
          ? setCurrentTool(null)
          : setCurrentTool(toolClass);
        setRender((prev) => !prev); // bit janky but it wouldn't be an NT project without this funk
      }}
      type={currentTool() === toolClass ? "primary" : "default"}
      style={{ height: buttonSize, width: buttonSize }}
      title={toolClass.name}
    >
      {toolClass.name}
    </Button>
  );
}

export default ToolSelectorTool;
