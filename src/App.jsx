import { useState, useRef } from "react";
import { Checkbox,Spin } from "antd";
import TestSteps from "./components/TestSteps";
import axios from "axios";
import ElementInspector from "./components/ElementInspector";
import { saveStepsToFile, loadStepsFromFile } from "./utils/testFlowStorage";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const initialSteps = [];

function SortableStep({ step, index, selectedIndex, setSelectedIndex }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#555" : "transparent",
    padding: "2px",
    borderRadius: "1px",
    marginBottom: "1px",
    cursor: "grab",
  };

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



function App() {
    const [headless, setHeadless] = useState(false); 
  const [stepsList, setStepsList] = useState(initialSteps);
  const [executionResults, setExecutionResults] = useState([]);
  const [showInspector, setShowInspector] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inspectUrl, setInspectUrl] = useState("");
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

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
      setExecutionResults([]);  // Clear previous results
      setLoading(true); // Show the spinner
      const res = await axios.post(`http://localhost:4000/execute?headless=${headless}`, { steps: stepsList });
      setExecutionResults(res.data.results || []);     
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setLoading(false); // Hide the spinner once done
    }
  };

  const launchInspectableBrowser = async () => {
    try {
      await axios.post("http://localhost:4000/launch-browser", {
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      setStepsList((steps) => arrayMove(steps, oldIndex, newIndex));
    }
  };


  const handleHeadLessCheckboxChange = (event) => {
    setHeadless(event.target.checked); // Update the headless state based on checkbox
  };



  return (
    <>
      <div id="scenario-builder" style={{alignItems:"center"}}>
        <h2>Testing Scenario Builder</h2>
  
        <TestSteps
          onAddStep={addOrUpdateStep}
          prefill={prefillData}
          isEditing={editingIndex !== null}
        />
  
        <Checkbox checked={headless} onChange={handleHeadLessCheckboxChange} style={{ color: 'white', width: "80px", marginTop: "20px" }}>
          Headless
        </Checkbox>
  
        <button className="bottom-button" onClick={executeWorkflow} style={{ marginTop: '10px' }}>
          Execute
        </button>
      </div>
  
      {stepsList.length > 0 && (
        <div id="scenario-builder">
          <h3>Test Execution Flow</h3>
  
          <div style={{ marginBottom: '10px' }}>
            <button onClick={() => saveStepsToFile(stepsList)} style={{ marginLeft: '10px' }}>Save Steps</button>
            <button onClick={() => fileInputRef.current.click()} style={{ marginLeft: '10px' }}>Load Steps</button>
            <button onClick={editSelectedStep} disabled={selectedIndex === null} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={deleteSelectedStep} disabled={selectedIndex === null} style={{ marginLeft: '10px' }}>Delete</button>
          </div>
  
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stepsList.map((_, i) => i)} strategy={verticalListSortingStrategy}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
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
            style={{ display: 'none' }}
            onChange={(e) => loadStepsFromFile(e, setStepsList, setExecutionResults)}
          />
        </div>
      )}
  
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <Spin size="large" tip="Executing workflow..." />
        </div>
      )}
  
      {executionResults.length > 0 && (
        <div id="scenario-builder">
          <h3>Execution Results</h3>
          <ul>
            {executionResults.map((res, idx) => (
              <li key={idx} style={{ color: res.status === 'passed' ? 'green' : 'red', marginBottom: '8px' }}>
                <strong>Step {idx + 1}:</strong> {res.action} on {res.selector || res.url} - <em>{res.status}</em>
                {res.message && (
                  <div style={{ color: 'gray', fontSize: '0.9em' }}>
                    ⚠️ <i>{res.message}</i>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
  
      <div id="scenario-builder">
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="inspect-url" style={{ marginRight: '8px' }}>
            URL to inspect:
          </label>
          <input
            id="inspect-url"
            value={inspectUrl}
            onChange={(e) => setInspectUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ marginRight: '8px', padding: '6px', width: '300px' }}
          />
          <button onClick={launchInspectableBrowser} style={{ marginLeft: '10px' }}>Launch</button>
          <button onClick={toggleInspector} style={{ marginLeft: '10px' }}>
            {showInspector ? 'Hide Inspector' : 'Show Inspector'}
          </button>
        </div>
  
        {showInspector && <ElementInspector />}
      </div>
    </>
  );
  
  
}

export default App;
