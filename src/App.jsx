import React, { useState } from "react";
import axios from "axios";
import ElementInspector from "./components/ElementInspector";
import '@ant-design/v5-patch-for-react-19';
import ScenarioBuilder from "./components/ScenarioBuilder";
import TestFlowDisplay from "./components/TestFlowDisplay";
import ExecutionResultsDisplay from "./components/ExecutionResultsDisplay";
import InspectorControls from "./components/InspectorControls";

import config from "./config";
import "./index.css";
import Execution from "./components/Execution";

const initialSteps = [];

function App() {
  const [activeSection, setActiveSection] = useState("builder");
  const [headless, setHeadless] = useState(false);
  const [stepsList, setStepsList] = useState(initialSteps);
  const [executionResults, setExecutionResults] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inspectUrl, setInspectUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
  };

  function deleteSelectedStep() {
    if (selectedIndex !== null) {
      const newSteps = [...stepsList];
      newSteps.splice(selectedIndex, 1);
      setStepsList(newSteps);
      setExecutionResults([]);
      setSelectedIndex(null);
    }
  };

  function editSelectedStep() {
    if (selectedIndex !== null) {
      setEditingIndex(selectedIndex);
      setPrefillData(stepsList[selectedIndex]);
    }
  };

  const executeWorkflow = async () => {
    try {
      setExecutionResults([]);
      setLoading(true);
      const res = await axios.post(
        `${config.API_BASE_URL}/execute?headless=${headless}`,
        { steps: stepsList }
      );
      setExecutionResults(res.data.results || []);
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setLoading(false);
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

  const renderSection = () => {
    switch (activeSection) {
      case "Inspector":
        return (
          <>
            <InspectorControls
              inspectUrl={inspectUrl}
              setInspectUrl={setInspectUrl}
              launchInspectableBrowser={launchInspectableBrowser}
              showInspector={showInspector}
              toggleInspector={() => setShowInspector(!showInspector)}
            />
            {showInspector && <ElementInspector />}
          </>
        );
      case "Builder":
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
          </>
        );
      case "Execution":
        <Execution />
      case "Test Result":
        return executionResults.length > 0 ? (
          <ExecutionResultsDisplay executionResults={executionResults} />
        ) : (
          <p>No results to display yet.</p>
        );
      case "Test Data Management":
        return <p>Test Management Coming Soon!</p>;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">TestForce</div>

        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
    </header>

      <nav className="chevron-nav">
        {["Inspector", "Builder", "Execution", "Test Result", "Test Data Management"].map((section) => (
          <button
            key={section}
            className={`chevron-button ${
              activeSection === section ? "active" : ""
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>
      <main className="chevron-section">{renderSection()}</main>
    </div>
  );
};

export default App;
