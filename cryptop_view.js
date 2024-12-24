
//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

  // Injecte le HTML dans une balise de la page Web.
  samDisplay(sectionId, representation) {
    const section = document.getElementById(sectionId);
    section.innerHTML = representation;
  },

  // Renvoit le HTML de l'interface complète de l'application
  appUI(model, state) {
    const configsChooserHTML = this.configsChooserUI();
    return `
    <div class="container">
      ${configsChooserHTML}
      <h1 class="text-center">Portfolio Cryptos</h1>
      <br />
      <div class="row">
        <div class="col-lg-6">
            ${state.representations.currencies}
        <br />
        </div>

        <div class="col-lg-6">
          ${state.representations.preferences}
          <br />
          ${state.representations.wallet}
          <br />
        </div>
      </div>
    </div>
    `;
  },

  configsChooserUI() {
    const options = Object.keys(configs).map(v => {
      const selected = configsSelected == v ? 'selected="selected"' : '';
      return `
      <option ${selected}>${v}</option>
      `;
    }).join('\n');
    return `
    <div class="row">
      <div class="col-md-7"></div>
      <div class="col-md-5">
      <br />
        <div class="d-flex justify-content-end">
          <div class="input-group">
            <div class="input-group-prepend ">
              <label class="input-group-text">Config initiale :</label>
            </div>
            <select class="custom-select" onchange="actions.reinit({e:event})">
              ${options}
            </select>
          </div>
        </div>
      </div>
    </div>
    <br />
    `;
  },

  currenciesUI(model, state) {
    const tabName = model.ui.currenciesCard.selectedTab;
    switch (tabName) {
      case 'cryptos': return this.currenciesCrytopsUI(model, state); break;
      case 'fiats'  : return this.currenciesFiatsUI  (model, state); break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  currenciesCrytopsUI(model, state) {

    const paginationHTML = this.paginationUI(model, state, 'cryptos');

    const cryptoFilteredNum = state.data.cryptos.filteredNum;
    const cryptoListNum = state.data.cryptos.listNum;
    const fiatsFilteredNum = state.data.fiats.filteredNum;
    const fiatsListNum = state.data.fiats.listNum;
    const coinsPosValueCodes = state.data.coins.posValueCodes;
    const coinsAllCodes = state.data.coins.allCodes;
    
    const filtersText = model.ui.currenciesCard.tabs.cryptos.filters.text;
    const filtersPrice = model.ui.currenciesCard.tabs.cryptos.filters.price;
    const pagination = model.ui.currenciesCard.tabs.cryptos.pagination;

    const unicodeVariation = ['↘', '∼', '↗'];

    const page = pagination.currentPage - 1;
        const rowsPerPage = pagination.rowsPerPage[pagination.rowsPerPageIndex];
        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const listCrypto = state.data.cryptos.filtered.slice(start, end).map(v => {
            const favori = coinsPosValueCodes.includes(v.code) ? 'bg-success text-light' : coinsAllCodes.includes(v.code) ? 'bg-warning' : '';
            const variation = unicodeVariation[Math.sign(v.change) + 1];
            return `
            <tr class="${favori}" onclick="actions.selectCurrency({type:'cryptos',code:'${v.code}'})">
              <td class="text-center">
                <span class="badge badge-pill badge-light">
                  <img src="${v.icon_url}" /> ${v.code}
                </span>
              </td>
              <td><b>${v.name}</b></td>
              <td class="text-right"><b>${v.price.toFixed(2)}</b></td>
              <td class="text-right">${v.change.toFixed(3)} ${variation}</td>
            </tr>`;}).join(`\n`);

    const cryptosPreferees = coinsAllCodes.map(v => {
      const crypto = coinsPosValueCodes.includes(v) ? 'badge-success' : 'badge-warning';
      return `<span class="badge ${crypto}">${v}</span>`;}).join('\n');

    return `
    <div class="card border-secondary" id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#currencies"> Cryptos <span
                class="badge badge-light">${cryptoFilteredNum} / ${cryptoListNum}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies" onclick="actions.changeTab({tab:'currenciesFiats'})"> Monnaies cibles
              <span class="badge badge-secondary">${fiatsFilteredNum} / ${fiatsListNum}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${filtersText}" id="filterText" type="text" class="form-control" placeholder="code ou nom..." onchange="actions.updateFilter({e:event, currency:'cryptos'})"/>
          <div class="input-group-append">
            <span class="input-group-text">Prix &gt; </span>
          </div>
          <input id="filterSup" type="number" class="form-control" value="${filtersPrice}" min="0" onchange="actions.updatePriceFilter({e:event})"/>
        </div> <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-2">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:0})">Code</a>
              </th>
              <th class="align-middle text-center col-5">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:1})">Nom</a>
              </th>
              <th class="align-middle text-center col-2">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:2})">Prix</a>
              </th>
              <th class="align-middle text-center col-3">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:3})">Variation</a>
              </th>
            </thead>
            ${listCrypto}
          </table>
        </div>
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Cryptos préférées :
        ${cryptosPreferees}
      </div>
    </div>`;
  },

  paginationUI(model, state, currency) {

    const pagination = model.ui.currenciesCard.tabs[currency].pagination;

    const nbPages = state.ui.currenciesCard.tabs[currency].pagination.nbPages;
    const curPage = pagination.currentPage;
    const maxPages = pagination.maxPages;

    const rowsPerPage = pagination.rowsPerPage.map((v, i) => {
      const selected = pagination.rowsPerPageIndex == i ? 'selected="selected"' : '';
      return `<option ${selected} value="${i}">${v}</option>`;}).join('\n');

    let pageActive = '';
    let pageMax = Math.max(curPage - Math.floor(maxPages / 2) + 1, 1);
    const pageMin = Math.min(pageMax + maxPages - 1, nbPages);
    pageMax = Math.max(1, pageMin - maxPages + 1);
    
    for (let i = pageMax; i <= pageMin; i++) {
      const page = curPage == i ? 'active' : '';
      pageActive += `
      <li class="page-item ${page}">
        <a class="page-link" href="#currencies" onclick="actions.changePage({index:${i},currency:'${currency}'})">${i}</a>
      </li>`;}
      
    const i = Math.max(1, curPage - 1);
    const j = Math.min(curPage + 1, nbPages);
    const pageDeb = curPage == 1;
    const pageFin = curPage == nbPages;
    const debut = pageDeb ? 'disabled' : '';
    const fin = pageFin ? 'disabled' : '';

    return `
    <section id="pagination">
      <div class="row justify-content-center">
        <nav class="col-auto">
          <ul class="pagination">
            <li class="page-item ${debut}">
              <a onclick="actions.changePage({index:${i},currency:'${currency}'})" class="page-link" href="#currencies">&lt;</a>
            </li>
            ${pageActive}
            <li class="page-item ${fin}">
              <a onclick="actions.changePage({index:${j},currency:'${currency}'})" class="page-link" href="#currencies">&gt;</a>
            </li>
          </ul>
        </nav>
        <div class="col-auto">
          <div class="input-group mb-3">
            <select class="custom-select" id="selectTo" onchange="actions.changeRowsPerPage({e:event, currency:'${currency}'})">
              ${rowsPerPage}
            </select>
            <div class="input-group-append">
              <span class="input-group-text">par page</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  },

  currenciesFiatsUI(model,state) {

    const paginationHTML = this.paginationUI(model, state, 'fiats');

    const cFiltered = state.data.cryptos.filteredNum;
    const cList = state.data.cryptos.listNum;
    const fFiltered = state.data.fiats.filteredNum;
    const fList = state.data.fiats.listNum;

    const fFiltersText = model.ui.currenciesCard.tabs.fiats.filters.text;
    const active = model.config.targets.active;
    const sort = mergeUnique(model.config.targets.list, [active]).sort();
    const pagination = model.ui.currenciesCard.tabs.fiats.pagination;

    const page = pagination.currentPage - 1;
    const rowsPerPage = pagination.rowsPerPage[pagination.rowsPerPageIndex];
    const start = rowsPerPage * page;
    const end = start + rowsPerPage;
    const cryptoList = state.data.fiats.filtered.slice(start, end).map(v => {
      const favori = active == v.code ? 'bg-success text-light' : sort.includes(v.code) ? 'bg-warning' : '';
      return `
      <tr class="${favori}" onclick="actions.selectCurrency({type:'fiats',code:'${v.code}'})">
        <td class="text-center">${v.code}</td>
        <td><b>${v.name}</b></td>
        <td class="text-center">${v.symbol}</td>
      </tr>`;}).join('\n');
    
    const preferees = sort.map(v => {
      const crypto = active.includes(v) ? 'badge-success' : 'badge-warning';
      return `<span class="badge ${crypto}">${v}</span>`;}).join('\n');

    return `
    <div class="card border-secondary" id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies" onclick="actions.changeTab({tab:'currenciesCryptos'})">Cryptos <span class="badge badge-secondary">${cFiltered} / ${cList}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#currencies">Monnaies cibles <span class="badge badge-light">${fFiltered} / ${fList}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${fFiltersText}" id="filterText" type="text" class="form-control" placeholder="code ou nom..." onchange="actions.updateFilter({e:event, currency:'fiats'})" />
        </div> <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-3">
                <a href="#currencies" onclick="actions.sort({currency:'fiats', column:0})">Code</a>
              </th>
              <th class="align-middle text-center col-6">
                <a href="#currencies" onclick="actions.sort({currency:'fiats', column:1})">Nom</a>
              </th>
              <th class="align-middle text-center col-3">
                <a href="#currencies" onclick="actions.sort({currency:'fiats', column:2})">Symbole</a>
              </th>
            </thead>
            ${cryptoList}
          </table>
        </div>
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Monnaies préférées :
        ${preferees}
      </div>
    </div>`;
  },

  preferencesUI(model, state) {

    const authors        = model.config.authors;
    const debug          = model.config.debug;
    const activeTarget   = model.config.targets.active;
    const updateDisabled = model.config.dataMode == 'offline' ? 'disabled="disabled"' : '';
    const target         = model.config.targets.active;
    const targetsList    = mergeUnique(model.config.targets.list,[target]).sort();
    const fiatsList      = state.data.fiats.list;

    const fiatOptionsHTML = targetsList.map( (v) => {
      const code = fiatsList[v].code;
      const name = fiatsList[v].name;
      const isOffline = model.config.dataMode == 'offline';
      const selected = code == target ? 'selected="selected"' : '';
      const disabled = isOffline && code != target ? 'disabled="disabled"' : '';
      return `
      <option value="${code}" ${selected} ${disabled}>${code} - ${name}</option>
      `;}).join('\n');

    const dataModeOptionsHTML = [['online', 'En ligne'], ['offline', 'Hors ligne']].map( v => {
      const selected = v[0] == model.config.dataMode ? 'selected="selected"' : '';
      return `<option value="${v[0]}" ${selected}>${v[1]}</option>`;
    }).join('\n');

    return `
    <div class="card border-secondary">
      <div class="card-header d-flex justify-content-between">
        <h5 class=""> Préférences </h5>
        <h5 class="text-secondary"><abbr title="par Abakar Tahir Cherif">Crédits</abbr></h5>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text" for="inputGroupSelect01">Monnaie
              cible</label>
          </div>
          <select class="custom-select" id="inputGroupSelect01"
          onchange="actions.changeTarget({e:event, debug:'${debug}'})">
            ${fiatOptionsHTML}
          </select>
        </div>
        <p></p>
        <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text">Données</label>
          </div>
          <select class="custom-select" onchange="actions.changeDataMode({e:event, target:'${activeTarget}', debug:'${debug}'})">
            ${dataModeOptionsHTML}
          </select>
          <div class="input-group-append">
            <button class="btn btn-primary" ${updateDisabled}
            onclick="actions.updateOnlineCurrenciesData({target: '${activeTarget}', debug:'${debug}'})">
            Actualiser</button>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  walletUI(model, state) {
    const tabName = model.ui.walletCard.selectedTab;
    switch (tabName) {
      case 'portfolio': return this.walletPortfolioUI(model, state); break;
      case 'ajouter'  : return this.walletAjouterUI  (model, state); break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  walletPortfolioUI(model, state) {
    const coins = model.config.coins;
    const cryptoList = state.data.cryptos.list;
    const active = model.config.targets.active;
    
    const nbPortfolio = state.data.coins.posValueCodes.length;
    const nbAjouter = state.data.coins.nullValueCodes.length;

    let a = false;
    let b = false;
    let total = 0;

    const crypto = state.data.coins.posValueCodes.map(v => {
      const list = cryptoList[v];
      const coin = coins[v];
      const nonVide = coin.quantityNew !== '';
      const quantity = nonVide ? coin.quantityNew : coin.quantity;
      const incorrect = isNaN(parseFloat(quantity)) || parseFloat(quantity) < 0;
      if (nonVide) a = true;
      const text = incorrect ? 'text-danger' : nonVide ? 'text-primary' : '';
      let message = '';
      let cryptoTotal = 0;
      if (incorrect) {
        message = 'text-danger';
        cryptoTotal = '???';
        b = true;
      } else {
        message = nonVide ? 'text-primary' : '';
        cryptoTotal = (parseFloat(quantity) * list.price).toFixed(2);
        total += parseFloat(cryptoTotal);
      }
      return `
      <tr>
        <td class="text-center">
          <span class="badge badge-pill badge-light">
            <img src="${list.icon_url}" /> ${list.code} 
          </span>
        </td>
        <td><b>${list.name}</b></td>
        <td class="text-right">${list.price.toFixed(2)}</td>
        <td class="text-right">
          <input type="text" class="form-control ${text}" value="${quantity}" onchange="actions.changeCoinQuantity({e:event, code:'${list.code}'})" />
        </td>
        <td class="text-right"><span class="${message}"><b>${cryptoTotal}</b></span></td>
      </tr>`;}).join('\n');

    const primary = a && !b ? 'btn-primary' : 'disabled';
    const secondary = a && !b || b ? 'btn-secondary' : 'disabled';
    const badge = a ? 'badge-primary' : 'badge-success';

    return `
    <div class="card border-secondary text-center" id="wallet">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#wallet">Portfolio <span
                class="badge badge-light">${nbPortfolio}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#wallet"
              onclick="actions.changeTab({tab:'walletAjouter'})"> Ajouter <span
                class="badge badge-secondary">${nbAjouter}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body text-center">
        <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1"> Code </th>
              <th class="align-middle text-center col-4"> Nom </th>
              <th class="align-middle text-center col-2"> Prix </th>
              <th class="align-middle text-center col-3"> Qté </th>
              <th class="align-middle text-center col-2"> Total </th>
            </thead>
            ${crypto}
          </table>
        </div>
        <div class="input-group d-flex justify-content-end">
          <div class="input-group-prepend">
            <button class="btn ${primary}" onclick="actions.confirmCoinsEdition({which:'posQuantities'})">Confirmer</button>
          </div>
          <div class="input-group-append">
            <button class="btn ${secondary}" onclick="actions.cancelCoinsEdition({which:'posQuantities'})">Annuler</button>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <h3><span class="badge ${badge}" >Total : ${total.toFixed(2)} ${active}</span></h3>
      </div>
    </div>
    `;
  },

  walletAjouterUI(model, state) {
    const coins = model.config.coins;
    const cryptosList = state.data.cryptos.list;
    const active = model.config.targets.active;

    const nbPortfolio = state.data.coins.posValueCodes.length;
    const nbAjouter = state.data.coins.nullValueCodes.length;

    let a = false;
    let b = false;
    let total = 0;

    const crypto = state.data.coins.nullValueCodes.map(v => {
      const list = cryptosList[v];
      const coin = coins[v];
      const nonVide = coin.quantityNew !== '';
      const quantity = nonVide ? coin.quantityNew : coin.quantity;
      const incorrect = isNaN(parseFloat(quantity)) || parseFloat(quantity) < 0;
      if (nonVide) a = true;
      const text = incorrect ? 'text-danger' : nonVide ? 'text-primary' : '';
      let message = '';
      let cryptoTotal = 0;
      if (incorrect) {
        message = 'text-danger';
        cryptoTotal = '???';
        b = true;
      } else {
        message = nonVide ? 'text-primary' : '';
        cryptoTotal = (parseFloat(quantity) * list.price).toFixed(0x2);
        total += parseFloat(cryptoTotal);
      }
      return `
      <tr>
        <td class="text-center">
          <span class="badge badge-pill badge-light">
            <img src="${list.icon_url}" />
            ${list.code} </span></td>
        <td><b>${list.name}</b></td>
        <td class="text-right">${list.price.toFixed(2)}</td>
        <td class="text-right">
          <input type="text" class="form-control ${text}" value="${quantity}" onchange="actions.changeCoinQuantity({e:event, code:'${list.code}'})" />
        </td>
        <td class="text-right"><span class="${message}"><b>${cryptoTotal}</b></span></td>
      </tr>`;
      }).join('\n');
    
    const badge = a ? 'badge-primary' : 'badge-success';
    const primary = a && !b ? 'btn-primary' : 'disabled';
    const secondary = a && !b || b ? 'btn-secondary' : 'disabled';

    return `
    <div class="card border-secondary text-center" id="wallet">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#wallet"
              onclick="actions.changeTab({tab:'walletPortfolio'})"> Portfolio <span
                class="badge badge-secondary">${nbPortfolio}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#wallet">Ajouter <span
                class="badge badge-light">${nbAjouter}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1"> Code </th>
              <th class="align-middle text-center col-4"> Nom </th>
              <th class="align-middle text-center col-2"> Prix </th>
              <th class="align-middle text-center col-3"> Qté </th>
              <th class="align-middle text-center col-2"> Total </th>
            </thead>
            ${crypto}
          </table>
        </div>
        <div class="input-group d-flex justify-content-end">
          <div class="input-group-prepend">
            <button class="btn ${primary}" onclick="actions.confirmCoinsEdition({which:'zeroQuantities'})">Confirmer</button>
          </div>
          <div class="input-group-append">
            <button class="btn ${secondary}" onclick="actions.cancelCoinsEdition({which:'zeroQuantities'})">Annuler</button>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <h3><span class="badge ${badge}">Total : ${total.toFixed(2)} ${active}</span></h3>
      </div>
    </div>
    `;
  },
};
