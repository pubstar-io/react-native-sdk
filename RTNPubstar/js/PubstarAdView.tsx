import React, { useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import PubstarAdViewNativeComponent from "./PubstarAdViewNativeComponent";

interface Props {
  adId: string;
  style: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
  type: "banner" | "native";
  onAdRendered?: () => void;
}

export default function PubstarAdView({
  adId,
  size = "small",
  style,
  type,
  onAdRendered,
}: Props) {
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
    />
  );
}
