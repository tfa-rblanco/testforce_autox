import React from "react";
import TestSteps from "./TestSteps";
import { Checkbox } from "antd";

function ScenarioBuilder({
  headless,
  handleHeadLessCheckboxChange,
  executeWorkflow,
  onAddStep,
  prefill,
  isEditing,
}) {
  return (
    <div id="scenario-builder" style={{ alignItems: "center" }}>
      <h2>Testing Scenario Builder</h2>

      <TestSteps onAddStep={onAddStep} prefill={prefill} isEditing={isEditing} />

      <Checkbox
        checked={headless}
        onChange={handleHeadLessCheckboxChange}
        style={{ color: "white", width: "80px", marginTop: "20px" }}
      >
        Headless
      </Checkbox>

      <button
        className="bottom-button"
        onClick={executeWorkflow}
        style={{ marginTop: "10px" }}
      >
        Execute
      </button>
    </div>
  );
}

export default ScenarioBuilder;