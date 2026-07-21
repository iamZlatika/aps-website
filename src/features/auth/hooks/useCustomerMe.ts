import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/api";
import { type Customer } from "@/features/auth/types";
import { queryKeys } from "@/shared/api/queryKeys";

export const useCustomerMe = (): UseSuspenseQueryResult<Customer> =>
  useSuspenseQuery({
    queryKey: queryKeys.customer.me(),
    queryFn: websiteAuthApi.me,
  });
