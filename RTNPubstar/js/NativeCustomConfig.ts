export class NativeCustomConfig {
  private constructor(
    public readonly layoutName: string,
    public readonly advertiserTextViewId?: number,
    public readonly iconImageViewId?: number,
    public readonly titleTextViewId?: number,
    public readonly mediaContentViewGroupId?: number,
    public readonly bodyTextViewId?: number,
    public readonly callToActionButtonId?: number,
    public readonly loadingViewName?: string,
    public readonly adIconImageViewId?: number,
    public readonly webViewId?: number,
    public readonly adSocialContextId?: number,
  ) {}

  static Builder = class {
    private layoutName: string;
    private advertiserTextViewId?: number;
    private iconImageViewId?: number;
    private titleTextViewId?: number;
    private mediaContentViewGroupId?: number;
    private bodyTextViewId?: number;
    private callToActionButtonId?: number;
    private loadingViewName?: string;
    private adIconImageViewId?: number;
    private webViewId?: number;
    private adSocialContextId?: number;

    constructor(layoutName: string) {
      this.layoutName = layoutName;
    }

    setAdvertiserTextViewId(id: number): this {
      this.advertiserTextViewId = id;
      return this;
    }

    setIconImageViewId(id: number): this {
      this.iconImageViewId = id;
      return this;
    }

    setTitleTextViewId(id: number): this {
      this.titleTextViewId = id;
      return this;
    }

    setMediaContentViewGroupId(id: number): this {
      this.mediaContentViewGroupId = id;
      return this;
    }

    setBodyTextViewId(id: number): this {
      this.bodyTextViewId = id;
      return this;
    }

    setCallToActionButtonId(id: number): this {
      this.callToActionButtonId = id;
      return this;
    }

    setLoadingViewName(id: string): this {
      this.loadingViewName = id;
      return this;
    }

    setAdIconImageViewId(id: number): this {
      this.adIconImageViewId = id;
      return this;
    }

    setWebViewId(id: number): this {
      this.webViewId = id;
      return this;
    }

    setAdSocialContextId(id: number): this {
      this.adSocialContextId = id;
      return this;
    }

    build() {
      return new NativeCustomConfig(
        this.layoutName,
        this.advertiserTextViewId,
        this.iconImageViewId,
        this.titleTextViewId,
        this.mediaContentViewGroupId,
        this.bodyTextViewId,
        this.callToActionButtonId,
        this.loadingViewName,
        this.adIconImageViewId,
        this.webViewId,
        this.adSocialContextId,
      )
    }
  };
}
