// this file handles the tool interaction state machine:
// if no tool is selected, then the user can select items, click and move, etc
// otherwise if a tool is selected then it should talk to the schematicEditorRenderer
// to tell it to draw a placableGhost on the cursor on the grid where it will be placed,
// etc etc

import { Placable } from "./placable";
import { SchematicElement } from "./schematicElement";
import { NonElectronicSchematicElement } from "./nonTronicSchematicElement";

export class PlacableInstantiater {
  private selectedTool:
    | NonElectronicSchematicElement
    | SchematicElement
    | null = null;
  private placementPosition: { x: number; y: number } | null = null;

  constructor() {
    // Initialize the state machine
  }

  // Select a tool for placement
  selectTool(tool: NonElectronicSchematicElement | SchematicElement) {
    this.selectedTool = tool;
    this.placementPosition = null; // Reset placement position
  }

  // Deselect the current tool
  deselectTool() {
    this.selectedTool = null;
    this.placementPosition = null;
  }

  // Update the placement position based on cursor movement
  updatePlacementPosition(x: number, y: number) {
    if (this.selectedTool) {
      this.placementPosition = { x, y };
    }
  }

  // Get the current placement position
  getPlacementPosition() {
    return this.placementPosition;
  }

  // Check if a tool is selected
  isToolSelected() {
    return this.selectedTool !== null;
  }

  getCurrentSelectedTool() {
    return this.selectedTool;
  }

  // Handle placement action (e.g., when the user clicks to place an item)
  placeItem() {
    if (this.selectedTool && this.placementPosition) {
      const placedItem = {
        tool: this.selectedTool,
        position: this.placementPosition,
      };
      this.placementPosition = null; // Reset position after placement
      return placedItem; // Return the placed item details
    }
    return null; // No item placed
  }
}
