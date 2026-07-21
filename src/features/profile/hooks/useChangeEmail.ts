import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { customerProfileApi } from "@/features/profile/api";
import { mapChangeEmailToRequestBody } from "@/features/profile/lib/adapters";
import { type ChangeEmailFormValues } from "@/features/profile/profile.schema";
import { queryKeys } from "@/shared/api/queryKeys";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseChangeEmailReturn = {
  submit: (
    values: ChangeEmailFormValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useChangeEmail = (
  setError: UseFormSetError<ChangeEmailFormValues>,
): UseChangeEmailReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, ChangeEmailFormValues>({
    mutationFn: (values) =>
      customerProfileApi.changeEmail(mapChangeEmailToRequestBody(values)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.customer.me(),
      });
    },
    onError: (error) => {
      notifyError(error);
      handleFormError<ChangeEmailFormValues>(error, setError, {
        fieldMap: {
          new_email: "newEmail",
          current_password: "currentPassword",
        },
      });
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};
