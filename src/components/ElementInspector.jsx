import React, { useState, useEffect } from "react";
import config from "../config.js";

const createWebSocket = (setWs) => {
  const ws = new WebSocket(config.WS_BASE_URL);

  ws.onopen = () => {
    console.log("WebSocket connected");
    setWs(ws);
  };

  ws.onclose = () => {
    console.log("WebSocket closed, attempting to reconnect...");
    setTimeout(() => createWebSocket(setWs), 1000);
  };

  return ws;
};

const ElementInspector = () => {
  const [attributes, setAttributes] = useState({});
  const [selectorSuggestion, setSelectorSuggestion] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!ws) {
      createWebSocket(setWs);
    }
  }, [ws]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = event.data;

        const parse = (input) => {
          try {
            const parsed = JSON.parse(input);
            setAttributes(parsed);
            setSelectorSuggestion(suggestSelector(parsed));
          } catch (error) {
            console.error("Error parsing received message:", error);
          }
        };

        if (data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => parse(reader.result);
          reader.readAsText(data);
        } else {
          parse(data);
        }
      };
    }
  }, [ws]);

  const suggestSelector = (attrs) => {
    const { tag, testid, id, name, placeholder, label, title, role, alt, class: className } = attrs;

    if (testid) return `[data-testid="${testid}"]`;
    if (id) return `#${id}`;
    if (name) return `${tag}[name="${name}"]`;
    if (placeholder) return `${tag}[placeholder="${placeholder}"]`;
    if (label) return `${tag}[aria-label="${label}"]`;
    if (title) return `${tag}[title="${title}"]`;
    if (alt) return `${tag}[alt="${alt}"]`;
    if (role) return `${tag}[role="${role}"]`;
    if (className) return `${tag}.${className.trim().split(/\s+/).join('.')}`;
    return tag;
  };

  return (
    <>
      <h3>Element Inspector (Attributes)</h3>
      <pre>{JSON.stringify(attributes, null, 2)}</pre>
      {selectorSuggestion && (
        <>
          <h4>💡 Suggested Selector:</h4>
          <code style={{ backgroundColor: "#333333", padding: "0.5rem", display: "inline-block" }}>
            {selectorSuggestion}
          </code>
        </>
      )}
    </>
  );
};

export default ElementInspector;
