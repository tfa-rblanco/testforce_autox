import React from "react";
import { Spin } from "antd";

function LoadingOverlay({ loadingText = "Executing workflow..." }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Spin size="large" tip={loadingText} />
    </div>
  );
}

export default LoadingOverlay;