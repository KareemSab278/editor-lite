import { useRef, useState, useEffect, use } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CodeEditorField } from "./components/codeEditorField";
import { PrimaryModal } from "./components/fileSelectorModal";
import { PrimaryButton } from "./components/buttons";
import { trackBackPath, handleKeyPress } from "./helpers";

export { App };

const App = () => {
  const [codeText, setCodeText] = useState("");
  const [selectedPath, setSelectedPath] = useState(
    "C:/Users\\coinadrink\\Desktop\\projects",
  );
  const [dirFiles, setDirFiles] = useState([]);
  const [fileExplorerModalOpen, setFileExplorerModalOpen] = useState(false);
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

  const keysHmap = {
    "Control+e": () => setFileExplorerModalOpen(true),
    "Control+s": async () => await saveCodeText(),
    "Control+q": () => invoke("kill_app"),
  };

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      const keyString = `${event.ctrlKey ? "Control+" : ""}${event.key}`;
      const isShortcut = handleKeyPress(keyString, keysHmap);
      if (isShortcut) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPressEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyPressEvent);
    };
  }, [keysHmap]);

  useEffect(() => {
    selectedPath &&
      invoke("list_dir", { path: selectedPath }).then(setDirFiles);
  }, [selectedPath]);

  const getFileContent = async () => {
    const content = await invoke("get_file_content", {
      filePath: file.current?.name,
    });
    return content
      ? setCodeText(content)
      : alert("File is empty. Please select a file with content."); // will need alert component ltr
  };

  const lsDir = async () => {
    const files = await invoke("list_dir", { path: selectedPath });
    setDirFiles(files);
    console.log("Directory files:", files);
  };

  return (
    <div style={styles.body}>
      <CodeEditorField
        fileName={file.current?.name}
        codeText={codeText}
        setCodeText={setCodeText}
      />

      <PrimaryButton title="save" onClick={async () => await saveCodeText()} />

      <PrimaryButton
        title="Explorer"
        onClick={async () => {
          await lsDir();
          setFileExplorerModalOpen(true);
        }}
      />

      <PrimaryModal
        opened={fileExplorerModalOpen}
        closed={() => setFileExplorerModalOpen(false)}
        title={`Select a file from: ${selectedPath}`}
        children={
          <div style={{ padding: "1rem" }}>
            <PrimaryButton
              title="Back"
              onClick={() => {
                setSelectedPath(trackBackPath(selectedPath));
                lsDir();
              }}
            />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                      setFileExplorerModalOpen(false);
                    }
                  }}
                  style={{
                    ...styles.modalBody,
                    background: fileObj.is_dir
                      ? "rgba(100, 150, 200, 0.2)"
                      : "rgba(100, 200, 100, 0.1)",
                    color: fileObj.is_dir ? "#64b5ff" : "#64c864",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = fileObj.is_dir
                      ? "rgba(100, 150, 200, 0.4)"
                      : "rgba(100, 200, 100, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = fileObj.is_dir
                      ? "rgba(100, 150, 200, 0.2)"
                      : "rgba(100, 200, 100, 0.1)";
                  }}
                >
                  {fileObj.is_dir ? "📁 " : "📄 "} {fileObj.name}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
};

const styles = {
  body: {
    background: "#000000",
    minHeight: "100vh",
    padding: 0,
    margin: 0,
  },
  modalBody: {
    padding: "0.75rem",
    marginBottom: "0.5rem",
    border: "1px solid #333",
    borderRadius: 4,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};
