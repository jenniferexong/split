import { TabBarMenuButton } from 'components/navigation/TabBarMenu';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

interface LayoutContextValue {
  setBottomTabBarButtons: (buttons: TabBarMenuButton[]) => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  setBottomTabBarButtons: () => {},
});

interface LayoutContextProviderProps {
  children: ReactNode | ReactNode[];
  setBottomTabBarButtons: (buttons: TabBarMenuButton[]) => void;
}

export const LayoutContextProvider = (props: LayoutContextProviderProps) => {
  const { children, setBottomTabBarButtons } = props;

  const value: LayoutContextValue = useMemo(
    () => ({
      setBottomTabBarButtons,
    }),
    [setBottomTabBarButtons],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useBottomTabBarMenu = (buttons: TabBarMenuButton[]) => {
  const { setBottomTabBarButtons } = useContext(LayoutContext);

  useEffect(() => {
    setBottomTabBarButtons(buttons);

    return () => setBottomTabBarButtons([]);
  }, [buttons, setBottomTabBarButtons]);
};
