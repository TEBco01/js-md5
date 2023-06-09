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
  },
  init: function () {
    return md5_init();
  },
  update: function (B, context) {
    return md5_update(B, context);
  },
  final: function (context) {
    return md5_final(context);
  }
}

function md5_init() {
  var ctx = {
    'state' : new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]),
    'count' : new Uint32Array([0,0]),
    'buffer' : new Uint8Array(64)
  };

  return ctx;
}

function F(x, y, z) {return (((x) & (y)) | ((~x) & (z)));}
function G(x, y, z) {return (((x) & (z)) | ((y) & (~z)));}
function H(x, y, z) {return ((x) ^ (y) ^ (z));}
function I(x, y, z) {return ((y) ^ ((x) | (~z)));}

function rotate_left(value, n) {
  return ((value << n) | (value >>> (32-n)));
}

function md5_transform(ctx, buf) {
  a = ctx.state[0];
  b = ctx.state[1];
  c = ctx.state[2];
  d = ctx.state[3];

  X_0  = buf[0 ] | (buf[1 ] << 8) | (buf[2 ] << 16) | (buf[3 ] << 24);
  X_1  = buf[4 ] | (buf[5 ] << 8) | (buf[6 ] << 16) | (buf[7 ] << 24);
  X_2  = buf[8 ] | (buf[9 ] << 8) | (buf[10] << 16) | (buf[11] << 24);
  X_3  = buf[12] | (buf[13] << 8) | (buf[14] << 16) | (buf[15] << 24);
  X_4  = buf[16] | (buf[17] << 8) | (buf[18] << 16) | (buf[19] << 24);
  X_5  = buf[20] | (buf[21] << 8) | (buf[22] << 16) | (buf[23] << 24);
  X_6  = buf[24] | (buf[25] << 8) | (buf[26] << 16) | (buf[27] << 24);
  X_7  = buf[28] | (buf[29] << 8) | (buf[30] << 16) | (buf[31] << 24);
  X_8  = buf[32] | (buf[33] << 8) | (buf[34] << 16) | (buf[35] << 24);
  X_9  = buf[36] | (buf[37] << 8) | (buf[38] << 16) | (buf[39] << 24);
  X_10 = buf[40] | (buf[41] << 8) | (buf[42] << 16) | (buf[43] << 24);
  X_11 = buf[44] | (buf[45] << 8) | (buf[46] << 16) | (buf[47] << 24);
  X_12 = buf[48] | (buf[49] << 8) | (buf[50] << 16) | (buf[51] << 24);
  X_13 = buf[52] | (buf[53] << 8) | (buf[54] << 16) | (buf[55] << 24);
  X_14 = buf[56] | (buf[57] << 8) | (buf[58] << 16) | (buf[59] << 24);
  X_15 = buf[60] | (buf[61] << 8) | (buf[62] << 16) | (buf[63] << 24);

  a = (b + (rotate_left((a + F(b,c,d) + X_0  + 0xd76aa478), 7 ))) | 0;
  d = (a + (rotate_left((d + F(a,b,c) + X_1  + 0xe8c7b756), 12))) | 0;
  c = (d + (rotate_left((c + F(d,a,b) + X_2  + 0x242070db), 17))) | 0;
  b = (c + (rotate_left((b + F(c,d,a) + X_3  + 0xc1bdceee), 22))) | 0;
  a = (b + (rotate_left((a + F(b,c,d) + X_4  + 0xf57c0faf), 7 ))) | 0;
  d = (a + (rotate_left((d + F(a,b,c) + X_5  + 0x4787c62a), 12))) | 0;
  c = (d + (rotate_left((c + F(d,a,b) + X_6  + 0xa8304613), 17))) | 0;
  b = (c + (rotate_left((b + F(c,d,a) + X_7  + 0xfd469501), 22))) | 0;
  a = (b + (rotate_left((a + F(b,c,d) + X_8  + 0x698098d8), 7 ))) | 0;
  d = (a + (rotate_left((d + F(a,b,c) + X_9  + 0x8b44f7af), 12))) | 0;
  c = (d + (rotate_left((c + F(d,a,b) + X_10 + 0xffff5bb1), 17))) | 0;
  b = (c + (rotate_left((b + F(c,d,a) + X_11 + 0x895cd7be), 22))) | 0;
  a = (b + (rotate_left((a + F(b,c,d) + X_12 + 0x6b901122), 7 ))) | 0;
  d = (a + (rotate_left((d + F(a,b,c) + X_13 + 0xfd987193), 12))) | 0;
  c = (d + (rotate_left((c + F(d,a,b) + X_14 + 0xa679438e), 17))) | 0;
  b = (c + (rotate_left((b + F(c,d,a) + X_15 + 0x49b40821), 22))) | 0;

  a = (b + (rotate_left((a + G(b,c,d) + X_1  + 0xf61e2562), 5 ))) | 0;
  d = (a + (rotate_left((d + G(a,b,c) + X_6  + 0xc040b340), 9 ))) | 0;
  c = (d + (rotate_left((c + G(d,a,b) + X_11 + 0x265e5a51), 14))) | 0;
  b = (c + (rotate_left((b + G(c,d,a) + X_0  + 0xe9b6c7aa), 20))) | 0;
  a = (b + (rotate_left((a + G(b,c,d) + X_5  + 0xd62f105d), 5 ))) | 0;
  d = (a + (rotate_left((d + G(a,b,c) + X_10 +  0x2441453), 9 ))) | 0;
  c = (d + (rotate_left((c + G(d,a,b) + X_15 + 0xd8a1e681), 14))) | 0;
  b = (c + (rotate_left((b + G(c,d,a) + X_4  + 0xe7d3fbc8), 20))) | 0;
  a = (b + (rotate_left((a + G(b,c,d) + X_9  + 0x21e1cde6), 5 ))) | 0;
  d = (a + (rotate_left((d + G(a,b,c) + X_14 + 0xc33707d6), 9 ))) | 0;
  c = (d + (rotate_left((c + G(d,a,b) + X_3  + 0xf4d50d87), 14))) | 0;
  b = (c + (rotate_left((b + G(c,d,a) + X_8  + 0x455a14ed), 20))) | 0;
  a = (b + (rotate_left((a + G(b,c,d) + X_13 + 0xa9e3e905), 5 ))) | 0;
  d = (a + (rotate_left((d + G(a,b,c) + X_2  + 0xfcefa3f8), 9 ))) | 0;
  c = (d + (rotate_left((c + G(d,a,b) + X_7  + 0x676f02d9), 14))) | 0;
  b = (c + (rotate_left((b + G(c,d,a) + X_12 + 0x8d2a4c8a), 20))) | 0;

  a = (b + (rotate_left((a + H(b,c,d) + X_5  + 0xfffa3942), 4 ))) | 0;
  d = (a + (rotate_left((d + H(a,b,c) + X_8  + 0x8771f681), 11))) | 0;
  c = (d + (rotate_left((c + H(d,a,b) + X_11 + 0x6d9d6122), 16))) | 0;
  b = (c + (rotate_left((b + H(c,d,a) + X_14 + 0xfde5380c), 23))) | 0;
  a = (b + (rotate_left((a + H(b,c,d) + X_1  + 0xa4beea44), 4 ))) | 0;
  d = (a + (rotate_left((d + H(a,b,c) + X_4  + 0x4bdecfa9), 11))) | 0;
  c = (d + (rotate_left((c + H(d,a,b) + X_7  + 0xf6bb4b60), 16))) | 0;
  b = (c + (rotate_left((b + H(c,d,a) + X_10 + 0xbebfbc70), 23))) | 0;
  a = (b + (rotate_left((a + H(b,c,d) + X_13 + 0x289b7ec6), 4 ))) | 0;
  d = (a + (rotate_left((d + H(a,b,c) + X_0  + 0xeaa127fa), 11))) | 0;
  c = (d + (rotate_left((c + H(d,a,b) + X_3  + 0xd4ef3085), 16))) | 0;
  b = (c + (rotate_left((b + H(c,d,a) + X_6  +  0x4881d05), 23))) | 0;
  a = (b + (rotate_left((a + H(b,c,d) + X_9  + 0xd9d4d039), 4 ))) | 0;
  d = (a + (rotate_left((d + H(a,b,c) + X_12 + 0xe6db99e5), 11))) | 0;
  c = (d + (rotate_left((c + H(d,a,b) + X_15 + 0x1fa27cf8), 16))) | 0;
  b = (c + (rotate_left((b + H(c,d,a) + X_2  + 0xc4ac5665), 23))) | 0;

  a = (b + (rotate_left((a + I(b,c,d) + X_0  + 0xf4292244), 6 ))) | 0;
  d = (a + (rotate_left((d + I(a,b,c) + X_7  + 0x432aff97), 10))) | 0;
  c = (d + (rotate_left((c + I(d,a,b) + X_14 + 0xab9423a7), 15))) | 0;
  b = (c + (rotate_left((b + I(c,d,a) + X_5  + 0xfc93a039), 21))) | 0;
  a = (b + (rotate_left((a + I(b,c,d) + X_12 + 0x655b59c3), 6 ))) | 0;
  d = (a + (rotate_left((d + I(a,b,c) + X_3  + 0x8f0ccc92), 10))) | 0;
  c = (d + (rotate_left((c + I(d,a,b) + X_10 + 0xffeff47d), 15))) | 0;
  b = (c + (rotate_left((b + I(c,d,a) + X_1  + 0x85845dd1), 21))) | 0;
  a = (b + (rotate_left((a + I(b,c,d) + X_8  + 0x6fa87e4f), 6 ))) | 0;
  d = (a + (rotate_left((d + I(a,b,c) + X_15 + 0xfe2ce6e0), 10))) | 0;
  c = (d + (rotate_left((c + I(d,a,b) + X_6  + 0xa3014314), 15))) | 0;
  b = (c + (rotate_left((b + I(c,d,a) + X_13 + 0x4e0811a1), 21))) | 0;
  a = (b + (rotate_left((a + I(b,c,d) + X_4  + 0xf7537e82), 6 ))) | 0;
  d = (a + (rotate_left((d + I(a,b,c) + X_11 + 0xbd3af235), 10))) | 0;
  c = (d + (rotate_left((c + I(d,a,b) + X_2  + 0x2ad7d2bb), 15))) | 0;
  b = (c + (rotate_left((b + I(c,d,a) + X_9  + 0xeb86d391), 21))) | 0;

  ctx.state[0] += a;
  ctx.state[1] += b;
  ctx.state[2] += c;
  ctx.state[3] += d;

  ctx.state[0] = ctx.state[0] | 0;
  ctx.state[1] = ctx.state[1] | 0;
  ctx.state[2] = ctx.state[2] | 0;
  ctx.state[3] = ctx.state[3] | 0;
}

function md5_update(buf, ctx) {
  index = (ctx.count[0] >> 3) & 0x3F;

  ctx.count[0] += buf.length << 3;
  ctx.count[0] &= 0xFFFFFFFF;
  if(ctx.count[0] < (buf.length << 3)) {
    ctx.count[1]++;
  }
  ctx.count[1] += buf.length >>> 29;

  partLen = 64 - index;
  let i = 0;

  if (buf.length >= partLen) {
    ctx.buffer.set(buf.slice(0,partLen), index);
    md5_transform(ctx, ctx.buffer);

    index = 0;

    for (i = partLen; i + 63 < buf.length; i += 64) {
      md5_transform(ctx, buf.slice(i, i + 64));
    }
  } else {
    i = 0;
  }

  ctx.buffer.set(buf.slice(i), index);

  return ctx;
}

function get_padding(len_bits) {
  mod_len_bytes = (len_bits >>> 3) % 64;
  num_bytes = 64;
  if (mod_len_bytes != 56) {
    num_bytes = (64 + 56 - mod_len_bytes) % 64;
  }

  ret = new Uint8Array(num_bytes);
  ret[0] = 0x80;
  for (let i = 1; i < num_bytes; i++) {
    ret[i] = 0;
  }

  return ret;
}

function get_length_bits(len_in_bits) {
  return [len_in_bits[0] & 0xFF,
    (len_in_bits[0] >>> 8) & 0xFF,
    (len_in_bits[0] >>> 16) & 0xFF,
    (len_in_bits[0] >>> 24) & 0xFF,
    (len_in_bits[1] >>> 0) & 0xFF,
    (len_in_bits[1] >>> 8) & 0xFF,
    (len_in_bits[1] >>> 16) & 0xFF,
    (len_in_bits[1] >>> 24) & 0xFF];
}

function md5_final(ctx) {
  padding = get_padding(ctx.count[0]);
  length = get_length_bits(ctx.count);
  md5_update(padding, ctx);
  md5_update(length, ctx);

  return new Uint8Array([
    ctx.state[0] & 0xFF, (ctx.state[0] >> 8) & 0xFF, (ctx.state[0] >> 16) & 0xFF, (ctx.state[0] >> 24) & 0xFF,
    ctx.state[1] & 0xFF, (ctx.state[1] >> 8) & 0xFF, (ctx.state[1] >> 16) & 0xFF, (ctx.state[1] >> 24) & 0xFF,
    ctx.state[2] & 0xFF, (ctx.state[2] >> 8) & 0xFF, (ctx.state[2] >> 16) & 0xFF, (ctx.state[2] >> 24) & 0xFF,
    ctx.state[3] & 0xFF, (ctx.state[3] >> 8) & 0xFF, (ctx.state[3] >> 16) & 0xFF, (ctx.state[3] >> 24) & 0xFF]);
}
