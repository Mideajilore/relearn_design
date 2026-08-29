import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CadenceId } from '../content/guide';
import type { AppState, DailyEntry } from '../types';
import { todayISO } from './date';
import { clearAll, loadState, saveEntry, saveMonthOverride, storageIsPersistent } from './storage';
import { emptyEntry } from './streak';

/**
 * The single source of tracker state. React state plus the storage wrapper —
 * no state library, and no component ever touches localStorage itself.
 */

interface TrackerValue {
  state: AppState;
  loading: boolean;
  today: string;
  todayEntry: DailyEntry;
  persistent: boolean;
  updateToday: (patch: Partial<Omit<DailyEntry, 'date'>>) => void;
  setAction: (action: CadenceId, done: boolean) => void;
  setMonthOverride: (month: number | null) => void;
  resetAll: () => Promise<void>;
}

const TrackerContext = createContext<TrackerValue | null>(null);

const EMPTY_STATE: AppState = { entries: {}, monthOverride: null };

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(() => todayISO());

  useEffect(() => {
    let cancelled = false;
    loadState().then((loaded) => {
      if (cancelled) return;
      setState(loaded);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Roll over if the app is left open past midnight.
  useEffect(() => {
    const tick = () => setToday(todayISO());
    const timer = window.setInterval(tick, 60_000);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, []);

  const updateToday = useCallback(
    (patch: Partial<Omit<DailyEntry, 'date'>>) => {
      setState((previous) => {
        const current = previous.entries[today] ?? emptyEntry(today);
        const next: DailyEntry = { ...current, ...patch, date: today };
        // Write-through: the UI updates now, the store catches up immediately.
        void saveEntry(next);
        return { ...previous, entries: { ...previous.entries, [today]: next } };
      });
    },
    [today],
  );

  /** Spelled out rather than computed, so the key stays typed against DailyEntry. */
  const setAction = useCallback(
    (action: CadenceId, done: boolean) => {
      if (action === 'read') updateToday({ read: done });
      else if (action === 'input') updateToday({ input: done });
      else updateToday({ applied: done });
    },
    [updateToday],
  );

  const setMonthOverride = useCallback((month: number | null) => {
    setState((previous) => {
      void saveMonthOverride(month);
      return { ...previous, monthOverride: month };
    });
  }, []);

  const resetAll = useCallback(async () => {
    await clearAll();
    setState(EMPTY_STATE);
  }, []);

  const value = useMemo<TrackerValue>(
    () => ({
      state,
      loading,
      today,
      todayEntry: state.entries[today] ?? emptyEntry(today),
      persistent: storageIsPersistent,
      updateToday,
      setAction,
      setMonthOverride,
      resetAll,
    }),
    [state, loading, today, updateToday, setAction, setMonthOverride, resetAll],
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker(): TrackerValue {
  const value = useContext(TrackerContext);
  if (!value) throw new Error('useTracker must be used inside a TrackerProvider');
  return value;
}
