import { useRef, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CodeEditorField } from "./components/codeEditorField";
import { PrimaryModal } from "./components/fileSelectorModal";
import { PrimaryButton } from "./components/buttons";

export { App };

const App = () => {
  const [codeText, setCodeText] = useState("");
  const [selectedPath, setSelectedPath] = useState("C:/Users/coinadrink");
  const [dirFiles, setDirFiles] = useState([]);
  const [fileExplorerModalOpen, setFileExplorerModalOpen] = useState(true);
  const file = useRef(null);

  const saveCodeText = async () => {
    if (!file.current.name) {
      alert("No file selected. Please select a file to save.");
      return;
    }

    return codeText.trim().length > 0
      ? setCodeText(
          await invoke("save_code_text", {
            codeText: codeText,
            fileName: file.current?.name,
          }),
        )
      : alert(
          "Imagine saving an empty file. Please enter some code before saving!",
        );
  };

  const getFileContent = async () => {
    const content = await invoke("get_file_content", {
      file_path: file.current?.name,
    });
    return content
      ? setCodeText(content)
      : alert("File is empty. Please select a file with content."); // will need alert component ltr
  };

  const lsDir = async () => {
    const files = await invoke("list_dir", { path: selectedPath });
    console.log(files);
    setDirFiles(files);
  };

  const fileExplorerModal = (
    <PrimaryModal
      opened={fileExplorerModalOpen}
      closed={() => setFileExplorerModalOpen(false)}
      title="Select a file"
      children={
        <ul>
          {dirFiles.map((fileObj, index) => (
            <li
              key={index}
              onClick={() => {
                if (fileObj.is_dir) {
                  setSelectedPath(fileObj.path);
                  lsDir();
                } else {
                  file.current = { name: fileObj.path };
                  getFileContent();
                }
                setFileExplorerModalOpen(false);
              }}
            >
              {fileObj.name}
            </li>
          ))}
        </ul>
      }
    />
  );

  return (
    <div style={styles.body}>
      <CodeEditorField fileName={file.current?.name} codeText={codeText} />

      {fileExplorerModal}

      <PrimaryButton title="save" onClick={async () => await saveCodeText()} />

      <PrimaryButton
        title="see files"
        onClick={async () => {
          setFileExplorerModalOpen(true);
          await lsDir();
        }}
      />
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
