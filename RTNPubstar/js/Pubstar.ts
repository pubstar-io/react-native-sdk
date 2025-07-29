import RTNPubstar, { RewardModel } from "./NativeRTNPubstar";

export interface AdLoaderListener {
  onError?: (errorCode: string) => void;
  onLoaded?: () => void;
}

export interface AdShowListener {
  onAdHide?: (reward: RewardModel | undefined) => void;
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
      adLoaderListener?.onError?.(errorCode);
    },
    () => {
      adLoaderListener?.onLoaded?.();
    },
    (reward) => {
      adShowListener?.onAdHide?.(reward);
    },
    () => {
      adShowListener?.onAdShowed?.();
    },
    (errorCode: string) => {
      adShowListener?.onError?.(errorCode);
    }
  );
}

export default class Pubstar {
  static loadAndShowAd = loadAndShowAd;
}
