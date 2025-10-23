import { requestCreateTask } from "@/network";
import { useReducer, useCallback } from "react";
import { Task } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: Task | null;
  error: unknown;
}

type Action =
  | { type: "CREATE_START" }
  | { type: "CREATE_SUCCESS"; data: Task }
  | { type: "CREATE_ERROR"; error: unknown };

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
  CREATE_START: (state, _action) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  }),
  CREATE_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  CREATE_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
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
      if (controller.signal.aborted) {
        return false;
      }
      dispatch({ type: "CREATE_ERROR", error });
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