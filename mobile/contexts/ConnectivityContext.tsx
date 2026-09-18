import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

type ConnectivityContextValue = {
  isOnline: boolean;
  isInternetReachable: boolean | null;
  /** True when we should treat the device as able to reach the network. */
  canSync: boolean;
};

const ConnectivityContext = createContext<ConnectivityContextValue | null>(
  null,
);

function derive(state: NetInfoState): ConnectivityContextValue {
  const isOnline = state.isConnected !== false;
  const isInternetReachable =
    state.isInternetReachable === null || state.isInternetReachable === undefined
      ? null
      : state.isInternetReachable;
  const canSync =
    state.isConnected === true &&
    (isInternetReachable === null || isInternetReachable === true);
  return { isOnline, isInternetReachable, canSync };
}

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ConnectivityContextValue>({
    isOnline: true,
    isInternetReachable: null,
    canSync: true,
  });

  useEffect(() => {
    let mounted = true;
    void NetInfo.fetch().then((state) => {
      if (mounted) setValue(derive(state));
    });
    const unsubscribe = NetInfo.addEventListener((state) => {
      setValue(derive(state));
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const memo = useMemo(() => value, [value]);

  return (
    <ConnectivityContext.Provider value={memo}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity(): ConnectivityContextValue {
  const ctx = useContext(ConnectivityContext);
  if (!ctx) {
    throw new Error("useConnectivity must be used within ConnectivityProvider");
  }
  return ctx;
}
