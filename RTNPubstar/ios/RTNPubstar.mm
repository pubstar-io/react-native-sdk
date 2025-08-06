#import "RTNPubstar.h"

@implementation RTNPubstar

RCT_EXPORT_MODULE()

- (void)initialization:(RCTPromiseResolveBlock)resolve
     reject:(RCTPromiseRejectBlock)reject
{
  NSLog(@"[Pubstar] Init default");
  resolve(nil);
}

- (void)loadAndShow:(NSString *)adId
    onLoadError:(RCTResponseSenderBlock)onLoadError
    onLoaded:(RCTResponseSenderBlock)onLoaded
    onAdHide:(RCTResponseSenderBlock)onAdHide
    onAdShowed:(RCTResponseSenderBlock)onAdShowed
    onError:(RCTResponseSenderBlock)onError
{
  NSLog(@"[Pubstar] loadAndShow called with adId: %@", adId);

  // Fake logic: mô phỏng load thành công sau 1 giây
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    // Gọi callback onLoaded
    onLoaded(@[]); // không có tham số

    // Gọi onAdShowed
    onAdShowed(@[]);

    // Gọi onAdHide với reward
    NSDictionary *reward = @{
      @"type": @"coin",
      @"amount": @(50)
    };
    onAdHide(@[reward]);
  });

  // Gọi lỗi giả lập sau 3s
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSDictionary *error = @{
      @"name": @"SHOW_ERROR",
      @"code": @(102)
    };

    // Gọi onError và onLoadError
    onError(@[error]);
    onLoadError(@[error]);
  });
}

- (void)add:(double)a b:(double)b resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSNumber *result = [[NSNumber alloc] initWithInteger:a+b];
    resolve(result);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRTNPubstarSpecJSI>(params);
}

@end