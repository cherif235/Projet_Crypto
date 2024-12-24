
// Coin Layer API Infos
const coinlayerInfos = {
  apiKey : 'a3efb1d1b435a359d9180cbfe9056875',
  liveUrl : 'http://api.coinlayer.com/api/live',
  listUrl : 'http://api.coinlayer.com/list',

  defaults : {
    liveOptions : {
      target: 'EUR',
      symbols: 'BTC,ETH',
    },
    listOptions : {},
  },
};

const coinlayer = {

  listRequest(debug) {
    return this.request(coinlayerInfos.listUrl, {}, debug);
  },

   liveRequest(options, debug) {
    return this.request(coinlayerInfos.liveUrl, options, debug);
  },

  async request(url, options, debug) {

    url += '?';
    options.access_key = coinlayerInfos.apiKey;

    const queryString = Object.entries(options).map( (v) => v.join('=')).join('&');

    if (debug) console.log(url+queryString);

    try {
      const params = {};
      const data = await fetch(url + queryString, params)
        .then( response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log('Network related error');
          }
        });
        if (debug) console.log('coinlayer response:',data);

        if (data.success) { return data; }
        else {
          console.log('coinlayer error: '+data.error.code+': '+data.error.type);
          return {success:data.success};
        }

    } catch (error) {
      console.log('coinlayer error: ' + error.message);
    }
  },

};
