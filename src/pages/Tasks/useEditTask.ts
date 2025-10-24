import { requestEditTask } from "@/network";
import { useReducer, useCallback } from "react";
import type { Task } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: Task | null;
  error: unknown;
}

type Action =
  | { type: "EDIT_START" }
  | { type: "EDIT_SUCCESS"; data: Task }
  | { type: "EDIT_ERROR"; error: unknown };

const initialState: State = {
  isLoading: false,
  data: null,
  error: null,
};

const actionHandlers = {
  EDIT_START: (state: State, _action: Action) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  }),
  EDIT_SUCCESS: (state: State, { data }: { data: Task }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  EDIT_ERROR: (state: State, { error }: { error: unknown }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "EDIT_START":
      return actionHandlers.EDIT_START(state, action);
    case "EDIT_SUCCESS":
      return actionHandlers.EDIT_SUCCESS(state, action);
    case "EDIT_ERROR":
      return actionHandlers.EDIT_ERROR(state, action);
    default:
      return state;
  }
}

const useEditTask = () => {
  const [{ isLoading, data, error }, dispatch] = useReducer(reducer, initialState);

  const editTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const controller = new AbortController();

    dispatch({ type: "EDIT_START" });

    try {
      const response = await requestEditTask({
        id,
        updates,
        options: {
          signal: controller.signal,
        },
      });

      dispatch({
        type: "EDIT_SUCCESS",
        data: response.data,
      });

      return response.data;
    } catch (error) {
      // Only show error if request wasn't cancelled
      if (!controller.signal.aborted) {
        dispatch({ type: "EDIT_ERROR", error });
      }
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "EDIT_ERROR", error: null });
  }, []);

  return {
    isLoading,
    data,
    error,
    editTask,
    clearError,
  };
};

export { useEditTask };