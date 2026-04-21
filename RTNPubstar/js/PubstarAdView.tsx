import React, { memo, useState } from "react";
import { StyleProp, StyleSheet, ViewStyle, Platform } from "react-native";
import PubstarAdViewNativeComponent from "./PubstarAdViewNativeComponent";
import { RewardModel, ErrorCode } from "./NativeRTNPubstar";
import { NativeCustomConfig } from "./NativeCustomConfig";

const BannerHeight = { small: 78, medium: 130, large: 260 };
const NativeHeight = { small: 78, medium: 130, large: 299 };

type PubstarAdSize = "small" | "medium" | "large";
type PubstarAdType = "banner" | "native";

interface Props {
  adId: string;
  style?: StyleProp<ViewStyle>;
  size?: PubstarAdSize;
  type: PubstarAdType;
  customConfig?: NativeCustomConfig;
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
  customConfig,
  onLoaded,
  onLoadedError,
  onShowed,
  onHide,
  onShowedError,
}: Props) => {
  function getHeight() {
    if (type === "banner") {
      return (
        BannerHeight[size as keyof typeof BannerHeight] ?? BannerHeight.small
      );
    }

    if (type === "native") {
      if (customConfig) {
        return NativeHeight.large;
      }

      return NativeHeight[size] ?? NativeHeight.small;
    }

    return NativeHeight.small;
  }

  const [height, setHeight] = useState(() => {
    if (Platform.OS === "android") {
      return 0;
    }

    return getHeight();
  });

  function updateHeight() {
    setHeight(getHeight());
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
      style={StyleSheet.flatten([{ height, width: "100%" }, style])}
      type={type}
      customConfig={customConfig}
      onLoaded={onLoaded}
      onLoadedError={handleOnLoadedError}
      onShowed={handleOnShowed}
      onHide={handleOnHide}
      onShowedError={handleOnShowedError}
    />
  );
};

export default memo(PubstarAdView);