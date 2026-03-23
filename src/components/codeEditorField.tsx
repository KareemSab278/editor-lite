import Editor from "@monaco-editor/react";

export { CodeEditorField };

type CodeEditorFieldProps = {
  fileName?: string;
  codeText: string | unknown;
  setCodeText: (text: string) => void;
  statusMessage: string | null;
  height?: string;
};

const CodeEditorField = ({
  fileName,
  codeText,
  setCodeText,
  statusMessage,
  height = "100vh",
}: CodeEditorFieldProps) => {
  return (
    <section style={styles.body}>
      <div style={styles.header}>
        {fileName || "Ctrl + Shift + H For Help"} {fileName && " | "} {statusMessage || ""}
      </div>
      <Editor
        height={height}
        defaultLanguage="plaintext"
        language={extToMonacoLang(fileName)}
        value={codeText as string}
        onChange={(value) => setCodeText(value || "")}
        theme="vs-dark"
      />
    </section>
  );
};

function extToMonacoLang(fileName = "") {
  const ext: string = fileName.split(".").pop()?.toLowerCase() || "";
  return {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rs: "rust",
    rb: "ruby",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    go: "go",
    php: "php",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    yml: "yaml",
    yaml: "yaml",
    sln: "plaintext",
  }[ext] || "plaintext";
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    background: "#000000",
    borderRadius: 4,
    border: "1px solid #222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: 0,
  },
  header: {
    background: "#ffd0002a",
    color: "#d4d4d4",
    fontFamily: 'Consolas, "Fira Mono", "Menlo", monospace',
    fontSize: 12,
    height: 15,
  },
  statusMessage: {
    background: "#5171ff2a",
    color: "#d4d4d4",
    fontFamily: 'Consolas, "Fira Mono", "Menlo", monospace',
    fontSize: 12,
    height: 15,
  },
  editor: {
    background: "#000000",
    color: "#d4d4d4",
    fontFamily: 'Consolas, "Fira Mono", "Menlo", monospace',
    fontSize: 14,
    outline: "none",
    minHeight: 500,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
};