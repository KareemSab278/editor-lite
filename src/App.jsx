import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CodeEditorField } from "./components/codeEditorField";

export { App };

const App = () => {
  const [codeText, setCodeText] = useState("");
  const file = useRef(null);

  const saveCodeText = async () => {
    if (!file.current.name) {
      alert("No file selected. Please select a file to save.");
      return;
    }

    if (!codeText) {
      alert(
        "Imagine saving an empty file. Please enter some code before saving. Even space counts!",
      );
      return;
    }

    setCodeText(
      await invoke("save_code_text", {
        codeText: codeText,
        fileName: file.current?.name,
      }),
    );
  };

  const getFileContent = async () => {
    // this rust fn will handle the file reading and return the content to the frontend. youll also select the file with it
    const content = await invoke("get_file_content");
    if (!content) {
      alert(
        "Could not read file content. Please make sure the file is not empty and try again.",
      );
      return;
    }
    setCodeText(content);
  };

  return (
    <div style={styles.body}>
      <CodeEditorField fileName={file.current?.name} codeText={codeText} />
      <button onClick={saveCodeText}>Save</button>
      <button onClick={getFileContent}>Open File</button>
    </div>
  );
};

const styles = {
  body: {
    background: "#1e1e1e",
    minHeight: "100vh",
    padding: 0,
    margin: 0,
  },
};
