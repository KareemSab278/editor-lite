import { Button } from "@mantine/core";
export { PrimaryButton, TabButton };

const PrimaryButton = ({ title, onClick }) => {
  return (
    <section style={{ display: "inline-block", margin: "8px" }}>
      <Button
        variant="filled"
        size="xs"
        radius="xl"
        style={styles.primary}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(156, 156, 156, 0.7)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(99, 99, 99, 0.42)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
        }}
        onClick={onClick}
      >
        {title}
      </Button>
    </section>
  );
};

const TabButton = ({ title, onClick }) => {
  return (
    <section style={{ display: "inline-block", margin: "8px" }}>
      <Button
        variant="filled"
        size="xs"
        radius="xl"
        style={styles.tab}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(156, 156, 156, 0.7)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(99, 99, 99, 0.42)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
        }}
        onClick={onClick}
      >
        {title}
      </Button>
    </section>
  );
};

const styles = {
  primary: {
    backgroundColor: "rgba(99, 99, 99, 0.42)",
    color: "#fff",
    padding: "4px 8px",
    fontWeight: "bold",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s",
  },
  tab: {
    backgroundColor: "rgba(99, 99, 99, 0.42)",
    color: "#fff",
    padding: "4px 8px",
    fontWeight: "bold",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s",
  },
};
