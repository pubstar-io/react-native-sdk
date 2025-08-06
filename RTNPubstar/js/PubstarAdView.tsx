import React, { memo, useState } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import PubstarAdViewNativeComponent from "./PubstarAdViewNativeComponent";
import { RewardModel, ErrorCode } from "./NativeRTNPubstar";

const BannerHeight = { small: 78, medium: 130, large: 260 };
const NativeHeight = { small: 78, medium: 130, large: 299 };

type PubstarAdSize = keyof typeof BannerHeight;
type PubstarAdType = "banner" | "native";

interface Props {
  adId: string;
  style?: StyleProp<ViewStyle>;
  size?: PubstarAdSize;
  type: PubstarAdType;
  onLoaded?: () => void;
  onLoadedError?: (errorCode: ErrorCode) => void;
  onShowed?: () => void;
  onHide?: (reward: RewardModel) => void;
  onShowedError?: (errorCode: ErrorCode) => void;
}

const PubstarAdView = ({
  adId,
  size = "small",
  style,
  type,
  onLoaded,
  onLoadedError,
  onShowed,
  onHide,
  onShowedError,
}: Props) => {
  const [height, setHeight] = useState(0);

  function updateHeight() {
    const heightMap = type === "banner" ? BannerHeight : NativeHeight;
    setHeight(heightMap[size] ?? BannerHeight.small);
  }

  function handleOnShowed() {
    updateHeight();
    onShowed?.();
  }

  function handleOnHide(reward: RewardModel) {
    onHide?.(reward);
  }

  function handleOnLoadedError(errorCode: ErrorCode) {
    onLoadedError?.(errorCode);
  }

  function handleOnShowedError(errorCode: ErrorCode) {
    onShowedError?.(errorCode);
  }

  return (
    <PubstarAdViewNativeComponent
      adId={adId}
      size={size}
      style={StyleSheet.flatten([style, { height, width: '100%' }])}
      type={type}
      onLoaded={onLoaded}
      onLoadedError={handleOnLoadedError}
      onShowed={handleOnShowed}
      onHide={handleOnHide}
      onShowedError={handleOnShowedError}
    />
  );
};

export default memo(PubstarAdView);
