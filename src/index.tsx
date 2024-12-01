import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ContextWrapper from "./context";
import "./index.css";

const rootEl = document.getElementById("root");

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
}
