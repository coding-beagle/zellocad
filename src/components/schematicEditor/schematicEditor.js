import { useEffect, useState, useRef } from "react";
import { darkModeTheme } from "../themeManager/themes";
import { Menu } from "antd";
import ToolSelector from "./toolSelector";

function SchematicEditor() {
  const canvasRef = useRef(null);
  const scale = useRef(1);
  const middleMouse = useRef(false);
  const leftMouse = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const currentGridPosRef = useRef({ x: 0, y: 0 });
  const selectStartPosRef = useRef({ x: 0, y: 0 });
  const topLeftOfSchemRef = useRef({ x: 0, y: 0 });
  const currentToolRef = useRef(null);
  const canDragRef = useRef(true);
  const drawingWire = useRef(false);
  const wirePoints = useRef([]);
  const currentWirePoints = useRef([]);
  const selectedWiresRef = useRef([]);
  const constrainedDrawnWireToYAxis = useRef(false);
  const draggingWirePoint = useRef(false);

  const [currentTool, setCurrentTool] = useState(null);
  const [selectedWires, setSelectedWires] = useState([]);

  const gridCountX = 30;
  const gridCountY = 30;

  const schematicWidth = 1600;
  const schematicHeight = 900;

  useEffect(() => {
    currentToolRef.current = currentTool;
    if (currentTool) {
      canDragRef.current = false;
    } else {
      canDragRef.current = true;
    }
  }, [currentTool]);

  const clamp = (number, numMin, numMax) => {
    return number > numMax ? numMax : number < numMin ? numMin : number;
  };

  const getScreenPosFromSchemGrid = (x, y) => {
    const gridSizeX = schematicWidth / gridCountX;
    const gridSizeY = schematicHeight / gridCountY;
    return {
      x: (Math.max(1, Math.min(x, gridCountX)) * gridSizeX) / scale.current,
      y: (Math.max(1, Math.min(y, gridCountY)) * gridSizeY) / scale.current,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    const ctx = canvas.getContext("2d");

    const convertScreenPosToGrid = (x, y, round = true) => {
      const gridSizeX = schematicWidth / gridCountX;
      const gridSizeY = schematicHeight / gridCountY;
      let gridX, gridY;
      if (round) {
        gridX = Math.round(
          ((x - topLeftOfSchemRef.current.x) / gridSizeX) * scale.current
        );
        gridY = Math.round(
          ((y - topLeftOfSchemRef.current.y) / gridSizeY) * scale.current
        );
      } else {
        gridX = ((x - topLeftOfSchemRef.current.x) / gridSizeX) * scale.current;
        gridY = ((y - topLeftOfSchemRef.current.y) / gridSizeY) * scale.current;
      }

      return {
        x: clamp(gridX, 1, gridCountX - 1),
        y: clamp(gridY, 1, gridCountY - 1),
      };
    };

    const getCurrentClosestGridToMouse = (round = true) => {
      return convertScreenPosToGrid(
        mousePosRef.current.x,
        mousePosRef.current.y,
        round
      );
    };

    const drawGrid = () => {
      ctx.save(); // Clear the canvas with transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.fillStyle = darkModeTheme.primary;
      ctx.beginPath();
      ctx.rect(
        0,
        0,
        schematicWidth / scale.current,
        schematicHeight / scale.current
      );
      ctx.closePath();

      ctx.fill();

      for (let x = 1; x < gridCountX; x++) {
        for (let y = 1; y < gridCountY; y++) {
          const gridX = (x * schematicWidth) / gridCountX / scale.current;
          const gridY = (y * schematicHeight) / gridCountY / scale.current;
          ctx.moveTo(gridX - 1, gridY);
          ctx.lineTo(gridX + 1, gridY);
          ctx.moveTo(gridX, gridY - 1);
          ctx.lineTo(gridX, gridY + 1);
        }
      }

      ctx.strokeStyle = "#ddd";
      ctx.stroke();

      if (currentToolRef.current === "wire") {
        const mouseGridPos = getCurrentClosestGridToMouse();
        const closestGridToMouse = getScreenPosFromSchemGrid(
          mouseGridPos.x,
          mouseGridPos.y
        );

        ctx.moveTo(closestGridToMouse.x - 10, closestGridToMouse.y);
        ctx.lineTo(closestGridToMouse.x + 10, closestGridToMouse.y);
        ctx.moveTo(closestGridToMouse.x, closestGridToMouse.y - 10);
        ctx.lineTo(closestGridToMouse.x, closestGridToMouse.y + 10);
        ctx.stroke();

        // drawing ghost wire
        if (drawingWire.current) {
          const mouseWirePoint = getScreenPosFromSchemGrid(
            currentWirePoints.current[currentWirePoints.current.length - 1].x,
            currentWirePoints.current[currentWirePoints.current.length - 1].y
          );
          ctx.moveTo(mouseWirePoint.x, mouseWirePoint.y);

          // this is probably fine but do we want to also make it constrain on the Y axis as well?
          if (
            closestGridToMouse.x != mouseWirePoint.x &&
            !constrainedDrawnWireToYAxis.current
          ) {
            ctx.lineTo(closestGridToMouse.x, mouseWirePoint.y);
          } else {
            ctx.lineTo(mouseWirePoint.x, closestGridToMouse.y);
          }
          ctx.lineTo(closestGridToMouse.x, closestGridToMouse.y);
          ctx.stroke();

          if (closestGridToMouse.x == mouseWirePoint.x) {
            constrainedDrawnWireToYAxis.current = true;
          }
          if (closestGridToMouse.y == mouseWirePoint.y) {
            constrainedDrawnWireToYAxis.current = false;
          }

          if (currentWirePoints.current.length > 1) {
            const firstWirePoint = getScreenPosFromSchemGrid(
              currentWirePoints.current[0].x,
              currentWirePoints.current[0].y
            );
            ctx.moveTo(firstWirePoint.x, firstWirePoint.y);
            currentWirePoints.current.forEach((point) => {
              const pointOnScreen = getScreenPosFromSchemGrid(point.x, point.y);
              ctx.lineTo(pointOnScreen.x, pointOnScreen.y);
            });
            ctx.stroke();
          }
        }
      }

      // Draw all wire points
      wirePoints.current.forEach((wire) => {
        ctx.beginPath();
        ctx.strokeStyle = darkModeTheme.secondaryAccent;
        const wireStart = getScreenPosFromSchemGrid(wire[0].x, wire[0].y);
        ctx.moveTo(wireStart.x, wireStart.y);
        wire.forEach((point) => {
          const screenPoint = getScreenPosFromSchemGrid(point.x, point.y);
          ctx.lineTo(screenPoint.x, screenPoint.y);
        });
        ctx.stroke();

        // Check for the first and last points in the wire
        const firstPoint = wire[0];
        const lastPoint = wire[wire.length - 1];

        // this could be better, we need to check that the wire loops back on itself correctly
        // as well as checking if the wire intersects any other wire / lands back on another wire
        const isUniquePoint = (point) => {
          return !wirePoints.current.some((otherWire) => {
            if (otherWire === wire) return false;
            return otherWire.some((otherPoint) => {
              return point.x === otherPoint.x && point.y === otherPoint.y;
            });
          });
        };

        if (isUniquePoint(firstPoint)) {
          const screenFirstPoint = getScreenPosFromSchemGrid(
            firstPoint.x,
            firstPoint.y
          );
          ctx.fillStyle = darkModeTheme.accent;
          ctx.fillRect(screenFirstPoint.x - 3, screenFirstPoint.y - 3, 6, 6);
        }

        if (isUniquePoint(lastPoint)) {
          const screenLastPoint = getScreenPosFromSchemGrid(
            lastPoint.x,
            lastPoint.y
          );
          ctx.fillStyle = darkModeTheme.accent;
          ctx.fillRect(screenLastPoint.x - 3, screenLastPoint.y - 3, 6, 6);
        }
      });

      // draw selectedWires again
      selectedWiresRef.current.forEach((wire) => {
        ctx.beginPath();
        ctx.strokeStyle = darkModeTheme.accent;
        const firstPoint = getScreenPosFromSchemGrid(wire[0].x, wire[0].y);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        wire.forEach((point) => {
          const screenPoint = getScreenPosFromSchemGrid(point.x, point.y);
          ctx.lineTo(screenPoint.x, screenPoint.y);
        });
        ctx.stroke();
      });

      // draw selection box
      if (
        leftMouse.current &&
        canDragRef.current &&
        !draggingWirePoint.current
      ) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.beginPath();
        ctx.strokeStyle = darkModeTheme.accent;
        ctx.rect(
          selectStartPosRef.current.x,
          selectStartPosRef.current.y,
          mousePosRef.current.x - selectStartPosRef.current.x,
          mousePosRef.current.y - selectStartPosRef.current.y
        );
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const { deltaX, deltaY } = event;
      resizeCanvas();

      ctx.translate(topLeftOfSchemRef.current.x, topLeftOfSchemRef.current.y);

      const zoomIntensity = 0.1;
      const zoom = Math.exp((deltaY * zoomIntensity) / 100);
      scale.current *= zoom;

      drawGrid();
    };

    const mousedown = (event) => {
      if (event.buttons == 1) {
        leftMouse.current = true;
        selectStartPosRef.current = mousePosRef.current;
        if (currentToolRef.current === "wire" && !drawingWire.current) {
          drawingWire.current = true;
        }
        if (drawingWire.current) {
          if (currentWirePoints.current.length > 0) {
            const currentMousePos = getCurrentClosestGridToMouse();
            const lastPoint =
              currentWirePoints.current[currentWirePoints.current.length - 1];

            if (
              currentMousePos.x != lastPoint.x &&
              !constrainedDrawnWireToYAxis.current
            ) {
              currentWirePoints.current.push({
                x: currentMousePos.x,
                y: lastPoint.y,
              });
              currentWirePoints.current.push({
                x: currentMousePos.x,
                y: currentMousePos.y,
              });
            } else if (
              currentMousePos.x != lastPoint.x &&
              constrainedDrawnWireToYAxis.current
            ) {
              currentWirePoints.current.push({
                x: lastPoint.x,
                y: currentMousePos.y,
              });
              currentWirePoints.current.push({
                x: currentMousePos.x,
                y: currentMousePos.y,
              });
            } else {
              currentWirePoints.current.push(getCurrentClosestGridToMouse());
            }
          } else {
            currentWirePoints.current.push(getCurrentClosestGridToMouse());
          }
        }
      }
      if (event.buttons == 4) {
        event.preventDefault();
        middleMouse.current = true;
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleContextMenu = (e) => {
      // prevent the right-click menu from appearing
      e.preventDefault();
      if (drawingWire.current) {
        wirePoints.current.push(currentWirePoints.current);
        currentWirePoints.current = [];
        drawingWire.current = false;
      }
    };

    const mouseup = (event) => {
      middleMouse.current = false;
      leftMouse.current = false;

      if (canDragRef.current) {
        const selectionBoxInGrid = convertScreenPosToGrid(
          mousePosRef.current.x,
          mousePosRef.current.y
        );

        const selectStartPosRefInGrid = convertScreenPosToGrid(
          selectStartPosRef.current.x,
          selectStartPosRef.current.y
        );

        const selectionBox = {
          x: selectStartPosRefInGrid.x,
          y: selectStartPosRefInGrid.y,
          width: selectionBoxInGrid.x - selectStartPosRefInGrid.x,
          height: selectionBoxInGrid.y - selectStartPosRefInGrid.y,
        };

        isWireInSelection(wirePoints.current, selectionBox); // set the selectedWiresRef
      }

      if (draggingWirePoint.current) {
        draggingWirePoint.current = false;
      }

      drawGrid();
    };

    const mousemove = (event) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };

      const dx = mousePosRef.current.x - lastMousePosRef.current.x;
      const dy = mousePosRef.current.y - lastMousePosRef.current.y;
      currentPosRef.current = {
        x: currentPosRef.current.x + dx,
        y: currentPosRef.current.y + dy,
      };

      currentGridPosRef.current = {
        x: currentPosRef.current.x + dx,
        y: currentPosRef.current.y + dy,
      };

      if (middleMouse.current) {
        ctx.translate(dx, dy);
        topLeftOfSchemRef.current = {
          x: topLeftOfSchemRef.current.x + dx,
          y: topLeftOfSchemRef.current.y + dy,
        };
      }

      if (currentToolRef.current === null && leftMouse.current) {
        const mouseGridPos = getCurrentClosestGridToMouse(false);
        const mouseGridPosRounded = getCurrentClosestGridToMouse();

        wirePoints.current.forEach((wire) => {
          wire.some((point) => {
            if (
              Math.abs(point.x - mouseGridPos.x) < 1.5 &&
              Math.abs(point.y - mouseGridPos.y) < 1.5
            ) {
              draggingWirePoint.current = true;

              if (Math.abs(dx / (schematicWidth / gridCountX)) > 0.01) {
                point.x = mouseGridPosRounded.x;
              }

              if (Math.abs(dy / (schematicHeight / gridCountY)) > 0.01) {
                point.y = mouseGridPosRounded.y;
              }
            }
          });
        });
      }

      lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      drawGrid(); // might need to optimise to decide when we can redraw the grid
    };

    const resizeHandler = (event) => {
      resizeCanvas();
      drawGrid();
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        if (currentToolRef.current === "wire") {
          if (currentWirePoints.current.length > 0) {
            wirePoints.current.push([currentWirePoints.current]);
          }
          currentWirePoints.current = [];
          drawingWire.current = false;
        }
        setCurrentTool(null);
      }
      if (event.key === "Delete") {
        wirePoints.current.forEach((wire) => {
          selectedWiresRef.current.forEach((selectedWire) => {
            if (selectedWire === wire) {
              wirePoints.current = wirePoints.current.filter((w) => w !== wire);
            }
          });
        });
        selectedWiresRef.current = [];
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("contextmenu", handleContextMenu);

    const startPadding = { x: (1920 - 1600) / 2, y: 10 };
    currentPosRef.current = startPadding;
    topLeftOfSchemRef.current = startPadding;

    drawGrid();
    ctx.translate(startPadding.x, startPadding.y);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const isWireInSelection = (wire, selectionBox) => {
    selectedWiresRef.current = [];
    wire.forEach((wireSet) => {
      wireSet.forEach((point) => {
        const normalizedSelectionBox = {
          x: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
          y: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
          width: Math.abs(selectionBox.width),
          height: Math.abs(selectionBox.height),
        };

        if (
          point.x > normalizedSelectionBox.x &&
          point.x < normalizedSelectionBox.x + normalizedSelectionBox.width &&
          point.y > normalizedSelectionBox.y &&
          point.y < normalizedSelectionBox.y + normalizedSelectionBox.height
        ) {
          if (!selectedWiresRef.current.includes(wireSet)) {
            selectedWiresRef.current.push(wireSet);
          }
        }
      });
    });
  };

  return (
    <div>
      <ToolSelector currentTool={currentTool} setCurrentTool={setCurrentTool} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: darkModeTheme.primary,
          padding: 0,
        }}
      />
    </div>
  );
}

export default SchematicEditor;
