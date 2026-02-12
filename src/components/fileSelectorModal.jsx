// a modal should appear when user hits ctrl + E

import { Modal } from "@mantine/core";
export { PrimaryModal };
const PrimaryModal = ({ opened, closed, title, children }) => {
  return (
    <Modal
      opened={opened}
      onClose={closed}
      title={title}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {children}
    </Modal>
  );
};
