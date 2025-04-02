import { useState, useEffect } from "react";

const stepsAction = ["Select steps", "Navigate", "Click", "Type", "Assert"];

export default function TestSteps({ onAddStep, prefill, isEditing }) {
    const [selectedStep, setSelectedStep] = useState("Select steps");
    const [locator, setLocator] = useState("");
    const [value, setValue] = useState("");

    // If prefill data is passed (for editing), populate the form
    useEffect(() => {
        if (prefill) {
            setSelectedStep(prefill.action);
            setLocator(prefill.selector || prefill.url || "");
            setValue(prefill.value || prefill.expected || "");
        }
    }, [prefill]);

    function handleTestSteps(event) {
        setSelectedStep(event.target.value);
    }

    function handleAddOrUpdateStep() {
        if (selectedStep !== "Select steps") {
            const stepDetails = {
                action: selectedStep,
                selector: selectedStep !== "Navigate" ? locator : null,
                value: (selectedStep === "Type" || selectedStep === "Assert") ? value : null,
                url: selectedStep === "Navigate" ? locator : null,
                expected: selectedStep === "Assert" ? value : null
            };
            onAddStep(stepDetails);

            // Clear the form
            setSelectedStep("Select steps");
            setLocator("");
            setValue("");
        }
    }

    return (
        <div className="test-steps-container">
            <div className="form-group">
                <label htmlFor="steps-select">Steps</label>
                <select id="steps-select" value={selectedStep} onChange={handleTestSteps}>
                    {stepsAction.map((step) => (
                        <option key={step} value={step}>
                            {step}
                        </option>
                    ))}
                </select>
                {selectedStep === "Select steps" && (
                    <label className="multiline-label">
                        Unlock the capabilities of AutoX. Design and execute your test automation scenario now!
                    </label>
                )}
            </div>

            {selectedStep !== "Select steps" && (
                <>
                    <div className="form-group">
                        <label htmlFor="input-field">
                            {selectedStep === "Navigate" ? "Enter URL" : "Enter Locator"}
                        </label>
                        <input
                            id="input-field"
                            placeholder={selectedStep === "Navigate" ? "https://example.com" : "e.g. #submit"}
                            value={locator}
                            onChange={(e) => setLocator(e.target.value)}
                        />
                    </div>

                    {(selectedStep === "Type" || selectedStep === "Assert") && (
                        <div className="form-group">
                            <label htmlFor="value-field">Enter Value</label>
                            <input
                                id="value-field"
                                placeholder="enter value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="action-button">Action</label>
                        <button id="action-button" onClick={handleAddOrUpdateStep}>
                            {isEditing ? "Update Step" : "Add Step"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
