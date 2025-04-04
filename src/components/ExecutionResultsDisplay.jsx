import React from "react";

function ExecutionResultsDisplay({ executionResults }) {
  return (
    <div id="scenario-builder">
      <h3>Execution Results</h3>
      <ul>
        {executionResults.map((res, idx) => (
          <li
            key={idx}
            style={{ color: res.status === "passed" ? "green" : "red", marginBottom: "8px" }}
          >
            <strong>Step {idx + 1}:</strong> {res.action} on {res.selector || res.url} -{" "}
            <em>{res.status}</em>
            {res.message && (
              <div style={{ color: "gray", fontSize: "0.9em" }}>
                ⚠️ <i>{res.message}</i>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExecutionResultsDisplay;