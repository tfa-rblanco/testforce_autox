import React, { useState } from "react";
import axios from "axios";
import ElementInspector from "./components/ElementInspector";


import ScenarioBuilder from "./components/ScenarioBuilder";
import TestFlowDisplay from "./components/TestFlowDisplay";
import ExecutionResultsDisplay from "./components/ExecutionResultsDisplay";
import InspectorControls from "./components/InspectorControls";
import LoadingOverlay from "./components/LoadingOverlay";
import  config from "./config";
const initialSteps = [];

function App() {
  const [headless, setHeadless] = useState(false);
  const [stepsList, setStepsList] = useState(initialSteps);
  const [executionResults, setExecutionResults] = useState([]);
  const [showInspector, setShowInspector] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inspectUrl, setInspectUrl] = useState("");
  const [loading, setLoading] = useState(false);


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
      setExecutionResults([]); // Clear previous results
      setLoading(true); // Show the spinner
      const res = await axios.post(
        `${config.API_BASE_URL}/execute?headless=${headless}`,
        { steps: stepsList }
      );
      setExecutionResults(res.data.results || []);
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setLoading(false); // Hide the spinner once done
    }
  };

  const launchInspectableBrowser = async () => {
    try {
      await axios.post(`${config.API_BASE_URL}/launch-browser`, {
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

  const handleHeadLessCheckboxChange = (event) => {
    setHeadless(event.target.checked);
  };

  return (
    <>
      <ScenarioBuilder
        headless={headless}
        handleHeadLessCheckboxChange={handleHeadLessCheckboxChange}
        executeWorkflow={executeWorkflow}
        onAddStep={addOrUpdateStep}
        prefill={prefillData}
        isEditing={editingIndex !== null}
      />

      {stepsList.length > 0 && (
        <TestFlowDisplay
          stepsList={stepsList}
          setStepsList={setStepsList}
          setExecutionResults={setExecutionResults}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          editSelectedStep={editSelectedStep}
          deleteSelectedStep={deleteSelectedStep}
        />
      )}

      {loading && <LoadingOverlay />}

      {executionResults.length > 0 && (
        <ExecutionResultsDisplay executionResults={executionResults} />
      )}

      <InspectorControls
        inspectUrl={inspectUrl}
        setInspectUrl={setInspectUrl}
        launchInspectableBrowser={launchInspectableBrowser}
        showInspector={showInspector}
        toggleInspector={toggleInspector}
      />

      {showInspector && <ElementInspector />}
    </>
  );
}

export default App;