'use client';

import { useCallback, useEffect, useState } from 'react';

export function useStoredList<T>(
  key: string | null,
  isItem: (value: unknown) => value is T,
) {
  const [state, setState] = useState<{ key: string | null; items: T[] }>({ key: null, items: [] });

  useEffect(() => {
    let items: T[] = [];
    if (key) {
      try {
        const stored: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
        if (Array.isArray(stored)) items = stored.filter(isItem);
      } catch {
        // A corrupt entry or disabled storage starts with an empty list.
      }
    }
    setState({ key, items });
  }, [key, isItem]);

  useEffect(() => {
    if (!key || state.key !== key) return;
    try {
      if (state.items.length) localStorage.setItem(key, JSON.stringify(state.items));
      else localStorage.removeItem(key);
    } catch {
      // The list is still usable for the current session.
    }
  }, [key, state]);

  const update = useCallback((change: (items: T[]) => T[]) => {
    setState((current) => current.key === key ? { key, items: change(current.items) } : current);
  }, [key]);

  return [state.key === key ? state.items : [], update] as const;
}
