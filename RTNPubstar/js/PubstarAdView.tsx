import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import PubstarAdViewNativeComponent from './PubstarAdViewNativeComponent';

interface Props {
  adId: string;
  style: StyleProp<ViewStyle>;
  size?: 'small' | 'medium' | 'large';
}

export default function PubstarAdView({ adId, size = 'small', style }: Props) {
  return <PubstarAdViewNativeComponent adId={adId} size={size} style={style} />;
}
