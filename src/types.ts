export type ResourceKind = 'book' | 'watch' | 'read' | 'follow';

export interface Resource {
  title: string;
  by?: string;
  kind: ResourceKind;
  url: string;
  note?: string;
}

export interface Track {
  id: string;
  /** The month (1-12) this track is the focus of, per the rotation. */
  month: number;
  title: string;
  premise: string;
  resources: Resource[];
  action: string;
}

export interface DailyEntry {
  /** YYYY-MM-DD, in the user's local timezone. */
  date: string;
  read: boolean;
  input: boolean;
  applied: boolean;
  appliedWhere: string;
}

export interface AppState {
  entries: Record<string, DailyEntry>;
  /**
   * Manual focus override, stored as the rotation month (1-12) of the chosen
   * track. `null` means "follow the calendar".
   */
  monthOverride?: number | null;
}
