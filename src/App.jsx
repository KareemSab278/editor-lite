import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [codeText, setCodeText] = useState("");

  async function saveCodeText() {
    setCodeText(await invoke("save_code_text", { codeText: codeText }));
  }

  return (
    <section>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          saveCodeText();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setCodeText(e.currentTarget.value)}
          placeholder="Enter code text..."
        />
        <button type="submit">save</button>
      </form>
      <pre>{codeText}</pre>
    </section>
  );
}

export default App;
