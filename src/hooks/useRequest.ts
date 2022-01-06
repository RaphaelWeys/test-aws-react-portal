import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useReducer } from 'react';

import { useApi } from '../context/ApiContext';

interface IState<T> {
  error: AxiosError<T> | null;
  response: T | null;
  isPending: boolean;
}

type IAction<T> =
  | { type: 'fetching' | void }
  | { type: 'success'; response: AxiosResponse<T> }
  | { type: 'error'; error: AxiosError };

const createDataReducer = <T>() => (state: IState<T>, action: IAction<T>): IState<T> => {
  switch (action.type) {
    case 'fetching': {
      return { error: null, response: state.response, isPending: true };
    }
    case 'success': {
      return { error: null, response: action.response.data, isPending: false };
    }
    case 'error': {
      return { error: action.error, response: null, isPending: false };
    }
    default:
      return state;
  }
};

function useRequest<T>(options?: AxiosRequestConfig) {
  const fetchReducer = createDataReducer<T>();
  const initialState: IState<T> = {
    error: null,
    response: null,
    isPending: options?.method?.toUpperCase() === 'GET',
  } as const;
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const api = useApi();

  const request = useCallback(
    async (moreOptions?: AxiosRequestConfig) => {
      dispatch({ type: 'fetching' });
      try {
        const axiosResponse = await api.request<T>({
          headers: { 'Content-Type': 'application/json' },
          ...options,
          ...moreOptions,
        });
        dispatch({ type: 'success', response: axiosResponse });
        return axiosResponse.data;
      } catch (error) {
        dispatch({ type: 'error', error });
        return Promise.reject(error);
      }
    },
    [options, api],
  );

  return { response: state.response, error: state.error, isPending: state.isPending, request };
}

export default useRequest;
