/*辅助模块--排序*/

function fSortMapByKey(pmap) {
  let mapNew = {};
  let arrSortedKey = Object.keys(pmap).sort();
  for (let ii = 0; ii < arrSortedKey.length; ++ii) {
    mapNew[arrSortedKey[ii]] = pmap[arrSortedKey[ii]];
  }
  return mapNew;
}

module.exports.fSortMapByKey = fSortMapByKey;