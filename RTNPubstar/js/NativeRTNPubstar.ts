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
  initialization(): Promise<void>;
  loadAd(
    adId: string,
    onError: (errorCode: ErrorCode) => void,
    onLoaded: () => void,
  ): void;
  showAd(
    adId: string,
    onHide: (reward: RewardModel | undefined) => void,
    onShowed: () => void,
    onError: (errorCode: ErrorCode) => void,
  ): void;
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
