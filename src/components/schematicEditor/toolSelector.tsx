import { faCodeBranch, faXmark } from "@fortawesome/free-solid-svg-icons";
import ToolSelectorTool from "./toolSelectorTool";
import Tools from "./toolsEnum";

interface ToolSelectorProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
}

function ToolSelector({ currentTool, setCurrentTool }: ToolSelectorProps) {
  return (
    <div
      style={{
        position: "absolute",
        right: "2em",
        top: "10em",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "0.2em", // Added gap between elements
      }}
    >
      <ToolSelectorTool
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        name={"wire"}
        icon={faCodeBranch}
        toolEnum={Tools.Wire}
      />
      <ToolSelectorTool
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        name={"NC"}
        icon={faXmark}
        toolEnum={Tools.NoConnect}
      />
    </div>
  );
}

export default ToolSelector;
