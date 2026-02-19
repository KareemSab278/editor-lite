import { useRef, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CodeEditorField } from "./components/codeEditorField";
import { PrimaryModal } from "./components/fileSelectorModal";
import { PrimaryButton, TabButton } from "./components/buttons";
import { handleKeyPress, Path, helpText, returnFileTypeImage } from "./helpers";

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
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const clearStatusMessage = setTimeout(() => {
      setStatusMessage("");
    }, 2000);
    return () => clearTimeout(clearStatusMessage);
  }, [statusMessage]);

  useEffect(() => {
    const returnOperatingSystem = async () => {
      const os = await invoke("get_os");
      setOs(os);
      setSelectedPath(os === "windows" ? "C:\\Users\\" : "/home");
      pathStack.current.push(os === "windows" ? "C:\\Users\\" : "/home");
    };
    returnOperatingSystem();
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
    console.log("Saved file:", file.current?.name);
  };

  const openTerminal = async () =>
    invoke("start_terminal", { path: pathStack?.current.peek() });

  const keysHmapRef = useRef({});
  keysHmapRef.current = {
    "Control+e": () => setOpenModal("fileExplorer"),
    "Control+q": () => invoke("kill_app"),
    "Control+j": () => openTerminal(),
    "Control+H": () => setOpenModal("help"),
    "Control+w": () => closeCurrentFile(),
    "Control+s": async () => {
      if (!file.current?.name) {
        alert("No file selected. Please select a file to save.");
        return;
      }
      await saveCodeText();
    },
    Backspace: () => {
      if (openModal === "fileExplorer") {
        if (!pathStack.current.isEmpty()) {
          pathStack.current.pop();
          setSelectedPath(pathStack.current.peek());
          invoke("list_dir", { path: pathStack.current.peek() }).then(
            setDirFiles,
          );
        }
      }
    },
    Escape: () => {
      setOpenModal("");
      setStatusMessage("");
    },
  };

  const closeCurrentFile = () => {
    const currentPath = file.current?.name;
    if (!currentPath) return;

    setFiles((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return [];
      const idx = prev.findIndex((p) => p.path === currentPath);
      if (idx === -1) return prev;

      const newFiles = prev.filter((p) => p.path !== currentPath);

      if (newFiles.length === 0) {
        file.current = null;
        setCodeText("");
      } else {
        const nextIndex = idx > 0 ? idx - 1 : 0;
        file.current = { name: newFiles[nextIndex].path };
        getFileContent();
      }
      return newFiles;
    });
  };

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
  }, []);

  useEffect(() => {
    selectedPath &&
      invoke("list_dir", { path: selectedPath }).then(setDirFiles);
  }, [selectedPath]);

  const getFileContent = async () => {
    if (!file.current?.name) return;
    try {
      const content = await invoke("get_file_content", {
        filePath: file.current?.name,
      });
      setCodeText(content);
      return content;
    } catch (err) {
      setStatusMessage("Could not read file: " + err);
    }
  };

  const lsDir = async () => {
    const files = await invoke("list_dir", { path: selectedPath });
    setDirFiles(files);
  };

  return (
    <div style={styles.body}>
      {files.length > 0 && (
        <div style={{ display: "flex", background: "#1e1e1e" }}>
          {files.map((f) => (
            <TabButton
              key={f.path}
              title={f.name}
              active={file.current?.name === f.path}
              onClick={() => {
                file.current = { name: f.path };
                getFileContent();
              }}
            />
          ))}
        </div>
      )}

      <CodeEditorField
        fileName={file.current?.name}
        codeText={codeText}
        setCodeText={setCodeText}
        statusMessage={statusMessage}
      />

      <PrimaryModal
        opened={openModal === "help"}
        closed={() => setOpenModal("")}
        title="Keyboard Shortcuts"
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
                if (!pathStack.current.isEmpty()) {
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
                      setFiles((prev) => {
                        if (prev.find((p) => p.path === fileObj.path))
                          return prev;
                        return [
                          ...prev,
                          { name: fileObj.name, path: fileObj.path },
                        ];
                      });
                      file.current = { name: fileObj.path };
                      getFileContent();
                      setOpenModal("");
                    }
                  }}
                  style={styles.modalBody}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#666";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#444";
                  }}
                >
                  {fileObj.is_dir ? (
                    "📁 "
                  ) : (
                    <img
                      src={returnFileTypeImage(fileObj.name)}
                      alt="file icon"
                      style={{ width: 16, height: 16 }}
                    />
                  )}{" "}
                  {fileObj.name}
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
    background: "#444",
    color: "#ffffff",
    fontFamily: "'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    border: "1px solid #333",
    borderRadius: 4,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};
