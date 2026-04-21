export class NativeCustomConfig {
  private constructor(
    public readonly layoutName: string,
    public readonly advertiserTextViewId?: string,
    public readonly iconImageViewId?: string,
    public readonly titleTextViewId?: string,
    public readonly mediaContentViewGroupId?: string,
    public readonly bodyTextViewId?: string,
    public readonly callToActionButtonId?: string,
    public readonly loadingViewName?: string,
    public readonly ctaColorHex?: string,
  ) {}

  static Builder = class {
    private layoutName: string;
    private advertiserTextViewId?: string;
    private iconImageViewId?: string;
    private titleTextViewId?: string;
    private mediaContentViewGroupId?: string;
    private bodyTextViewId?: string;
    private callToActionButtonId?: string;
    private loadingViewName?: string;
    private ctaColorHex?: string;

    constructor(layoutName: string) {
      this.layoutName = layoutName;
    }

    setAdvertiserTextViewId(id: string): this {
      this.advertiserTextViewId = id;
      return this;
    }

    setIconImageViewId(id: string): this {
      this.iconImageViewId = id;
      return this;
    }

    setTitleTextViewId(id: string): this {
      this.titleTextViewId = id;
      return this;
    }

    setMediaContentViewGroupId(id: string): this {
      this.mediaContentViewGroupId = id;
      return this;
    }

    setBodyTextViewId(id: string): this {
      this.bodyTextViewId = id;
      return this;
    }

    setCallToActionButtonId(id: string): this {
      this.callToActionButtonId = id;
      return this;
    }

    setLoadingViewName(id: string): this {
      this.loadingViewName = id;
      return this;
    }

    setCtaColorHex(id: string): this {
      this.ctaColorHex = id;
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
        this.ctaColorHex
      )
    }
  };
}