export function saveStepsToFile(stepsList, fileName = "test-steps.json") {
    const blob = new Blob([JSON.stringify(stepsList, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
  
  export function loadStepsFromFile(event, setStepsList, setExecutionResults) {
    setExecutionResults([]);
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const steps = JSON.parse(e.target.result);
        if (Array.isArray(steps)) {
          setStepsList(steps);
          setExecutionResults([]);
        } else {
          alert("Invalid file format.");
        }
      } catch (err) {
        alert("Failed to parse file: " + err.message);
      }
    };
    reader.readAsText(file);
  }
  