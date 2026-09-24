import { useFocusEffect } from 'expo-router';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type QueryState<T> = {
  data: T | undefined;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh(): void;
};

/**
 * Loads data when the screen gains focus (so lists update after returning from
 * a form) and exposes pull-to-refresh. Changing `key` re-runs the loader.
 */
export function useQuery<T>(key: string, loader: () => Promise<T>): QueryState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const requestId = useRef(0);
  const loaderRef = useRef(loader);

  useLayoutEffect(() => {
    loaderRef.current = loader;
  });

  const run = useCallback((mode: 'initial' | 'refresh') => {
    const id = ++requestId.current;
    if (mode === 'refresh') setIsRefreshing(true);
    loaderRef
      .current()
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        setError(null);
      })
      .catch((e: unknown) => {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Something went wrong.');
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      run('initial');
      // `key` is the only input that should trigger a fresh load.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run, key]),
  );

  return { data, error, isLoading, isRefreshing, refresh: () => run('refresh') };
}
