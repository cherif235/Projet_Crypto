
//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {

  config: {},
  data : {},
  ui   : {},

  // Demande au modèle de se mettre à jour en fonction des données qu'on
  // lui présente.
  // l'argument data est un objet confectionné dans les actions.
  // Les propriétés de data apportent les modifications à faire sur le modèle.
  samPresent(data) {

    switch (data.do) {

      case 'init': {
        Object.assign(this, data.config);
        const conf = this.config;
        conf.targets.list = mergeUnique([conf.targets.wished], conf.targets.list).sort();
        const isOnline = conf.dataMode == 'online';
        conf.targets.active = isOnline ? conf.targets.wished : this.data.offline.live.target;
        this.hasChanged.currencies = true;
        if (conf.debug) console.log('model.samPresent - init - targets.list  : ', conf.targets.list);
        if (conf.debug) console.log('model.samPresent - init - targets.active: ', conf.targets.active);
      } break;

      case 'updateCurrenciesData': {
        this.data.online = data.currenciesData;
        this.config.targets.active = data.currenciesData.live.target;
        this.hasChanged.currencies = true;
      } break;

      case 'changeDataMode': {
        this.config.dataMode = data.dataMode;
        if (data.dataMode == 'offline') {
          this.config.targets.active = this.data.offline.live.target;
          this.hasChanged.currencies = true;
        }
      } break;

      case 'changeTab': {
        switch (data.tab) {
          case 'currenciesCryptos':
            this.ui.currenciesCard.selectedTab = 'cryptos';
            break;
          case 'currenciesFiats':
            this.ui.currenciesCard.selectedTab = 'fiats';
            break;
          case 'walletPortfolio':
            this.ui.walletCard.selectedTab = 'portfolio';
            break;
          case 'walletAjouter':
            this.ui.walletCard.selectedTab = 'ajouter';
            break;
            default:
        } 
      } break;
      case 'updateFilter': {
        const currency = this.ui.currenciesCard.tabs[data.currency];
        currency.filters.text = data.filterText;
        currency.pagination.currentPage = 1;
        this.hasChanged[data.currency].filter = true;
      } break;

      case 'updatePriceFilter': {
        const tabsCrypto = this.ui.currenciesCard.tabs.cryptos;
        tabsCrypto.filters.price = data.filterPrice;
        tabsCrypto.pagination.currentPage = 1;
        this.hasChanged.cryptos.filter = true;
      } break;

      case 'sort': {
        const currency = this.ui.currenciesCard.tabs[data.currency];
        const sort = currency.sort;
        if (sort.column == data.column) sort.incOrder[data.column] = !sort.incOrder[data.column];
        
        sort.column = data.column;
        currency.pagination.currentPage = 1;
        
        this.hasChanged[data.currency].sort = true;
        this.hasChanged[data.currency].pagination = true;
      } break;

      
      case 'changeRowsPerPage': {
        const pagination = this.ui.currenciesCard.tabs[data.currency].pagination;
        pagination.rowsPerPageIndex = data.rowsPerPageIndex;
        this.hasChanged[data.currency].pagination = true;
      } break;

      case 'changePage': {
        const pagination = this.ui.currenciesCard.tabs[data.currency].pagination;
        pagination.currentPage = data.index;
      } break;

      case 'changeCoinQuantity': {
        const coins = this.config.coins;
        const coin = coins[data.code];
        coin.quantityNew = data.quantityNew;
        this.hasChanged.coins = true;
      } break;

      case 'selectCurrency': {
        const code = data.code;
        switch (data.type) {
          case 'cryptos': {
            const coins = this.config.coins;
            let coin = coins[code];
            if (!coin) {
              coins[code] = {
              'quantity': 0,
              'quantityNew': ''
              };
              this.hasChanged.coins = true;
            } else if (coin.quantity == 0 && coin.quantityNew == '') {
              delete coins[code];
              this.hasChanged.coins = true;
            }
          } break;
          case 'fiats': {
            const list = this.config.targets.list;
            const active = this.config.targets.active;
            if (list.includes(code)) {
              if (code != active) {
                this.config.targets.list = list.filter(v => v != code);
              }
            } else {
              list.push(code);
              list.sort();
            }
          } break;
        }
      } break;

      case 'cancelCoinsEdition': {
        const coins = this.config.coins;
        Object.values(coins).forEach(v => {
          const filtre = data.which == 'zeroQuantities' && v.quantity == 0 || data.which == 'posQuantities' && v.quantity > 0;
          if (filtre) v.quantityNew = '';
        });
      } break;

      case 'confirmCoinsEdition': {
        const coins = this.config.coins;
        Object.values(coins).forEach(v => {
            const filtre = data.which == 'zeroQuantities' && v.quantity == 0 || data.which == 'posQuantities' && v.quantity > 0;
            if (filtre && parseFloat(v.quantityNew) >= 0) {
                v.quantity = parseFloat(v.quantityNew);
                v.quantityNew = '';
                this.hasChanged.coins = !false;
            }
        });
      } break;
      
      default:
        console.error(`model.samPresent(), unknown do: '${data.do}' `);
    }
    // Demande à l'état de l'application de prendre en compte la modification
    // du modèle
    state.samUpdate(this);
  }
};
