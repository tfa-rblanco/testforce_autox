import React from "react";
import useSortableStep from "../hooks/useSortableStep";

function SortableStep({ step, index, selectedIndex, setSelectedIndex }) {
  const { attributes, listeners, setNodeRef, style } = useSortableStep(index);

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
        <input
          type="radio"
          name="selectedStep"
          value={index}
          checked={selectedIndex === index}
          onChange={() => setSelectedIndex(index)}
        />
        <span><strong>Step {index + 1}:</strong> {step.action} on {step.selector || step.url}</span>
      </label>
    </li>
  );
}

export default SortableStep;