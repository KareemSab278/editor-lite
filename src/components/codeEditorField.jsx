import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

export { CodeEditorField };

const CodeEditorField = ({ fileName, codeText, setCodeText }) => {
  return (
    <section style={styles.body}>
      <div style={styles.header}>{fileName}</div>
      <Editor
        value={codeText}
        onValueChange={setCodeText}
        highlight={(code) =>
          Prism.highlight(code, Prism.languages.javascript, "javascript")
        }
        padding={16}
        style={styles.editor}
      />
    </section>
  );
};

const styles = {
  body: {
    background: "#1e1e1e",
    borderRadius: 4,
    border: "1px solid #222",
    margin: "1rem 0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: 0,
  },
  header: {
    background: "#23272e",
    color: "#d4d4d4",
    fontFamily: 'Consolas, "Fira Mono", "Menlo", monospace',
    fontSize: 14,
    padding: "0.5rem 1rem",
    borderBottom: "1px solid #222",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  editor: {
    background: "#1e1e1e",
    color: "#d4d4d4",
    fontFamily: 'Consolas, "Fira Mono", "Menlo", monospace',
    fontSize: 14,
    outline: "none",
    minHeight: 500,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
};
