var Benchmark = require('benchmark');

var md5 = require('./md5');

var crypto_js_md5 = require("crypto-js/md5");
//var md5_meyers = require('./md5-myers'); // source can be aquired at http://www.myersdaily.org/joseph/javascript/md5-text.html
const crypto = require('crypto');

const test_inputs = ["","a","abc","message digest","abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789","12345678901234567890123456789012345678901234567890123456789012345678901234567890"];
const expected_digests = ["d41d8cd98f00b204e9800998ecf8427e","0cc175b9c0f1b6a831c399e269772661","900150983cd24fb0d6963f7d28e17f72","f96b697d7cb7938d525a2f31aaf161d0","c3fcd3d76192e4007dfb496cca67e13b","d174ab98d277d9f5a5611c2c9f419d9f", "57edf4a22be3c955ac49da2e2107b67a"];

const suite = new Benchmark.Suite();

function test_str_digest(hash) {
  for(var i = 0; i < 50000; i++) {
    for(var j = 0; j < test_inputs.length; j++) {
      hash(test_inputs[j]);
    }
  }
}

function test_buf_digest(hash) {
  let utf8Encode = new TextEncoder();
  let test_inputs_buf = []
  for(var i = 0; i < test_inputs.length; i++) {
    test_inputs_buf[i] = utf8Encode.encode(test_inputs[i]);
  }

  for(var i = 0; i < 50000; i++) {
    for(var j = 0; j < test_inputs_buf.length; j++) {
      hash(test_inputs_buf[j]);
    }
  }
}

function node_crypto(str)  {
  return crypto.createHash('md5').update(str).digest("hex");
}

suite
//.add('md5-js-str', () => test_str_digest(md5.str))
.add('md5-js-buf', () => test_buf_digest(md5.buf))

//.add('crypto-js-str', () => test_str_digest(MD5))
.add('crypto-js-buf', () => test_buf_digest(crypto_js_md5))

//.add('meyers-str', () => test_str_digest(md5_meyers.str))

//.add('node-crypto-str', () => test_str_digest(node_crypto))
.add('node-crypto-buf', () => test_buf_digest(node_crypto))

.on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': false })
