#import "RTNPubstar.h"
#import "rtn_pubstar-Swift.h"

@implementation RTNPubstar {
    PubstarImpl *moduleImpl;
}

- (instancetype) init {
    self = [super init];
    
    if (self) {
        moduleImpl = [PubstarImpl new];
    }
    
    return self;
}

RCT_EXPORT_MODULE()

- (void)initialization:(RCTPromiseResolveBlock)resolve
     reject:(RCTPromiseRejectBlock)reject
{
 if (!moduleImpl) {
     reject(@"NO_IMPL", @"Pubstar Module implementation not available", nil);
     return;
 }
    
    
  __block BOOL isCalled = NO;
    
  [moduleImpl initializationOnDone:^{
      if (isCalled) return;
      isCalled = YES;
      
      NSLog(@"[Pubstar] Init success");
      resolve(@YES);
  } onError:^(NSInteger errorCode){
      if (isCalled) return;
      isCalled = YES;
      
      NSLog(@"[Pubstar] Init failed: %ld", (long)errorCode);
      reject(@"INIT_ERROR", [NSString stringWithFormat:@"Error code: %ld", (long)errorCode], nil);
  }];
}

- (void)loadAndShow:(NSString *)adId
    onLoadError:(RCTResponseSenderBlock)onLoadError
    onLoaded:(RCTResponseSenderBlock)onLoaded
    onAdHide:(RCTResponseSenderBlock)onAdHide
    onAdShowed:(RCTResponseSenderBlock)onAdShowed
    onError:(RCTResponseSenderBlock)onError
{
  NSLog(@"[Pubstar] loadAndShow called with adId: %@", adId);
    
    [moduleImpl loadAndShowWithAdId:adId];

//  // Fake logic: mô phỏng load thành công sau 1 giây
//  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//    // Gọi callback onLoaded
//    onLoaded(@[]); // không có tham số
//
//    // Gọi onAdShowed
//    onAdShowed(@[]);
//
//    // Gọi onAdHide với reward
//    NSDictionary *reward = @{
//      @"type": @"coin",
//      @"amount": @(50)
//    };
//    onAdHide(@[reward]);
//  });
//
//  // Gọi lỗi giả lập sau 3s
//  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//    NSDictionary *error = @{
//      @"name": @"SHOW_ERROR",
//      @"code": @(102)
//    };
//
//    // Gọi onError và onLoadError
//    onError(@[error]);
//    onLoadError(@[error]);
//  });
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
