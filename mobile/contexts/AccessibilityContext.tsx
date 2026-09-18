import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  colors as defaultColors,
  highContrastColors,
  type AppColors,
} from "../theme";

/** v2 clears the old v1 AAA transform prefs that could trap the chrome. */
const STORAGE_KEY = "ncap.accessibility.v2";
const LEGACY_KEY = "ncap.accessibility.v1";

export type TextZoomLevel = 0 | 1 | 2;

/** Milder scales so top chrome (AA / profile) stays on-screen. */
const ZOOM_SCALES = [1, 1.08, 1.16] as const;
const ZOOM_LABELS = ["AA", "AA+", "AAA"] as const;

type AccessibilityState = {
  textZoom: TextZoomLevel;
  highContrast: boolean;
  textScale: number;
  zoomLabel: string;
  isCustomized: boolean;
  /** Active palette — swaps when high contrast is on. */
  colors: AppColors;
  cycleTextZoom: () => void;
  setTextZoom: (level: TextZoomLevel) => void;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
  resetAccessibility: () => void;
};

const AccessibilityContext = createContext<AccessibilityState | null>(null);

type Stored = {
  textZoom?: TextZoomLevel;
  highContrast?: boolean;
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [textZoom, setTextZoomState] = useState<TextZoomLevel>(0);
  const [highContrast, setHighContrastState] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Drop legacy prefs that used aggressive full-screen scaling.
        await AsyncStorage.removeItem(LEGACY_KEY);
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive || !raw) return;
        const parsed = JSON.parse(raw) as Stored;
        if (parsed.textZoom === 0 || parsed.textZoom === 1 || parsed.textZoom === 2) {
          setTextZoomState(parsed.textZoom);
        }
        if (typeof parsed.highContrast === "boolean") {
          setHighContrastState(parsed.highContrast);
        }
      } catch {
        // Keep defaults
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback(
    async (next: { textZoom: TextZoomLevel; highContrast: boolean }) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore persistence failures
      }
    },
    [],
  );

  const setTextZoom = useCallback(
    (level: TextZoomLevel) => {
      setTextZoomState(level);
      void persist({ textZoom: level, highContrast });
    },
    [highContrast, persist],
  );

  const cycleTextZoom = useCallback(() => {
    setTextZoomState((prev) => {
      const next = ((prev + 1) % 3) as TextZoomLevel;
      void persist({ textZoom: next, highContrast });
      return next;
    });
  }, [highContrast, persist]);

  const setHighContrast = useCallback(
    (value: boolean) => {
      setHighContrastState(value);
      void persist({ textZoom, highContrast: value });
    },
    [persist, textZoom],
  );

  const toggleHighContrast = useCallback(() => {
    setHighContrastState((prev) => {
      const next = !prev;
      void persist({ textZoom, highContrast: next });
      return next;
    });
  }, [persist, textZoom]);

  const resetAccessibility = useCallback(() => {
    setTextZoomState(0);
    setHighContrastState(false);
    void persist({ textZoom: 0, highContrast: false });
  }, [persist]);

  const palette = highContrast ? highContrastColors : defaultColors;

  const value = useMemo<AccessibilityState>(
    () => ({
      textZoom,
      highContrast,
      textScale: ZOOM_SCALES[textZoom],
      zoomLabel: ZOOM_LABELS[textZoom],
      isCustomized: textZoom > 0 || highContrast,
      colors: palette,
      cycleTextZoom,
      setTextZoom,
      toggleHighContrast,
      setHighContrast,
      resetAccessibility,
    }),
    [
      textZoom,
      highContrast,
      palette,
      cycleTextZoom,
      setTextZoom,
      toggleHighContrast,
      setHighContrast,
      resetAccessibility,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityState {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}

/** Theme colors that respect the high-contrast toggle. */
export function useColors(): AppColors {
  return useAccessibility().colors;
}
