import React, { useRef } from "react";
import SortableStep from "./SortableStep";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { saveStepsToFile, loadStepsFromFile } from "../utils/testFlowStorage";

function TestFlowDisplay({
  stepsList,
  setStepsList,
  setExecutionResults,
  selectedIndex,
  setSelectedIndex,
  editSelectedStep,
  deleteSelectedStep,
}) {
  const fileInputRef = useRef();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      setStepsList((steps) => arrayMove(steps, oldIndex, newIndex));
    }
  };

  return (
    <div id="scenario-builder">
      <h3>Test Execution Flow</h3>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => saveStepsToFile(stepsList)} style={{ marginLeft: "10px" }}>
          Save Steps
        </button>
        <button onClick={() => fileInputRef.current.click()} style={{ marginLeft: "10px" }}>
          Load Steps
        </button>
        <button
          onClick={editSelectedStep}
          disabled={selectedIndex === null}
          style={{ marginLeft: "10px" }}
        >
          Edit
        </button>
        <button
          onClick={deleteSelectedStep}
          disabled={selectedIndex === null}
          style={{ marginLeft: "10px" }}
        >
          Delete
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stepsList.map((_, i) => i)} strategy={verticalListSortingStrategy}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stepsList.map((step, index) => (
              <SortableStep
                key={index}
                index={index}
                step={step}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => loadStepsFromFile(e, setStepsList, setExecutionResults)}
      />
    </div>
  );
}

export default TestFlowDisplay;