import type { ViewProps } from "react-native";
import { codegenNativeComponent } from "react-native/Libraries/Utilities/codegenNativeComponent";
import type {
  DirectEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';

type AdRenderedEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  adId: string;
  type: string;
  size?: string;
  onAdRendered?: DirectEventHandler<AdRenderedEvent>;
}

export default codegenNativeComponent<NativeProps>("PubstarAdView");
