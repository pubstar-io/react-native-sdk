package io.rtnpubstar;

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class PubstarPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
  if (name == PubstarModule.NAME) {
    PubstarModule(reactContext)
  } else {
    null
  }

 override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
   mapOf(
     PubstarModule.NAME to ReactModuleInfo(
       PubstarModule.NAME,
       PubstarModule.NAME,
       false, // canOverrideExistingModule
       false, // needsEagerInit
       false, // isCxxModule
       true // isTurboModule
     )
   )
 }
}