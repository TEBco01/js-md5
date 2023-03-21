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
    'state' : [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476],
    'count' : 0 // In bytes
    //'buffer'
  };

  return ctx;
}

function get_padding(len_bytes) {
  mod_len_bytes = len_bytes % 64;
  num_bytes = 64;
  if (mod_len_bytes != 56) {
    num_bytes = (56 - mod_len_bytes) % 64;
  }

  ret = new Uint8Array(num_bytes);
  ret[0] = 0x80;
  for (let i = 1; i < num_bytes; i++) {
    ret[i] = 0;
  }

  return ret;
}

function md5_update(B, ctx) {
  ctx.count += B.length;
  return ctx;
}

function md5_final(ctx) {
  padding = get_padding(ctx.count);
  return ctx.state[0];
}
