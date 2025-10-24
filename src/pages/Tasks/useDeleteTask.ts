import { requestDeleteTask } from "@/network";
import { useReducer, useCallback } from "react";

interface State {
  isLoading: boolean;
  data: boolean | null;
  error: unknown;
}

type Action =
  | { type: "DELETE_START" }
  | { type: "DELETE_SUCCESS" }
  | { type: "DELETE_ERROR"; error: unknown };

const initialState: State = {
  isLoading: false,
  data: null,
  error: null,
};

const actionHandlers = {
  DELETE_START: (state: State, _action: Action) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  }),
  DELETE_SUCCESS: (state: State, _action: Action) => ({
    ...state,
    isLoading: false,
    data: true,
  }),
  DELETE_ERROR: (state: State, { error }: { error: unknown }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "DELETE_START":
      return actionHandlers.DELETE_START(state, action);
    case "DELETE_SUCCESS":
      return actionHandlers.DELETE_SUCCESS(state, action);
    case "DELETE_ERROR":
      return actionHandlers.DELETE_ERROR(state, action);
    default:
      return state;
  }
}

const useDeleteTask = () => {
  const [{ isLoading, data, error }, dispatch] = useReducer(reducer, initialState);

  const deleteTask = useCallback(async (id: string) => {
    const controller = new AbortController();

    dispatch({ type: "DELETE_START" });

    try {
      await requestDeleteTask({
        id,
        options: {
          signal: controller.signal,
        },
      });

      dispatch({ type: "DELETE_SUCCESS" });
      return true;
    } catch (error) {
      if (controller.signal.aborted) {
        return false;
      }
      dispatch({ type: "DELETE_ERROR", error });
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "DELETE_ERROR", error: null });
  }, []);

  return {
    isLoading,
    data,
    error,
    deleteTask,
    clearError,
  };
};

export { useDeleteTask };