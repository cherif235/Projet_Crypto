const initialModel2 = {
  config: {  //==================================== Configuration principale ===
    authors : 'par Abakar Tahir Cherif et lui-même',  // remplacez par vos noms
    debug   : true,       // afficher les traces de debugage ?
    dataMode: 'offline',  // soit 'online' ou 'offline'
    coins: {  //_________________ cryptos dans le portfolio de l'utilisateur ___
      XNC: {quantity: 1.0  , quantityNew: ''},
      XRP: {quantity: 5.0  , quantityNew: '10'},
      XTZ: {quantity: 50.0 , quantityNew: '100'},
      XMR: {quantity: 0    , quantityNew: ''},
      XRB: {quantity: 0    , quantityNew: '500'},
      XTO: {quantity: 0    , quantityNew: '-1'},
      XUC: {quantity: 0    , quantityNew: 'plein!'},
    },
    targets: {  // monnaies cibles pour la valeur des cryptos
      wished: 'ZMK',      // cible souhaitée si disponible
      list  : ['ZAR', 'ZMW', 'STD', 'SYP', 'THB'],  // cibles préférées
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
            text : '',      // sur codes et noms des cryptos
            price: 0,       // sur valeur minimum des cryptos
          },
          sort: {   //....................................... Tri du tableau ...
            column  : 0,  // colonne actuellement triée
            columns : ['code','name','price','change'], // propriétés affichées
            incOrder: [ true , true , true  , true   ],  // ordre croissant
                                                         //   par colonne ?
          },
          pagination: {  //...................................... Pagination ...
            rowsPerPage      : [5, 10, 15],  // nbre de lignes par pages dispo
            rowsPerPageIndex : 2,  // indice du nbre de ligne sélectionné
            maxPages         : 8,  // nbre max de pages dans la pagination
            currentPage      : 25,  // page courante
          },
        },
        fiats: {  //---------------------------------------- Onglet Monnaies ---
          filters: {  //............................................ Filtres ...
            text: '',  // sur noms des monnaies
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
            currentPage      : 14,
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
