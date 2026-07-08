type ModalProps = {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
};
export default function Modal({
  isModalOpen,
  setModalOpen,
  message,
}: ModalProps) {
  return (
    <div>
      {isModalOpen && (
        <div>
          <p>{message}</p>

          <button onClick={() => setModalOpen(false)}>X</button>
        </div>
      )}
    </div>
  );
}
