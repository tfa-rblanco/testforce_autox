import { useState, useRef } from "react";
import TestSteps from "./components/TestSteps";
import axios from "axios";
import ElementInspector from "./components/ElementInspector";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { saveStepsToFile, loadStepsFromFile } from "./utils/testFlowStorage";

const initialSteps = [];


function App() {
  const [stepsList, setStepsList] = useState(initialSteps);
  const [executionResults, setExecutionResults] = useState([]);
  const [showInspector, setShowInspector] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inspectUrl, setInspectUrl] = useState("");
  const fileInputRef = useRef();

  function addOrUpdateStep(step) {
    const updatedSteps = [...stepsList];
    if (editingIndex !== null) {
      updatedSteps[editingIndex] = step;
      setStepsList(updatedSteps);
      setEditingIndex(null);
    } else {
      setStepsList([...stepsList, step]);
    }
    setPrefillData(null);
    setExecutionResults([]);
    setSelectedIndex(null);
  }

  function deleteSelectedStep() {
    if (selectedIndex !== null) {
      const newSteps = [...stepsList];
      newSteps.splice(selectedIndex, 1);
      setStepsList(newSteps);
      setExecutionResults([]);
      setSelectedIndex(null);
    }
  }

  function editSelectedStep() {
    if (selectedIndex !== null) {
      setEditingIndex(selectedIndex);
      setPrefillData(stepsList[selectedIndex]);
    }
  }

  const executeWorkflow = async () => {
    try {
      const res = await axios.post("http://localhost:3000/execute", { steps: stepsList });
      setExecutionResults(res.data.results || []);
      alert("Workflow executed!");
    } catch (error) {
      console.error("Execution failed:", error);
    }
  };

  const launchInspectableBrowser = async () => {
    try {
      await axios.post("http://localhost:3000/launch-browser", {
        url: inspectUrl,
      });
      alert("Inspectable browser launched!");
    } catch (error) {
      console.error("Browser launch failed:", error);
    }
  };

  const toggleInspector = () => {
    setShowInspector((prev) => !prev);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(stepsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStepsList(items);
  };

  return (
    <>
      <div id="scenario-builder">
        <h2>Testing Scenario Builder</h2>
        <TestSteps
          onAddStep={addOrUpdateStep}
          prefill={prefillData}
          isEditing={editingIndex !== null}
        />
        <button className="bottom-button" onClick={executeWorkflow}>Execute</button>
      </div>

      {stepsList.length > 0 && (
        <div id="scenario-builder">
          <h3>Test Execution Flow</h3>

          <div style={{ marginBottom: "10px" }}>
            <button onClick={() => saveStepsToFile(stepsList)} style={{ marginLeft: "10px" }}>Save Steps</button>
            <button onClick={() => fileInputRef.current.click()} style={{ marginLeft: "10px" }}>Load Steps</button>
            <button onClick={editSelectedStep} disabled={selectedIndex === null} style={{ marginLeft: "10px" }}>Edit</button>
            <button onClick={deleteSelectedStep} disabled={selectedIndex === null} style={{ marginLeft: "10px" }}>Delete</button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} style={{ listStyle: "none", padding: 0 }}>
                  {stepsList.map((step, index) => (
                    <Draggable key={index} draggableId={`step-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: snapshot.isDragging ? "#555" : "transparent",
                            padding: "2px",
                            borderRadius: "1px",
                            marginBottom: "1px",
                            ...provided.draggableProps.style
                          }}
                        >
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => loadStepsFromFile(e, setStepsList, setExecutionResults)}
          />
        </div>
        
      )}

      {executionResults.length > 0 && (
        <div id="scenario-builder">
          <h3>Execution Results</h3>
          <ul>
            {executionResults.map((res, idx) => (
              <li key={idx} style={{ color: res.status === "passed" ? "green" : "red", marginBottom: "8px" }}>
                <strong>Step {idx + 1}:</strong> {res.action} on {res.selector || res.url} - <em>{res.status}</em>
                {res.message && (
                  <div style={{ color: "gray", fontSize: "0.9em" }}>
                    ⚠️ <i>{res.message}</i>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div id="scenario-builder">
        <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="inspect-url" style={{ marginRight: "8px" }}>
              URL to inspect:
            </label>
            <input
              id="inspect-url"
              value={inspectUrl}
              onChange={(e) => setInspectUrl(e.target.value)}
              placeholder="https://example.com"
              style={{ marginRight: "8px", padding: "6px", width: "300px" }}
            />
            <button onClick={launchInspectableBrowser} style={{ marginLeft: "10px" }}>Launch</button>
            <button onClick={toggleInspector} style={{ marginLeft: "10px" }}>
              {showInspector ? "Hide Inspector" : "Show Inspector"}
            </button>
          </div>

          
          {showInspector && <ElementInspector />}
      </div>
    </>
  );
}

export default App;
