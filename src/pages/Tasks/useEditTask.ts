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
  EDIT_START: (state, _action) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  }),
  EDIT_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  EDIT_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
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
      if (controller.signal.aborted) {
        return false;
      }
      dispatch({ type: "EDIT_ERROR", error });
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