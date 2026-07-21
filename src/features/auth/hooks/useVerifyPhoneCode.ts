import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { websiteAuthApi } from "@/features/auth/api";
import { mapVerifyPhoneCodeToRequestBody } from "@/features/auth/lib/adapters";
import { customerAuthService } from "@/features/auth/lib/authService";
import { type VerifyPhoneResponse } from "@/features/auth/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { type VerifyPhoneCodeFormValues } from "@/widgets/site-shell/PhoneFlow/phoneFlow.schema";

type UseVerifyPhoneCodeReturn = {
  submit: (
    values: VerifyPhoneCodeFormValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useVerifyPhoneCode = (
  setError: UseFormSetError<VerifyPhoneCodeFormValues>,
): UseVerifyPhoneCodeReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    VerifyPhoneResponse,
    Error,
    VerifyPhoneCodeFormValues
  >({
    mutationFn: (values) =>
      websiteAuthApi.verifyPhoneCode(mapVerifyPhoneCodeToRequestBody(values)),
    onSuccess: ({ token, customer }) => {
      if (token) customerAuthService.setToken(token);
      queryClient.setQueryData(queryKeys.customer.me(), customer);
    },
    onError: (error) => {
      handleFormError<VerifyPhoneCodeFormValues>(error, setError, {
        fieldMap: { code: "code" },
      });
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};
