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

interface ActionHandlers {
  [key in Action["type"]]: (
    state: State,
    action: Extract<Action, { type: key }>
  ) => State;
}

const initialState: State = {
  isLoading: false,
  data: null,
  error: null,
};

const actionHandlers: ActionHandlers = {
  DELETE_START: (state, _action) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  }),
  DELETE_SUCCESS: (state) => ({
    ...state,
    isLoading: false,
    data: true,
  }),
  DELETE_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
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