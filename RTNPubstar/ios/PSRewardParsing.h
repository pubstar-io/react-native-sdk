//
//  PSRewardParsing.h
//  rtn_pubstar
//
//  Created by Mobile  on 10/6/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

static inline NSDictionary * _Nullable PSRewardFromPayload(id _Nullable payload) {
  if (payload == nil || ![payload isKindOfClass:NSDictionary.class]) {
    return nil;
  }
  id type = payload[@"type"];
  id amountNumber = payload[@"amount"];
  if (![type isKindOfClass:NSString.class] || ![amountNumber isKindOfClass:NSNumber.class]) {
    return nil;
  }
  return @{ @"type": (NSString *)type, @"amount": (NSNumber *)amountNumber };
}

static inline NSArray * _Nullable PSRewardArrayFromPayload(id _Nullable payload) {
  NSDictionary *reward = PSRewardFromPayload(payload);
  return reward ? @[reward] : nil;
}


NS_ASSUME_NONNULL_END
