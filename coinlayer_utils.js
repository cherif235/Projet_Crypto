
async function coinlayerRequest(params) {
  const debug = params.debug;

  if (debug) console.log("coinlayerRequest :", params);

  let options = {
    target  : params.target,
    // symbols : params.symbols.join(','),
    expand  : 1,
  }
  const list = await coinlayer.listRequest(debug);
  const live = await coinlayer.liveRequest(options, debug);
  return {list: list, live: live};
}
