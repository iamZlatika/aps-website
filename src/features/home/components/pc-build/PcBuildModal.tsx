import { WebsiteModal } from "@/shared/components/ui/WebsiteModal";

import { PcBuildModalContent } from "./PcBuildModalContent";

interface PcBuildModalProps {
  open: boolean;
  onClose: () => void;
}

export const PcBuildModal = ({ open, onClose }: PcBuildModalProps) => (
  <WebsiteModal open={open} onClose={onClose} maxWidth="max-w-[560px]">
    <PcBuildModalContent />
  </WebsiteModal>
);
