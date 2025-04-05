import LoadingOverlay from "./LoadingOverlay";

export default function Execution() {
    return loading ? <LoadingOverlay /> : <p>Ready to Execute Workflow</p>;
}