import RTNPubstar, { ErrorCode, RewardModel } from "./NativeRTNPubstar";

export interface AdLoaderListener {
  onError?: (errorCode: ErrorCode) => void;
  onLoaded?: () => void;
}

export interface AdShowListener {
  onAdHide?: (reward: RewardModel | undefined) => void;
  onAdShowed?: () => void;
  onError?: (errorCode: ErrorCode) => void;
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
    (errorCode: ErrorCode) => {
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
    (errorCode: ErrorCode) => {
      adShowListener?.onError?.(errorCode);
    }
  );
}

export default class Pubstar {
  static loadAndShowAd = loadAndShowAd;
}
