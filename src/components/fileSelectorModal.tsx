export { PrimaryModal };

type PrimaryModalProps = {
  opened: boolean;
  closed: () => void;
  title: string | null;
  children: React.ReactNode;
};

const PrimaryModal = ({ opened, closed, title, children }: PrimaryModalProps) => {
  if (!opened) return null;

  return (
    <div style={styles.mainBody} onClick={closed}>
      <div style={styles.innerBody} onClick={(e) => e.stopPropagation()}>
        <h4 style={{color: "#fff", marginBottom: "1.5rem", overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollbarColor: 'transparent transparent'}}>
          {title}
        </h4>
        {children}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
    fontFamily: 'Consolas, "Fira Mono", "Menlo", monospace'
  },
  innerBody: {
    background: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "2rem",
    width: "600px",
    height: "80vh",
    overflow: "auto",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    color: "#d4d4d4",
  },
};
