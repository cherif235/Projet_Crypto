
// Renvoie la fusion de deux tableaux, dépourvue de doublons
function mergeUnique(a1, a2) {
  return [...new Set([...a1, ...a2])];
}
