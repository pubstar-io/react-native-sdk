//
//  RTNPubstarAdView.mm
//  rtn_pubstar
//
//  Created by Mobile  on 10/6/25.
//

#import "RTNPubstarAdView.h"

#import <react/renderer/components/RTNPubstarSpec/ComponentDescriptors.h>
#import <react/renderer/components/RTNPubstarSpec/EventEmitters.h>
#import <react/renderer/components/RTNPubstarSpec/Props.h>
#import <react/renderer/components/RTNPubstarSpec/RCTComponentViewHelpers.h>

#import "PSRewardParsing.h"
#import "rtn_pubstar/rtn_pubstar-Swift.h"

using namespace facebook::react;

inline void emitLoaded(const PubstarAdViewEventEmitter &emitter) {
    PubstarAdViewEventEmitter::OnLoaded ev;
    emitter.onLoaded(ev);
}

inline void emitHide(const PubstarAdViewEventEmitter &emitter,
                     NSDictionary *_Nullable reward) {
    PubstarAdViewEventEmitter::OnHide ev;

    if (reward != nil) {
        id typeObj = reward[@"type"];
        id amountObj = reward[@"amount"];

        if ([typeObj isKindOfClass:NSString.class]) {
            ev.type = std::string([(NSString *)typeObj UTF8String]);
        }
        if ([amountObj isKindOfClass:NSNumber.class]) {
            ev.amount = (int)[(NSNumber *)amountObj intValue];
        }
    }

    emitter.onHide(ev);
}

inline void emitShowed(const PubstarAdViewEventEmitter &emitter) {
    PubstarAdViewEventEmitter::OnShowed ev;
    emitter.onShowed(ev);
}

inline void emitError(const PubstarAdViewEventEmitter &emitter,
                      const char *name, int code) {
    PubstarAdViewEventEmitter::OnShowedError ev;
    ev.name = name;
    ev.code = code;
    emitter.onShowedError(ev);
}

@interface RTNPubstarAdView () <RCTPubstarAdViewViewProtocol>
@end

@implementation RTNPubstarAdView {
    UIView *_view;
    PubstarImpl *moduleImpl;
    NSString *adId;
    NSString *size;
    NSString *type;
    NSDictionary *customConfigDict;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        moduleImpl = [PubstarImpl new];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps =
            std::make_shared<const PubstarAdViewProps>();
        _props = defaultProps;

        _view = [[UIView alloc] init];

        [self removeFromSuperview];
        [self addSubview:_view];
    }

    return self;
}

- (void)dealloc {
    moduleImpl = nil;
}

+ (void)load {
    [super load];
}

- (void)didMoveToSuperview {
    if (self.superview == nil) {
        return;
    }

    auto &emitter = self.eventEmitter;

    if ([type isEqual:@"banner"]) {
        [moduleImpl loadAndShowBannerAdWithAdId:adId
            view:_view
            size:size
            onLoaderError:^(NSInteger errorCode) {
              emitError(emitter, "LOADED_ERROR", (int)errorCode);
            }
            onLoaded:^{
              emitLoaded(emitter);
            }
            onHide:^(NSDictionary<NSString *, id> *_Nullable payload) {
              NSDictionary *args = PSRewardFromPayload(payload);

              if (!args) {
                  emitHide(emitter, nil);
                  return;
              }

              emitHide(emitter, args);
            }
            onShowed:^{
              emitShowed(emitter);
            }
            onShowedError:^(NSInteger errorCode) {
              emitError(emitter, "SHOWED_ERROR", (int)errorCode);
            }];
        return;
    }

    if ([type isEqual:@"native"]) {
        [moduleImpl loadAndShowNativeAdWithAdId:adId
            view:_view
            size:size
            onLoaderError:^(NSInteger errorCode) {
              emitError(emitter, "LOADED_ERROR", (int)errorCode);
            }
            onLoaded:^{
              emitLoaded(emitter);
            }
            onHide:^(NSDictionary<NSString *, id> *_Nullable payload) {
              NSDictionary *args = PSRewardFromPayload(payload);

              if (!args) {
                  emitHide(emitter, nil);
                  return;
              }

              emitHide(emitter, args);
            }
            onShowed:^{
              emitShowed(emitter);
            }
            onShowedError:^(NSInteger errorCode) {
              emitError(emitter, "SHOWED_ERROR", (int)errorCode);
            }
            customConfig: customConfigDict
        ];
        return;
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    _view.frame = self.bounds;
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
    const auto &oldViewProps =
        *std::static_pointer_cast<PubstarAdViewProps const>(_props);
    const auto &newViewProps =
        *std::static_pointer_cast<PubstarAdViewProps const>(props);

    if (oldViewProps.size != newViewProps.size) {
        size = [[NSString alloc] initWithCString:newViewProps.size.c_str()
                                        encoding:NSASCIIStringEncoding];
    }

    if (oldViewProps.adId != newViewProps.adId) {
        adId = [[NSString alloc] initWithCString:newViewProps.adId.c_str()
                                        encoding:NSASCIIStringEncoding];
    }

    if (oldViewProps.type != newViewProps.type) {
        type = [[NSString alloc] initWithCString:newViewProps.type.c_str()
                                        encoding:NSASCIIStringEncoding];
    }

    NSMutableDictionary *configDict = [NSMutableDictionary new];

    NSString *layoutStr = [[NSString alloc]
        initWithCString:newViewProps.customConfig.layoutName.c_str()
               encoding:NSUTF8StringEncoding];
    if (layoutStr && layoutStr.length > 0) {
        configDict[@"layoutName"] = layoutStr;
    }
    if (newViewProps.customConfig.titleTextViewId != 0) {
        configDict[@"titleTextViewId"] =
            @(newViewProps.customConfig.titleTextViewId);
    }
    if (newViewProps.customConfig.bodyTextViewId != 0) {
        configDict[@"bodyTextViewId"] =
            @(newViewProps.customConfig.bodyTextViewId);
    }
    if (newViewProps.customConfig.advertiserTextViewId != 0) {
        configDict[@"advertiserTextViewId"] =
            @(newViewProps.customConfig.advertiserTextViewId);
    }
    if (newViewProps.customConfig.iconImageViewId != 0) {
        configDict[@"iconImageViewId"] =
            @(newViewProps.customConfig.iconImageViewId);
    }
    if (newViewProps.customConfig.mediaContentViewGroupId != 0) {
        configDict[@"mediaContentViewGroupId"] =
            @(newViewProps.customConfig.mediaContentViewGroupId);
    }
    if (newViewProps.customConfig.callToActionButtonId != 0) {
        configDict[@"callToActionButtonId"] =
            @(newViewProps.customConfig.callToActionButtonId);
    }
    if (newViewProps.customConfig.adSocialContextId != 0) {
        configDict[@"adSocialContextId"] =
            @(newViewProps.customConfig.adSocialContextId);
    }
    if (newViewProps.customConfig.adIconImageViewId != 0) {
        configDict[@"adIconImageViewId"] =
            @(newViewProps.customConfig.adIconImageViewId);
    }
    if (newViewProps.customConfig.webViewId != 0) {
        configDict[@"webViewId"] =
            @(newViewProps.customConfig.webViewId);
    }
    
    NSString *loadingViewIdStr = [[NSString alloc]
        initWithCString:newViewProps.customConfig.loadingViewId.c_str()
               encoding:NSUTF8StringEncoding];
    if (loadingViewIdStr && loadingViewIdStr.length > 0) {
        configDict[@"loadingViewId"] = loadingViewIdStr;
    }
    customConfigDict = [configDict copy];

    [super updateProps:props oldProps:oldProps];
}

- (const PubstarAdViewEventEmitter &)eventEmitter {
    return static_cast<const PubstarAdViewEventEmitter &>(*_eventEmitter);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
    return concreteComponentDescriptorProvider<
        PubstarAdViewComponentDescriptor>();
}

@end
