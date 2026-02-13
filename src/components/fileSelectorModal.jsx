export { PrimaryModal };
import { PrimaryButton } from "./buttons";

const PrimaryModal = ({ opened, closed, title, children }) => {
  if (!opened) return null;

  return (
    <div style={style.mainBody} onClick={closed}>
      <div style={style.innerBody} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#fff", marginBottom: "1.5rem" }}>
          {title}
        </h2>
        {children}
        <PrimaryButton title="Close" onClick={closed} />
      </div>
    </div>
  );
};

const style = {
  mainBody: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  innerBody: {
    background: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "2rem",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    color: "#d4d4d4",
  },
};
