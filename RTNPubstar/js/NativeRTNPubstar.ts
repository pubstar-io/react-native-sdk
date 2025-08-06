import { TurboModule, TurboModuleRegistry } from "react-native";

export interface RewardModel {
  amount: number;
  type: string;
}

export interface ErrorCode {
  name: string;
  code: number;
}

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  initialization(): Promise<void>;
  loadAndShow(
    adId: string,
    onLoadError: (errorCode: ErrorCode) => void,
    onLoaded: () => void,
    onAdHide: (reward: RewardModel | undefined) => void,
    onAdShowed: () => void,
    onError: (errorCode: ErrorCode) => void
  ): void;
}

export default TurboModuleRegistry.get<Spec>("RTNPubstar") as Spec | null;
