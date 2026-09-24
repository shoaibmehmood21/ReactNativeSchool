import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react';

import { api } from '@/api/client';
import type { Child } from '@/api/types';
import { useAuth } from '@/context/auth';

type ChildrenContextValue = {
  children: Child[];
  selected: Child | undefined;
  select(childId: string): void;
  isLoading: boolean;
  error: string | null;
  reload(): void;
};

type LoadResult = { token: string; children: Child[]; error: string | null };

const ChildrenContext = createContext<ChildrenContextValue | null>(null);

/** Loads the signed-in parent's children and tracks which one is being viewed. */
export function ChildrenProvider({ children: content }: PropsWithChildren) {
  const { session } = useAuth();
  const [result, setResult] = useState<LoadResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string>();

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    api
      .getChildren()
      .then((list) => {
        if (!cancelled) setResult({ token: session.token, children: list, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const error = e instanceof Error ? e.message : 'Unable to load children.';
        setResult({ token: session.token, children: [], error });
      });
    return () => {
      cancelled = true;
    };
  }, [session, reloadKey]);

  // Ignore results that belong to a previous sign-in.
  const current = session && result?.token === session.token ? result : null;
  const children = current?.children ?? [];
  const selected = children.find((c) => c.id === selectedId) ?? children[0];

  function reload() {
    if (current?.error) setResult(null);
    setReloadKey((k) => k + 1);
  }

  return (
    <ChildrenContext
      value={{
        children,
        selected,
        select: setSelectedId,
        isLoading: !!session && !current,
        error: current?.error ?? null,
        reload,
      }}>
      {content}
    </ChildrenContext>
  );
}

export function useChildren() {
  const value = use(ChildrenContext);
  if (!value) throw new Error('useChildren must be used inside <ChildrenProvider>.');
  return value;
}
