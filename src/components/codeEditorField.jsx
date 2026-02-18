import { useState } from "react";
import Editor from "react-simple-code-editor";
import { findLangFromFile } from "../helpers";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-c";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-elixir";
import "prismjs/components/prism-fsharp";
import "prismjs/components/prism-git";
import "prismjs/components/prism-go";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-groovy";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-makefile";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-php-extras";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-textile";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-wasm";
import "prismjs/components/prism-yaml";

export { CodeEditorField };

const CodeEditorField = ({ fileName, codeText, setCodeText, statusMessage }) => {
  return (
    <section style={styles.body}>
      <div style={styles.header}>{fileName || 'No File Selected'} {fileName && ' | '} {statusMessage}</div>
      <Editor
        value={codeText}
        onValueChange={setCodeText}
        highlight={(code) => {
          const langId = findLangFromFile(fileName);
          const grammar = Prism.languages[langId] || Prism.languages.javascript;
          return Prism.highlight(code, grammar, langId);
        }}
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
    // margin: "1rem 0",
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

function extToPrismLang(fileName = "") {
  const ext = fileName.split(".").pop().toLowerCase();
  return {
    js: "javascript", jsx: "jsx", ts: "typescript", tsx: "tsx",
    py: "python", rs: "rust", rb: "ruby", java: "java",
    c: "c", cpp: "cpp", h: "c", cs: "csharp", go: "go",
    php: "php", html: "markup", htm: "markup", css: "css",
    json: "json", md: "markdown", sh: "bash", yml: "yaml",
    yaml: "yaml"
  }[ext] || "javascript";
}
