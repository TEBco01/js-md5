module.exports = {
  buf: function (B) {
    ctx = md5_init();
    ctx = md5_update(B, ctx);
    return md5_final(ctx);
  },
  str: function (str) {
    let utf8Encode = new TextEncoder();
    ctx = md5_init();
    ctx = md5_update(utf8Encode.encode(str), ctx);
    return md5_final(ctx);
  }
}

function md5_init() {
  var ctx = {
    'state' : [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
    //'count'
    //'buffer'
  };

  return ctx;
}

function md5_update(B, ctx) {
  return ctx;
}

function md5_final(ctx) {
  return ctx.state[0];
}
