import { Button } from "antd";
import { useState } from "react";

// const buttonStyle = {
//   paddingTop: "1em",
// };

function ToolSelector({ currentTool, setCurrentTool }) {
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
          currentTool == "wire" ? setCurrentTool(null) : setCurrentTool("wire");
        }}
        type={currentTool === "wire" ? "primary" : "default"}
      >
        Wire
      </Button>
      <Button
        onClick={() => {
          currentTool == "NC" ? setCurrentTool(null) : setCurrentTool("NC");
        }}
        type={currentTool === "NC" ? "primary" : "default"}
      >
        X
      </Button>
    </div>
  );
}

export default ToolSelector;
