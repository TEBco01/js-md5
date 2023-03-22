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
    'count' : 0, // In bytes
    'buffer' : new Uint8Array(64)
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

function get_length_bytes(len_in_bytes) {
  return [len_in_bytes & 0xFF,
    (len_in_bytes >>> 8) & 0xFF,
    (len_in_bytes >>> 16) & 0xFF,
    (len_in_bytes >>> 24) & 0xFF,
    0,//(len_in_bytes >>> 32) & 0xFF,  // Only counting up to 32 bits for now; 64 TBI
    0,//(len_in_bytes >>> 40) & 0xFF,
    0,//(len_in_bytes >>> 48) & 0xFF,
    0];//(len_in_bytes >>> 56) & 0xFF];
}

function md5_transform(state, buf) {
  console.log(buf);
  return state;
}

function md5_update(buf, ctx) {
  index = ctx.count % 64;
  ctx.count += buf.length;
  partLen = 64 - index;
  let i = 0;

  if (buf.length >= partLen) {
    buf_part = ctx.buffer.slice(0, index);
    input_part = buf.slice(0,partLen);
    md5_transform(ctx.state, [...buf_part, ...input_part]);

    index = 0;

    for (i = partLen; i + 63 < buf.length; i += 64) {
      md5_transform(ctx.state, buf.slice(i, i + 64));
    }
  } else {
    i = 0;
  }

  ctx.buffer.set(buf.slice(i), index);

  return ctx;
}

function md5_final(ctx) {
  padding = get_padding(ctx.count);
  length = get_length_bytes(ctx.count);
  md5_update(padding, ctx);
  md5_update(length, ctx);
  return ctx.state[0];
}
