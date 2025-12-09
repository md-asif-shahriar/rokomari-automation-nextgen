import log from '../utils/logger.js';

export class GiftVoucherPage {
  constructor(page) {
    this.page = page;
  }

  get byEmail(){
    return this.page.getByAltText('Email');
  }
  get normalVoucher(){
    return this.page.getByAltText('Rokomari Voucher');
  }

  get orderButton(){
    return this.page.getByRole('button', {name: 'অর্ডার করুন'});
  }

  async giftVoucherOrder(){
    log.info(`Selecting send method`);
    await this.byEmail.click();
    log.info(`Selecting occasion for voucher`);
    await this.normalVoucher.click();
    log.info(`Selecting amount`);

  }
  async giftVoucherOrder(){
    log.info(`Click order`);
    await this.orderButton.click();
  }
}