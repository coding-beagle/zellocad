import { Button } from "antd";
import { useState } from "react";

// const buttonStyle = {
//   paddingTop: "1em",
// };

function ToolSelector(currentTool) {
  const [selectedTool, setSelectedTool] = useState(null);
  currentTool = selectedTool;
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
        maxWidth: "1em",
      }}
    >
      <Button
        onClick={() => {
          alert("Tool has been selected");
        }}
      >
        Wire
      </Button>
      <Button
        onClick={() => {
          alert("Tool has been selected");
        }}
      >
        Yap
      </Button>
      <Button
        onClick={() => {
          alert("Tool has been selected");
        }}
      >
        IDK
      </Button>
    </div>
  );
}

export default ToolSelector;
