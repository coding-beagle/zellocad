// We should modify this file to be able to take in a list of tools, whether it is a horizontal or vertical toolbar,
// and where it is positioned on the screen

import { NonElectronicSchematicElement } from "./nonTronicSchematicElement";
import { SchematicElement } from "./schematicElement";
import ToolSelectorTool from "./toolSelectorTool";
import Tools from "./toolsList";
import { useState, useEffect } from "react";

interface ToolSelectorProps {
  currentTool: () => NonElectronicSchematicElement | SchematicElement;
  setCurrentTool: (
    tool: NonElectronicSchematicElement | SchematicElement
  ) => void;
}

function ToolSelector({ currentTool, setCurrentTool }: ToolSelectorProps) {
  const [, setRender] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrentTool(null);
        setRender((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentTool]);

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
        setRender={setRender}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        toolClass={Tools.Line}
      />
    </div>
  );
}

export default ToolSelector;
