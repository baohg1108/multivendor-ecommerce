import { useModal } from "@/provider/modal-provider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const CustomModal = ({
  children,
  defaultOpen,
  heading,
  subheading,
}: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-y-scroll md:max-h[700] md:h-fit h-screen bg-card">
        <DialogHeader className="pt-8 text-left">
          {heading && (
            <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
          )}
          {subheading && <DialogDescription>{subheading}</DialogDescription>}
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
