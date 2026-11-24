import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.addEventListener("vite:preloadError", (event) => {
  const key = "vite_preload_retried";
  if (!sessionStorage.getItem(key)) {
    event.preventDefault();
    sessionStorage.setItem(key, "1");
    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
