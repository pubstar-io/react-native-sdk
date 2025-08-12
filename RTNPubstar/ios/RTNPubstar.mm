//
//  RTNPubstar.mm
//  rtn_pubstar
//
//  Created by Mobile  on 10/6/25.
//

#import "RTNPubstar.h"
#import "PSRewardParsing.h"
#import "rtn_pubstar-Swift.h"

@implementation RTNPubstar {
  PubstarImpl *moduleImpl;
}

- (instancetype)init {
  self = [super init];

  if (self) {
    moduleImpl = [PubstarImpl new];
  }

  return self;
}

RCT_EXPORT_MODULE()

- (void)initialization:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  if (!moduleImpl) {
    reject(@"NO_IMPL", @"Pubstar Module implementation not available", nil);
    return;
  }

  __block BOOL isCalled = NO;

  [moduleImpl
      initializationOnDone:^{
        if (isCalled)
          return;
        isCalled = YES;

        NSLog(@"[Pubstar] Init success");
        resolve(@YES);
      }
      onError:^(NSInteger errorCode) {
        if (isCalled)
          return;
        isCalled = YES;

        reject(@"INIT_ERROR",
               [NSString stringWithFormat:@"Error code: %ld", (long)errorCode],
               nil);
      }];
}

- (void)loadAndShow:(NSString *)adId
        onLoadError:(RCTResponseSenderBlock)onLoadError
           onLoaded:(RCTResponseSenderBlock)onLoaded
           onAdHide:(RCTResponseSenderBlock)onAdHide
         onAdShowed:(RCTResponseSenderBlock)onAdShowed
            onError:(RCTResponseSenderBlock)onError {

  [moduleImpl loadAndShowWithAdId:adId
      onLoadedError:^(NSInteger errorCode) {
        NSDictionary *error =
            @{@"name" : @"LOADED_ERROR",
              @"code" : @(errorCode)};

        onLoadError(@[ error ]);
      }
      onLoaded:^{
        onLoaded(@[]);
      }
    onHide:^(NSDictionary<NSString *, id> * _Nullable payload) {
            NSArray *args = PSRewardArrayFromPayload(payload);

            if (!args) {
              NSLog(@"[Pubstar] onHide without payload2");
              onAdHide(@[]);
              return;
            }

            onAdHide(args);
      }
      onShowed:^{
        onAdShowed(@[]);
      }
      onShowedError:^(NSInteger errorCode) {
        NSDictionary *error =
            @{@"name" : @"SHOW_ERROR",
              @"code" : @(errorCode)};

        onError(@[ error ]);
      }];
}

- (void)loadAd:(NSString *)adId
       onError:(RCTResponseSenderBlock)onError
      onLoaded:(RCTResponseSenderBlock)onLoaded {
  [moduleImpl loadAdWithAdId:adId
      onLoaded:^{
        onLoaded(@[]);
      }
      onError:^(NSInteger errorCode) {
        NSDictionary *error =
            @{@"name" : @"LOADED_ERROR",
              @"code" : @(errorCode)};

        onError(@[ error ]);
      }];
}

- (void)showAd:(NSString *)adId
        onHide:(RCTResponseSenderBlock)onHide
      onShowed:(RCTResponseSenderBlock)onShowed
       onError:(RCTResponseSenderBlock)onError {
    [moduleImpl showAdWithAdId:adId
        onHide:^(NSDictionary<NSString *, id> * _Nullable payload) {
            NSArray *args = PSRewardArrayFromPayload(payload);

            if (!args) {
                NSLog(@"[Pubstar] onHide without payload2");
                onHide(@[]);
                return;
            }

            onHide(args);
        }
      onShowed:^{
        onShowed(@[]);
      }
      onError:^(NSInteger errorCode) {
        NSDictionary *error =
            @{@"name" : @"SHOWED_ERROR",
              @"code" : @(errorCode)};

        onError(@[ error ]);
      }];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRTNPubstarSpecJSI>(params);
}

@end
