import RTNPubstar, { ErrorCode, RewardModel } from "./NativeRTNPubstar";

interface LoadAndShowListener {
  onLoadError?: (errorCode: ErrorCode) => void;
  onLoaded?: () => void;
  onAdHide?: (reward: RewardModel | undefined) => void;
  onAdShowed?: () => void;
  onShowError?: (errorCode: ErrorCode) => void;
}

interface LoadListener {
  onLoadError?: (errorCode: ErrorCode) => void;
  onLoaded?: () => void;
}

interface ShowListener {
  onAdHide?: (reward: RewardModel | undefined) => void;
  onAdShowed?: () => void;
  onShowError?: (errorCode: ErrorCode) => void;
}

function showMessagepPackageNotFound() {
  console.warn("[Pubstar] Native module RTNPubstar not found");
}

async function initialization() {
  if (!RTNPubstar) {
    showMessagepPackageNotFound();
    return;
  }

  await RTNPubstar.initialization();
}

function loadAd(adId: string, adListener?: LoadListener) {
  if (!RTNPubstar) {
    showMessagepPackageNotFound();
    return;
  }

  RTNPubstar.loadAd(
    adId,
    (errorCode: ErrorCode) => {
      adListener?.onLoadError?.(errorCode);
    },
    () => {
      adListener?.onLoaded?.();
    },
  );
}

function showAd(adId: string, adListener?: ShowListener) {
  if (!RTNPubstar) {
    showMessagepPackageNotFound();
    return;
  }

  RTNPubstar.showAd(
    adId,
    (reward) => {
      adListener?.onAdHide?.(reward);
    },
    () => {
      adListener?.onAdShowed?.();
    },
    (errorCode: ErrorCode) => {
      adListener?.onShowError?.(errorCode);
    },
  );
}

function loadAndShowAd(
  adId: string,
  adListener?: LoadAndShowListener
) {
  if (!RTNPubstar) {
    showMessagepPackageNotFound();
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
  static initialization = initialization;
  static loadAd = loadAd;
  static showAd = showAd;
  static loadAndShowAd = loadAndShowAd;
}
