import { TurboModule, TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  init(): Promise<void>;
  loadAndShow(adId: string): Promise<void>;
}

export default TurboModuleRegistry.get<Spec>("RTNPubstar") as Spec | null;
