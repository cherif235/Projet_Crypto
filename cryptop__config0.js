const initialModel0 = {
  config: {  //==================================== Configuration principale ===
    authors : 'par Abakar Tahir Cherif et lui-même',  // remplacez par vos noms
    debug   : true,       // afficher les traces de debugage ?
    dataMode: 'offline',  // soit 'online' ou 'offline'
    coins: {  //_________________ cryptos dans le portfolio de l'utilisateur ___
      BTC: {quantity: 1.0  , quantityNew: ''},
      ETH: {quantity: 8.5  , quantityNew: '13'},
      LTC: {quantity: 20.3 , quantityNew: '21'},
      DSH: {quantity: 0    , quantityNew: '-1'},
      BCH: {quantity: 0    , quantityNew: ''},
      BTLC:{quantity: 0    , quantityNew: '500'},
      XMR: {quantity: 0    , quantityNew: 'plein!'},
    },
    targets: {  // monnaies cibles pour la valeur des cryptos
      wished: 'USD',      // cible souhaitée si disponible
      list  : ['GBP', 'CUP', 'JEP', 'TTD', 'EUR'],  // cibles préférées
      active: undefined,  // cible disponible définie à l'initialisation
    },
  },
  data: {  //========================================================== data ===
    offline: {
      list: dataCoinlayerList,  // liste des cryptos
      live: dataCoinlayerLive,  // valeur des cryptos
    },
    online : {
      list: {},  // liste des cryptos
      live: {},  // valeur des cryptos
    },
    fiatsInfo: dataFiatCurrencies,  // liste d'informations sur les monnaies
  },
  ui: {  //================================================== User Interface ===
    sectionId: 'appId',

    currenciesCard: {  //___________________________________ Currencies Card ___
      selectedTab: 'cryptos',  // soit 'cryptos' ou 'fiats'
      tabs: {  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Onglets ~~~
        cryptos: {  //--------------------------------------- Onglet Cryptos ---
          filters: {  //............................................ Filtres ...
            text : 'coin',  // sur codes et noms des cryptos
            price: 5,       // sur valeur minimum des cryptos
          },
          sort: {   //....................................... Tri du tableau ...
            column  : 0,  // colonne actuellement triée
            columns : ['code','name','price','change'], // propriétés affichées
            incOrder: [ true , true , true  , true   ],  // ordre croissant
                                                         //   par colonne ?
          },
          pagination: {  //...................................... Pagination ...
            rowsPerPage      : [5, 10, 15],  // nbre de lignes par pages dispo
            rowsPerPageIndex : 1,  // indice du nbre de ligne sélectionné
            maxPages         : 8,  // nbre max de pages dans la pagination
            currentPage      : 1,  // page courante
          },
        },
        fiats: {  //---------------------------------------- Onglet Monnaies ---
          filters: {  //............................................ Filtres ...
            text: 'ro',  // sur noms des monnaies
          },
          sort: {   //....................................... Tri du tableau ...
            column  : 0,
            columns : ['code','name','symbol'],
            incOrder: [ true , true , true   ],
          },
          pagination: {  //...................................... Pagination ...
            rowsPerPage      : [5, 10, 15],
            rowsPerPageIndex : 1,
            maxPages         : 8,
            currentPage      : 2,
          },
        },
      },
    },
    walletCard: { //____________________________________________ Wallet Card ___
      selectedTab: 'portfolio',  // soit 'portfolio' ou 'ajouter'
    },
  },
  hasChanged: {  //============================================== A changé ? ===
    coins          : true,
    currencies     : true,
    cryptos : {
      filter       : true,
      pagination   : true,
      sort         : true,
    },
    fiats : {
      filter       : true,
      pagination   : true,
      sort         : true,
    },
  },
};
