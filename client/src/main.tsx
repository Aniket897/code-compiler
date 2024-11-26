import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import EditorContextProvider from "./contexts/EditorContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EditorContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </EditorContextProvider>
  </StrictMode>
);
