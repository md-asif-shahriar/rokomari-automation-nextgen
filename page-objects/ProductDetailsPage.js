import { expect } from "@playwright/test";
export class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.bookTitle = page.locator(".detailsBookContainer_bookName__pLCtW");
    this.productImage = page.locator("#js--product-image img");
    //this.altTextElement = this.page.locator(`#js--product-image img[alt="${altText}"]`);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("load");
  }

  async visit(productId) {
    await this.page.goto(`/product/${productId}`);
    await this.waitForPageLoad();
  }
  async getTitle() {
    return await this.page.title();
  }
  /******************************* Product Info Begin ********************************/

  async getBookTitle() {
    return await this.bookTitle?.innerText();
  }

  /******************************* Product Info End ********************************/

  async isImgAttributePresent() {
    return (await this.productImage.count()) > 0;
  }

  async getImageSrc() {
    const src = await this.productImage.getAttribute("src");
    if(!src) return null;
    return src;
  }

  async isImageVisible() {
    return await this.productImage.isVisible();
  }

  async getImageAltText() {
    const altText = await this.productImage.getAttribute("alt");
    if(!altText) return 'No alt text found for this image';
    return altText;
  }
  async isAltTextVisible() {
    const altText = await this.productImage.getAttribute("alt");
    return await this.page.locator(`#js--product-image img[alt="${altText}"]`).isVisible();
  }



 /** HEAD then GET (for servers that don't support HEAD) – expects 2xx and image/* */
  async fetchImageResponse() {
    const url = await this.productImage.getAttribute("src");
    if (!url) return { ok: false, status: 0 };

    // Try HEAD first
    let res = null;
    try {
      res = await this.page.request.fetch(url, { method: 'HEAD', maxRedirects: 5 });
    } catch {
      // ignore and fallback to GET
    }
    if (!res || !res.ok()) {
      res = await this.page.request.get(url, { maxRedirects: 5 });
    }

    const ok = res.ok();
    const status = res.status();
    const contentType = res.headers()['content-type'];
    return { ok, status, contentType, url };
  }

  /** Confirms the image decoded/rendered in the page (not broken) */
  async imageDecodedInDOM(){
    if (!(await this.isImgAttributePresent())) return false;
    return await this.productImage.evaluate((el) =>
      el.complete && el.naturalWidth > 0 && el.naturalHeight > 0
    );
  }


}
