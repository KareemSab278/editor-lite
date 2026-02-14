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
    background: "#000000",
    borderRadius: 4,
    border: "1px solid #222",
    margin: "1rem 0",
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
