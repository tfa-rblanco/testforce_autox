import { useState } from "react";

const stepsAction = ["Select steps", "Navigate", "Click", "Type", "Assert"];

export default function TestSteps() {
    const [testSteps, setTestSteps] = useState('Select steps');

    function handleTestSteps(event) {
        setTestSteps(event.target.value);
    }
    return (
        <div className="test-steps-container">
            <div className="form-group">
                <label htmlFor="steps-select">Steps</label>
                <select id="steps-select" value={testSteps} onChange={handleTestSteps}>
                    {stepsAction.map((steps) => (
                        <option key={steps} value={steps}>
                            {steps === "" ? "Select steps" : steps}
                        </option>
                    ))}
                </select>
            </div>
            {console.log(testSteps)}
            {testSteps ==="Select steps" && (
                <label class="multiline-label">Unlock the capabilities of AutoX. Design and execute your test automation scenario now!</label>
            )}
            {testSteps !== "Select steps" && (
                <div className="form-group">
                    <label htmlFor="input-field">Enter Locator</label>
                    <input id="input-field" placeholder="enter locator" />
                </div>
            )}

            {(testSteps === "Type" || testSteps === "Assert") && (
                <div className="form-group">
                    <label htmlFor="input-field">Enter Value</label>
                    <input id="input-field" placeholder="enter value" />
                </div>
            )}
            {testSteps !== "Select steps" && (
                <div className="form-group">
                    <label htmlFor="add-button">Action</label>
                    <button id="add-button">Add Step</button>
                </div>
            )}
        </div>
    );
}