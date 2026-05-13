
import { apiClient } from "@/lib/api-client";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

  type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

  interface MutationHookOptions<TData, TVariables> {
    endpoint: string | ((variables: TVariables) => string);
    method?: HttpMethod;
    isMultiPart?: boolean;
    toBody?: (variables: TVariables) => unknown;
    invalidateKeys?: string[];
    mutationOptions?: UseMutationOptions<TData, AxiosError, TVariables>;
  }

  export function useApiMutation<TData = unknown, TVariables = unknown>({
    endpoint,
    method = "POST",
    isMultiPart = false,
    toBody,
    invalidateKeys = [],
    mutationOptions,
  }: MutationHookOptions<TData, TVariables>): UseMutationResult<
    TData,
    AxiosError,
    TVariables
  > {
    const queryClient = useQueryClient();

    const { 
      onSuccess: userOnSuccess, 
      onMutate: userOnMutate,
      ...restMutationOptions 
    } = mutationOptions || {};

    return useMutation<TData, AxiosError, TVariables>({
      mutationFn: async (variables) => {
        const url =
          typeof endpoint === "function" ? endpoint(variables) : endpoint;

        const response = await apiClient.request<TData>({
          url,
          method,
          data: toBody ? toBody(variables) : variables,
          headers: {
            "Content-Type": isMultiPart
              ? "multipart/form-data"
              : "application/json",
          },
        });

        return response.data;
      },

      ...(userOnMutate && { onMutate: userOnMutate }),

      ...restMutationOptions,

      onSuccess: (data, variables, onMutateResult, context) => {
        // 1. Invalidate queries FIRST
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });

        // 2. Call user-defined onSuccess
        if (userOnSuccess) {
          userOnSuccess(data, variables, onMutateResult, context);
        }
      },
    });
  }