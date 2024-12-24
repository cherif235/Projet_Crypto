
//-------------------------------------------------------------------- State ---
// État de l'application avant affichage
//
state = {

  data: {
    // hasChanged: false,
    cryptos: {
      list       : {},
      listNum    : 0,
      filtered   : [],
      filteredNum: 0,
    },
    fiats: {
      list       : {},
      listNum    : 0,
      filtered   : [],
      filteredNum: 0,
    },
    coins: {
      allCodes : [],
      posValueCodes : [],
      nullValueCodes : [],
    },
  },
  ui: {
    currenciesCard: {
      tabs: {
        cryptos: {
          pagination: {
            nbPages: 1,
          },
        },
        fiats: {
          pagination: {
            nbPages: 1,
          },
        },
      },
    },
  },
  representations: {
    app: '',
    currencies: '',
    preferences: '',
    wallet: '',
  },

  samUpdate(model) {

    const hasChanged = model.hasChanged;

    if (hasChanged.coins) {
      this.updateCoinsLists(model);
      hasChanged.coins = false;
    }
    if (hasChanged.currencies) {
      this.updateCryptosList(model);
      this.updateCryptosFiltered(model);
      this.updatePagination(model, 'cryptos');
      this.updateFiatsList(model);
      this.updateFiatsFiltered(model);
      this.updatePagination(model, 'fiats');
      hasChanged.cryptos.filter = false;
      hasChanged.fiats.filter = false;
      hasChanged.cryptos.pagination = false;
      hasChanged.fiats.pagination = false;
      hasChanged.currencies = false;
    }
    if (hasChanged.cryptos.filter) {
      this.updateCryptosFiltered(model);
      this.updatePagination(model, 'cryptos');
      hasChanged.cryptos.pagination = false;
      hasChanged.cryptos.filter = false;
    }
    if (hasChanged.fiats.filter) {
      this.updateFiatsFiltered(model);
      this.updatePagination(model, 'fiats');
      hasChanged.fiats.pagination = false;
      hasChanged.fiats.filter = false;
    }
    if (hasChanged.cryptos.pagination) {
      this.updatePagination(model, 'cryptos');
      hasChanged.cryptos.pagination = false;
    }
    if (hasChanged.fiats.pagination) {
      this.updatePagination(model, 'fiats');
      hasChanged.fiats.pagination = false;
    }
    if (hasChanged.cryptos.sort) {
      this.updateSortOrder(model, 'cryptos')
      hasChanged.cryptos.sort = false;
    }
    if (hasChanged.fiats.sort) {
      this.updateSortOrder(model, 'fiats')
      hasChanged.fiats.sort = false;
    }

    this.samRepresent(model);
    // this.samNap(model);
  },

  // Met à jour l'état de l'application, construit le code HTML correspondant,
  // et demande son affichage.
  samRepresent(model) {

    this.representations.currencies  = view.currenciesUI(model,this);
    this.representations.preferences = view.preferencesUI(model,this);
    this.representations.wallet      = view.walletUI(model,this);
    this.representations.app         = view.appUI(model, this);

    view.samDisplay(model.ui.sectionId, this.representations.app);
  },

  updateCoinsLists(model) {
    coins = model.config.coins;
    this.data.coins.allCodes       = Object.keys(coins).sort();
    this.data.coins.posValueCodes  = Object.entries(coins).filter( v => v[1].quantity >  0 ).map( v => v[0] ).sort();
    this.data.coins.nullValueCodes = Object.entries(coins).filter( v => v[1].quantity == 0 ).map( v => v[0] ).sort();

    if (model.config.debug) {
      console.log('state.samUpdate - coins.allCodes       :', this.data.coins.allCodes);
      console.log('state.samUpdate - coins.posValueCodes  :', this.data.coins.posValueCodes);
      console.log('state.samUpdate - coins.nullValueCodes :', this.data.coins.nullValueCodes);
    }
  },

  updateCryptosList(model) {
    const dataMode = model.config.dataMode;
    const list = model.data[dataMode].list.crypto;
    const live = model.data[dataMode].live.rates;

    const clist = {};
    for (let key in list) {
      const dlist = list[key];
      const dlive = live[key];
      clist[key] = {
        code    : dlist.symbol,
        name    : dlist.name,
        icon_url: dlist.icon_url,
        price   : dlive.rate,
        change  : dlive.change,
      };
    }
    this.data.cryptos.list    = clist;
    this.data.cryptos.listNum = Object.keys(clist).length;

    if (model.config.debug)
    console.log('state.samUpdate - cryptos.list :', this.data.cryptos.listNum, list);
  },

  updateFiatsList(model) {
    const dataMode = model.config.dataMode;
    const list = model.data[dataMode].list.fiat;
    const fiatsInfo = model.data.fiatsInfo;

    const clist = {};
    for (let key in list) {
      const dlist = list[key];
      let dfiat = fiatsInfo[key];
      if (!dfiat) dfiat = { symbol: key };
      clist[key] = {
        code  : key,
        name  : dlist,
        symbol: dfiat.symbol,
      };
    }
    this.data.fiats.list = clist;
    this.data.fiats.listNum = Object.keys(clist).length;

    if (model.config.debug)
      console.log('state.samUpdate - fiats.list :', this.data.fiats.listNum, clist);
  },

  updateCryptosFiltered(model) {
    const filters = model.ui.currenciesCard.tabs.cryptos.filters;
    const cFiltered = Object.values(this.data.cryptos.list).filter( v => {

      const code = v.code.toLowerCase().includes(filters.text.toLowerCase());
      const name = v.name.toLowerCase().includes(filters.text.toLowerCase());
      const price = v.price >= filters.price;


      return (code || name) && price;
    });
    this.data.cryptos.filtered    = cFiltered;
    this.data.cryptos.filteredNum = cFiltered.length;

    if (model.config.debug) console.log('state.samUpdate - cryptos.filtered :', cFiltered);
  },

  updateFiatsFiltered(model) {
    const filters = model.ui.currenciesCard.tabs.fiats.filters;
    const fFiltered = Object.values(this.data.fiats.list).filter( v => {

      const code = v.code.toLowerCase().includes(filters.text.toLowerCase());
      const name = v.name.toLowerCase().includes(filters.text.toLowerCase());

      return code || name;
    });
    this.data.fiats.filtered = fFiltered;
    this.data.fiats.filteredNum = fFiltered.length;

    if (model.config.debug) console.log('state.samUpdate - fiats.filtered :', fFiltered);
  },

  updateSortOrder(model, currency) {
    const sort  = model.ui.currenciesCard.tabs[currency].sort;
    const prop  = sort.columns [sort.column];
    const order = sort.incOrder[sort.column] ? 1 : -1;
    this.data[currency].filtered.sort( (a,b) => {
      switch (typeof(a[prop])) {
        case 'number': return (a[prop]-b[prop])*order;
        case 'string': return a[prop].localeCompare(b[prop])*order;
      }
    });
    if (model.config.debug) console.log('state.samUpdate - '+currency+'.filtered :', this.data[currency].filtered);
  },

  updatePagination(model, currency) {

    const pagination = model.ui.currenciesCard.tabs[currency].pagination;
    const numRows = state.data[currency].filteredNum;
    const numRowsPerPage = pagination.rowsPerPage[pagination.rowsPerPageIndex];
    const nbPages = Math.ceil(numRows / numRowsPerPage);
    this.ui.currenciesCard.tabs[currency].pagination.nbPages = nbPages;
    if (pagination.currentPage>nbPages) pagination.currentPage = nbPages;
    if (model.config.debug) console.log('state.samUpdate - updatePagination '+currency);
  },

};
