import { AlertTriangle, RefreshCw } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface PageErrorProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  buttonLabel?: string;
  buttonClassName?: string;
}

const PageError = ({
  title,
  description,
  onRetry,
  buttonLabel,
  buttonClassName,
}: PageErrorProps) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-ws-red" />

        <div className="space-y-2">
          <h2 className="text-ws-lg font-semibold text-ws-ink">{title}</h2>

          {description && (
            <p className="text-ws-sm text-ws-ink-mute">{description}</p>
          )}
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn("ws-btn ws-btn-ghost gap-2", buttonClassName)}
          >
            <RefreshCw className="h-4 w-4" />
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageError;
