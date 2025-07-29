import { TurboModule, TurboModuleRegistry } from "react-native";

export interface RewardModel {
  amount: number;
  type: string;
}

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  init(): Promise<void>;
  loadAndShow(
    adId: string,
    onLoadError: (errorCode: string) => void,
    onLoaded: () => void,
    onAdHide: (reward: RewardModel | undefined) => void,
    onAdShowed: () => void,
    onError: (errorCode: string) => void
  ): void;
}

export default TurboModuleRegistry.get<Spec>("RTNPubstar") as Spec | null;
