import type { ViewProps } from "react-native";
import { codegenNativeComponent } from "react-native/Libraries/Utilities/codegenNativeComponent";
import type {
  DirectEventHandler,
  Int32
} from 'react-native/Libraries/Types/CodegenTypes';

type AdErrorEvent = Readonly<{
  name: string;
  code: Int32;
}>;


type AdRewardEvent = Readonly<{
  type: string;
  amount: Int32;
}>;

type AdEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  adId: string;
  type: string;
  size?: string;
  onLoaded?: DirectEventHandler<AdEvent>;
  onLoadedError?: DirectEventHandler<AdErrorEvent>;
  onShowed?: DirectEventHandler<AdEvent>;
  onHide?: DirectEventHandler<AdRewardEvent>;
  onShowedError?: DirectEventHandler<AdErrorEvent>;
}

export default codegenNativeComponent<NativeProps>("PubstarAdView");
