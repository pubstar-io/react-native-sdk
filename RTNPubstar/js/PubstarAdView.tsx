import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import PubstarAdViewNativeComponent from "./PubstarAdViewNativeComponent";

interface Props {
  adId: string;
  style: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
  type: "banner" | "native";
}

export default function PubstarAdView({
  adId,
  size = "small",
  style,
  type,
}: Props) {
  return (
    <PubstarAdViewNativeComponent
      adId={adId}
      size={size}
      style={style}
      type={type}
    />
  );
}
