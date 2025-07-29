import { TurboModule, TurboModuleRegistry } from "react-native";

export enum EventName {
  AD_LOAD_ERROR = "onLoadError",
  AD_LOADED = "adLoaded",
  AD_HIDE = "onAdHide",
  AD_SHOWED = "onAdShowed",
  AD_SHOW_ERROR = "onShowError",
}

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  init(): Promise<void>;
  loadAndShow(
    adId: string, 
    onLoadError: (errorCode: string) => void,
    onLoaded: () => void,
    onAdHide: () => void,
    onAdShowed: () => void,
    onError: (errorCode: string) => void,
  ): void;
}

export default TurboModuleRegistry.get<Spec>("RTNPubstar") as Spec | null;
