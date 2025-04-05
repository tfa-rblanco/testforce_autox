import React from "react";

function InspectorControls({
  inspectUrl,
  setInspectUrl,
  launchInspectableBrowser,
  showInspector,
  toggleInspector,
}) {
  return (
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
        <button onClick={launchInspectableBrowser} style={{ marginLeft: "10px" }}>
          Launch
        </button>
        <button onClick={toggleInspector} style={{ marginLeft: "10px" }}>
          {showInspector ? "Hide Inspector" : "Show Inspector"}
        </button>
      </div>
    </div>
  );
}

export default InspectorControls;