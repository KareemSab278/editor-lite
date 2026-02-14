import { useRef, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CodeEditorField } from "./components/codeEditorField";
import { PrimaryModal } from "./components/fileSelectorModal";
import { PrimaryButton } from "./components/buttons";
import { handleKeyPress, Path } from "./helpers";

export { App };

const App = () => {
  const [codeText, setCodeText] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [os, setOs] = useState("");
  const [dirFiles, setDirFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [openModal, setOpenModal] = useState("");
  const pathStack = useRef(new Path());
  const file = useRef(null);

  useEffect(() => {
    const operatingSystem = async () => {
      const os = await invoke("get_os");
      console.log("Operating System:", os);
      setOs(os);
      setSelectedPath(os === "windows" ? "C:\\Users\\" : "/home");
      pathStack.current.push(os === "windows" ? "C:\\Users\\" : "/home");
    };
    operatingSystem();
  }, []);

  const saveCodeText = async () => {
    if (!file.current?.name) {
      alert("No file selected. Please select a file to save.");
      return;
    }
    setStatusMessage(
      await invoke("save_code_text", {
        codeText: codeText,
        fileName: file.current?.name,
      }),
    );
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const keysHmapRef = useRef({
    "Control+e": () => setOpenModal("fileExplorer"),
    "Control+q": () => invoke("kill_app"),
    "Control+j": () => invoke("start_terminal", { path: selectedPath }),
    "Control+h": () => setOpenModal("help"),
    Escape: () => {
      setOpenModal("");
      setStatusMessage("");
    },
    // "Control+s": async () => await saveCodeText(), // this is unpredictable so will be removed for now. it doesnt save anything and sets the file to ""... weird...
    // i wanna add a backspace to the file explorer but it interferes with the code editor so maybe later...
  });

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      const keyString = `${event.ctrlKey ? "Control+" : ""}${event.key}`;
      const isShortcut = handleKeyPress(keyString, keysHmapRef.current);
      if (isShortcut) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPressEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyPressEvent);
    };
  }, [codeText]);

  useEffect(() => {
    selectedPath &&
      invoke("list_dir", { path: selectedPath }).then(setDirFiles);
  }, [selectedPath]);

  const getFileContent = async () => {
    const content = await invoke("get_file_content", {
      filePath: file.current?.name,
    });
    const decodedContent = atob(content);
    setCodeText(decodedContent);
    return content;
  };

  const lsDir = async () => {
    const files = await invoke("list_dir", { path: selectedPath });
    setDirFiles(files);
  };

  return (
    <div style={styles.body}>
      {statusMessage && (
        <div style={{ color: "#757575", padding: "0.1rem" }}>
          {statusMessage}
        </div>
      )}
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
          setOpenModal("fileExplorer");
        }}
      />

      <PrimaryModal
        opened={openModal === "help"}
        closed={() => setOpenModal("")}
        title="Help - Keyboard Shortcuts"
        children={helpText}
      />

      <PrimaryModal
        opened={openModal === "fileExplorer"}
        closed={() => setOpenModal("")}
        title={`Select a file from: ${selectedPath}`}
        children={
          <div style={{ padding: "1rem" }}>
            <PrimaryButton
              title="Back"
              onClick={() => {
                if (pathStack.current.size() > 1) {
                  pathStack.current.pop();
                  setSelectedPath(pathStack.current.peek());
                  lsDir();
                }
              }}
            />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {dirFiles.map((fileObj, index) => (
                <li
                  key={index}
                  onClick={() => {
                    if (fileObj.is_dir) {
                      pathStack.current.push(fileObj.path);
                      setSelectedPath(fileObj.path);
                      lsDir();
                    } else {
                      file.current = { name: fileObj.path };
                      getFileContent();
                      setOpenModal("");
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

const helpText = (
  <div style={{ padding: "1rem", color: "#757575" }}>
    <p> Control + E: Open File Explorer</p>
    <p> Control + S: Save Current File</p>
    <p> Control + J: Open Terminal in Current Directory</p>
    <p> Control + H: Open This Help Modal</p>
    <p> Control + Q: Quit Application</p>
    <p> Escape: Close Modals / Clear Status Messages</p>
  </div>
);

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
