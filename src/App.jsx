import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CodeEditorField } from "./components/codeEditorField";

export { App };

const App = () => {
  const [codeText, setCodeText] = useState("");
  const [selectedPath, setSelectedPath] = useState("C:/Users/coinadrink");
  // everytime i select a path then it shoul update the selected path and then call lsDir again to show the new path.
  // basically representing a full file system. I think i can also code a back button to go back by slicing until the last / and calling lsDir again.
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

  const lsDir = async () => {
    const files = await invoke("list_dir", { path: selectedPath });
    console.log(files); // i should be showing all the files in a visual gui in a modal but im tired and have work tomorrow lol. bye
  };

  return (
    <div style={styles.body}>
      <CodeEditorField fileName={file.current?.name} codeText={codeText} />
      <button onClick={saveCodeText}>Save</button>
      <button onClick={getFileContent}>Open File</button>
      {/* for testing the ls_files command  */}
      <button onClick={lsDir}>List Dir</button>
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
