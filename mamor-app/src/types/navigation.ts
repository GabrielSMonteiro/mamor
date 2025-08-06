export type RootStackParamList = {
  MainMenu: undefined;
  Declaration: undefined;
  Photos: undefined;
  BucketList: undefined;
  Random: undefined;
  Music: undefined;
};

export interface NavigationProps {
  navigation: {
    navigate: (screen: keyof RootStackParamList) => void;
    goBack: () => void;
  };
}
