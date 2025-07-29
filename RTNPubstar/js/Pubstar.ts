import RTNPubstar, { EventName } from "./NativeRTNPubstar";

export interface AdLoaderListener {
  onError?: (errorCode: string) => void;
  onLoaded?: () => void;
}

export interface AdShowListener {
  onAdHide?: () => void;
  onAdShowed?: () => void;
  onError?: (errorCode: string) => void;
}

function loadAndShowAd(
  adId: string,
  adLoaderListener?: AdLoaderListener,
  adShowListener?: AdShowListener
) {
  if (!RTNPubstar) {
    console.warn("[Pubstar] Native module RTNPubstar not found");
    return;
  }

  RTNPubstar.loadAndShow(
    adId,
    (errorCode: string) => {
      console.error("[Pubstar] Ad load error:", errorCode);
      adLoaderListener?.onError?.(errorCode);
    },
    () => {
      console.log("[Pubstar] Ad loaded successfully");
      adLoaderListener?.onLoaded?.();
    },
    () => {
      console.log("[Pubstar] Ad hidden");
      adShowListener?.onAdHide?.();
    },
    () => {
      console.log("[Pubstar] Ad showed");
      adShowListener?.onAdShowed?.();
    },
    (errorCode: string) => {
      console.error("[Pubstar] Ad show error:", errorCode);
      adShowListener?.onError?.(errorCode);
    }
  );
}

export default class Pubstar {
  static loadAndShowAd = loadAndShowAd;
}
