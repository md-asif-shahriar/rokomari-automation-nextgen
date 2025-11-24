const testData = {
  viewDetailsProductId: 188342,
  cartProductId: 188342,
  searchKeyword: 'ahkamun nisa',
  productTitle: 'আহকামুন নিসা',
  localAddress: {
    name: 'Rok T',
    phone: '01711112222',
    alternatePhone: '01833334444',
    countryBD: 'বাংলাদেশ',
    countryIndia: 'ভারত',
    city: 'Dhaka',
    area: 'Agargaon',
    addressLine: 'Test Address',
    addressType: 'Home',
  },

  locators:{
    paymentGatewayPage:{
      bkash: '#WALLET',
      nagad: '#account-form',
      card: '#tapImg'
    }
  }, 
  
  paymentMethod: {
    bkash: 'bkash',
    nagad: 'nagad',
    rocket: 'rocket',
    cod: 'cod',
    card: 'card',
  },
  domain: {
    bkash: 'https://payment.bkash.com', //https://sandbox.payment.bkash.com
    nagad: 'https://payment.mynagad.com:30000',
    rocket: 'ROCKET',
    cod: 'COD',
    card: 'https://epay-gw.sslcommerz.com',
  },

  // Page titles
  titles: {
    homePage: 'Rokomari.com | Online Shopping for Books, Electronics, Gadgets, Personal Care, Beauty Products, Lifestyle & More',
    signInPage: 'Login To Rokomari | Rokomari.com',
    searchResultPage: 'Search Page | Rokomari.com',
    bookDetailsPage: 'আহকামুন নিসা: Allama Muhammod Ataia Khamis | Rokomari.com',
    cartPage: 'My Cart | Rokomari.com',
    paymentPage: 'Shipping Address | Rokomari.com',
    confirmedOrderPage: 'Order Confirmation | Rokomari.com',
    trackOrderPage: 'Order Track | Rokomari.com',
    myOrderPage: 'My Orders | Rokomari.com',
    paymentGatewayPage: {
      bkash: 'Agreement only',
      nagad: 'Nagad Payment Page: Account',
      rocket: 'easyCheckout',
      ssl: 'easyCheckout',
    }
    
  },

  //Page URL paths
  paths: {
    homePage: '/',
    signInPage: '/login',
    searchResultPage: '/search',
    bookDetailsPage: '/book/195175/bela-furabar-age',
    cartPage: '/cart',
    shippingPage: '/shipping',
    confirmedOrderPage: '/confirmation',
    trackOrderPage: '/ordertrack',
    myOrderPage: '/my-section/orders',
    ebookPaymentPage: '/payment/ebook',
  }

};

export default testData;