import { requestCreateTask } from "@/network";
import { useReducer, useCallback } from "react";
import type { Task } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: Task | null;
  error: unknown;
}

type Action =
  | { type: "CREATE_START" }
  | { type: "CREATE_SUCCESS"; data: Task }
  | { type: "CREATE_ERROR"; error: unknown };

const initialState: State = {
  isLoading: false,
  data: null,
  error: null,
};

const actionHandlers = {
  CREATE_START: (state: State, _action: Action) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  }),
  CREATE_SUCCESS: (state: State, { data }: { data: Task }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  CREATE_ERROR: (state: State, { error }: { error: unknown }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "CREATE_START":
      return actionHandlers.CREATE_START(state, action);
    case "CREATE_SUCCESS":
      return actionHandlers.CREATE_SUCCESS(state, action);
    case "CREATE_ERROR":
      return actionHandlers.CREATE_ERROR(state, action);
    default:
      return state;
  }
}

const useCreateTask = () => {
  const [{ isLoading, data, error }, dispatch] = useReducer(reducer, initialState);

  const createTask = useCallback(async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const controller = new AbortController();

    dispatch({ type: "CREATE_START" });

    try {
      const response = await requestCreateTask({
        task: taskData,
        options: {
          signal: controller.signal,
        },
      });

      dispatch({
        type: "CREATE_SUCCESS",
        data: response.data,
      });

      return response.data;
    } catch (error) {
      // Only show error if request wasn't cancelled
      if (!controller.signal.aborted) {
        dispatch({ type: "CREATE_ERROR", error });
      }
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CREATE_ERROR", error: null });
  }, []);

  return {
    isLoading,
    data,
    error,
    createTask,
    clearError,
  };
};

export { useCreateTask };