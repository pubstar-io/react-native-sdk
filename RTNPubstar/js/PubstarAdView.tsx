import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import PubstarAdViewNativeComponent from './PubstarAdViewNativeComponent';

interface Props {
  adId: string;
  style: StyleProp<ViewStyle>;
}

export default function PubstarAdView(props: Props) {
  return <PubstarAdViewNativeComponent {...props} />;
}
