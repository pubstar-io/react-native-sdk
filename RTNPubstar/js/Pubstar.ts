import RTNPubstar, { ErrorCode, RewardModel } from "./NativeRTNPubstar";

interface AdListener {
  onLoadError?: (errorCode: ErrorCode) => void;
  onLoaded?: () => void;
  onAdHide?: (reward: RewardModel | undefined) => void;
  onAdShowed?: () => void;
  onShowError?: (errorCode: ErrorCode) => void;
}

function loadAndShowAd(
  adId: string,
  adListener?: AdListener
) {
  if (!RTNPubstar) {
    console.warn("[Pubstar] Native module RTNPubstar not found");
    return;
  }

  RTNPubstar.loadAndShow(
    adId,
    (errorCode: ErrorCode) => {
      adListener?.onLoadError?.(errorCode);
    },
    () => {
      adListener?.onLoaded?.();
    },
    (reward) => {
      adListener?.onAdHide?.(reward);
    },
    () => {
      adListener?.onAdShowed?.();
    },
    (errorCode: ErrorCode) => {
      adListener?.onShowError?.(errorCode);
    }
  );
}

export default class Pubstar {
  static loadAndShowAd = loadAndShowAd;
}
