import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { customerProfileApi } from "@/features/profile/api";
import { type TelegramLink } from "@/features/profile/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services";

type UseProfileTelegramReturn = {
  isPending: boolean;
  generateLink: () => void;
  telegramLink: TelegramLink | null;
  revokeLink: () => void;
  isRevokePending: boolean;
};

export const useProfileTelegram = (): UseProfileTelegramReturn => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const generateMutation = useMutation({
    mutationFn: () => customerProfileApi.generateTelegramLink(),
    onError: (error) => notifyError(error),
  });

  const revokeMutation = useMutation({
    mutationFn: () => customerProfileApi.revokeTelegramLink(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.me() });
      toast.success(t("cabinet.telegramRevoked"));
    },
    onError: (error) => notifyError(error),
  });

  return {
    isPending: generateMutation.isPending,
    generateLink: () => generateMutation.mutate(),
    telegramLink: generateMutation.data ?? null,
    revokeLink: () => revokeMutation.mutate(),
    isRevokePending: revokeMutation.isPending,
  };
};
