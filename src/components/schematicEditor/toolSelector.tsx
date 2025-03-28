// We should modify this file to be able to take in a list of tools, whether it is a horizontal or vertical toolbar,
// and where it is positioned on the screen

import { SchematicElement } from "./schematicElement";
import ToolSelectorTool from "./toolSelectorTool";
import Tools from "./toolsList";
import { Placable } from "./placable";

interface ToolSelectorProps {
  currentTool: () => Placable | SchematicElement;
  setCurrentTool: (tool: Placable | SchematicElement) => void;
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
        toolEnum={Tools.Line}
      />
    </div>
  );
}

export default ToolSelector;
