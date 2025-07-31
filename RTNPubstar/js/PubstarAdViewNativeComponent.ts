import type { ViewProps } from "react-native";
import { codegenNativeComponent } from "react-native/Libraries/Utilities/codegenNativeComponent";

export interface NativeProps extends ViewProps {
  adId?: string;
  size?: string;
}

export default codegenNativeComponent<NativeProps>("PubstarAdView");
