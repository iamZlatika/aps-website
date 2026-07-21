import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { customerProfileApi } from "@/features/profile/api";
import { mapChangePasswordToRequestBody } from "@/features/profile/lib/adapters";
import { type ChangePasswordFormValues } from "@/features/profile/profile.schema";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseChangePasswordReturn = {
  submit: (
    values: ChangePasswordFormValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useChangePassword = (
  setError: UseFormSetError<ChangePasswordFormValues>,
): UseChangePasswordReturn => {
  const mutation = useMutation<void, Error, ChangePasswordFormValues>({
    mutationFn: (values) =>
      customerProfileApi.changePassword(mapChangePasswordToRequestBody(values)),
    onError: (error) => {
      notifyError(error);
      handleFormError<ChangePasswordFormValues>(error, setError, {
        fieldMap: {
          current_password: "currentPassword",
          password: "newPassword",
          password_confirmation: "confirmPassword",
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
