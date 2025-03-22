import { useState } from "react";
import SchematicEditor from "./components/schematicEditor/schematicEditor";
import { darkModeTheme } from "./components/themeManager/themes";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: darkModeTheme.primary,
        color: darkModeTheme.text,
        overflow: "hidden",
      }}
    >
      <SchematicEditor />
    </div>
  );
}

export default App;
