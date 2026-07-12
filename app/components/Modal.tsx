import { X } from "lucide-react";
import { cn, buttonBase, buttonVariants, buttonSizes } from "@/lib/utils";

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
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-1">
        <p className="px-2 text-sm text-foreground">{message}</p>
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className={cn(buttonBase, buttonVariants.ghost, buttonSizes.icon, "text-muted-foreground hover:text-destructive hover:bg-destructive/10")}
        >
          <X />
        </button>
      </div>
    </div>
  );
}
