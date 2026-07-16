import { useState } from "react";
import { toast } from "sonner";

import { t } from "@/shared/lib/i18n/t";

const COPIED_RESET_MS = 2000;

export function useCopyToClipboard(): {
  copied: boolean;
  copy: (text: string) => void;
} {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPIED_RESET_MS);
      })
      .catch(() => {
        toast.error(t("errors.clipboard_error"));
      });
  };

  return { copied, copy };
}
