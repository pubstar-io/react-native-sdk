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

#import "rtn_pubstar-Swift.h"


using namespace facebook::react;

inline void emitLoaded(const PubstarAdViewEventEmitter &emitter) {
    PubstarAdViewEventEmitter::OnLoaded ev;
    emitter.onLoaded(ev);
}

inline void emitHide(const PubstarAdViewEventEmitter &emitter) {
    PubstarAdViewEventEmitter::OnHide ev;
    emitter.onHide(ev);
}

inline void emitShowed(const PubstarAdViewEventEmitter &emitter) {
    PubstarAdViewEventEmitter::OnShowed ev;
    emitter.onShowed(ev);
}

inline void emitError(const PubstarAdViewEventEmitter &emitter, const char *name, int code) {
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
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSLog(@"---init: %@", [self description]);
        moduleImpl = [PubstarImpl new];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    NSLog(@"---initWithFrame");
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const PubstarAdViewProps>();
        _props = defaultProps;
      
        _view = [[UIView alloc] init];
        _view.backgroundColor = [UIColor whiteColor];

        [self addSubview:_view];
    }

  return self;
}

- (void)dealloc {
    moduleImpl = nil;
}

+ (void)load
{
    [super load];
    NSLog(@"---load");
}

-(void)didMoveToSuperview {
    NSLog(@"---didMoveToSuperview");
    if (self.superview == nil) {
        return;
    }
    
    auto &emitter = self.eventEmitter;
    
    if ([type  isEqual: @"banner"]) {
        [moduleImpl loadAndShowBannerAdWithAdId:adId view: _view size: size onLoaderError:^(NSInteger errorCode) {
            emitError(emitter, "LOADED_ERROR", (int)errorCode);
        } onLoaded:^{
            emitLoaded(emitter);
        } onHide:^{
            emitHide(emitter);
        } onShowed:^{
            emitShowed(emitter);
        } onShowedError:^(NSInteger errorCode) {
            emitError(emitter, "SHOWED_ERROR", (int)errorCode);
        }];
        return;
    }
    
    if ([type  isEqual: @"native"]) {
        [moduleImpl loadAndShowNativeAdWithAdId:adId view: _view size: size onLoaderError:^(NSInteger errorCode) {
            emitError(emitter, "LOADED_ERROR", (int)errorCode);
        } onLoaded:^{
            emitLoaded(emitter);
        } onHide:^{
            emitHide(emitter);
        } onShowed:^{
            emitShowed(emitter);
        } onShowedError:^(NSInteger errorCode) {
            emitError(emitter, "SHOWED_ERROR", (int)errorCode);
        }];
        return;
    }
    
}

-(void)layoutSubviews
{
    [super layoutSubviews];
    NSLog(@"---self.bounds.size.width: %f", self.bounds.size.width);
    NSLog(@"---self.bounds.size.height: %f", self.bounds.size.height);
    _view.frame = self.bounds;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    NSLog(@"---updateProps");
    const auto &oldViewProps = *std::static_pointer_cast<PubstarAdViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<PubstarAdViewProps const>(props);

    if (oldViewProps.size != newViewProps.size) {
      size = [[NSString alloc] initWithCString:newViewProps.size.c_str() encoding:NSASCIIStringEncoding];
    }
    
    if (oldViewProps.adId != newViewProps.adId) {
        adId = [[NSString alloc] initWithCString:newViewProps.adId.c_str() encoding:NSASCIIStringEncoding];
    }
    
    if (oldViewProps.type != newViewProps.type) {
        type = [[NSString alloc] initWithCString:newViewProps.type.c_str() encoding:NSASCIIStringEncoding];
    }
    

    [super updateProps:props oldProps:oldProps];
}

- (const PubstarAdViewEventEmitter &)eventEmitter
{
  return static_cast<const PubstarAdViewEventEmitter &>(*_eventEmitter);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<PubstarAdViewComponentDescriptor>();
}

@end
