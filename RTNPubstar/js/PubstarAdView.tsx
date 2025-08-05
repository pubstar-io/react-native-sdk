import React, { memo, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import PubstarAdViewNativeComponent from "./PubstarAdViewNativeComponent";

interface Props {
  adId: string;
  style: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
  type: "banner" | "native";
  onAdRendered?: () => void;
  onLoaded?: () => void;
  onLoadedError?: () => void;
  onShowed?: () => void;
  onHide?: () => void;
  onShowedError?: () => void;
}

const PubstarAdView = ({
  adId,
  size = "small",
  style,
  type,
  onAdRendered,
  onLoaded,
  onLoadedError,
  onShowed,
  onHide,
  onShowedError,
}: Props) => {
  const formatSize = useMemo(() => {
    switch (size) {
      case "small":
        return "small";
      case "medium":
        return "medium";
      case "large":
        return "large";
      default:
        return "small";
    }
  }, [size]);

  const formatType = useMemo(() => {
    switch (type) {
      case "banner":
        return "banner";
      case "native":
        return "native";
      default:
        return "banner";
    }
  }, [type]);

  return (
    <PubstarAdViewNativeComponent
      adId={adId}
      size={formatSize}
      style={style}
      type={formatType}
      onAdRendered={onAdRendered}
      onLoaded={onLoaded}
      onLoadedError={onLoadedError}
      onShowed={onShowed}
      onHide={onHide}
      onShowedError={onShowedError}
    />
  );
}

export default memo(PubstarAdView);