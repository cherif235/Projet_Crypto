"use strict";

// Demande le lancement de l'exécution quand toute la page Web sera chargée
window.addEventListener('load', go);

// Différentes configurations initiales
const configs = {initialModel0, initialModel1, initialModel2};
let   configsSelected = 'initialModel0';

// Point d'entrée de l'application
function go() {
  console.log('GO !');

  sandbox();

  actions.initAndGo(configs[configsSelected]);
}


// Pour tester des trucs...
function sandbox() {
  console.log('------------------------------------ DÉBUT SANDBOX ---');
  console.log('--- Manipulation d\'objets litteraux et de tableaux ---');
  const obj1 = {
    CC: {str:'cc', num: -1},
    AA: {str:'aa', num:  0},
  };
  const obj2 = {
    BB: {str:'bb', num:  1},
  };
  const obj3 = {...obj1, ...obj2};
  console.log('fusion de obj1 et obj2      :', obj3);

  Object.assign(obj1, obj2);
  console.log('obj1 après fusion avec obj2 :', obj1);

  const key = 'CC';
  console.log(obj1.CC.str + ' === ' + obj1[key].str + ' === ' + obj1['CC']['str']);
  const keys = ['AA', 'BB'];
  const strs = keys.map( v => obj1[v].str ).join(', ');
  console.log(strs);

  const array1 = Object.keys(obj1);
  const array2 = Object.values(obj1);
  const array3 = Object.entries(obj1);
  console.log('array1, keys    :', array1);
  console.log('array2, values  :', array2);
  console.log('array3, entries :', array3);

  const array5 = Object.keys(obj2);
  const array6 = [...array5, ...array1];
  const array7 = mergeUnique(array5, array1);
  console.log('array6, fusion de tableaux :', array6);
  console.log('array7, fusion unique      :', array7);

  const array11 = array1.sort().slice(1,3).map( v => obj1[v].str );
  const array22 = array2.map( v => {return v.num != 0 ? v.str : v.num} );
  const array33 = array3.filter( v => v[1].num >= 0 ).map( v => v[1].str ).sort();
  console.log('array11 :', array11);
  console.log('array22 :', array22);
  console.log('array33 :', array33);

  console.log('Tri numérique croissant   : ', [...array2].sort( (a,b) =>    (a.num - b.num) ) );
  console.log('Tri numérique décroissant : ', [...array2].sort( (a,b) => -1*(a.num - b.num) ) );
  console.log('Tri alpha-numérique croissant   : ', [...array2].sort( (a,b) =>    a.str.localeCompare(b.str) ) );
  console.log('Tri alpha-numérique décroissant : ', [...array2].sort( (a,b) => -1*a.str.localeCompare(b.str) ) );

  console.log('obj1 avant delete :', obj1);
  delete obj1.CC;
  console.log('obj1 après delete :', obj1);
  const D = {str:'dd', num: -3};
  obj1['DD'] = D;
  console.log('obj1 après ajout  :', obj1);

  const n1 = 10;
  const n2 = n1/3;
  const n3 = n2.toFixed(2);
  const n4 = Math.floor(n2);
  const n5 = Math.ceil(n2);
  console.log('Formatage de nombres : '+ n5 +' > '+ n2 +' > '+n3+' > '+n4 );

  const icons      = ['↘', '∼', '↗'];
  const changes    = [ 3, 0, 0, -4, -3, 2 ];
  const variations = changes.map( v => icons[ Math.sign(v) + 1 ] );
  console.log('changements : ' + changes.join(' ') );
  console.log('variations  : ' + variations.join(' ') );

  console.log('------------------------------------ FIN SANDBOX ---');
}
