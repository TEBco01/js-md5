var md5 = require('./md5');

function arrayToHexString(input) {
  output = "";
  for (let i = 0; i < input.length; i++) {
    output += ("00" + input[i].toString(16)).slice(-2);
  }
  return output;
}

const test_inputs = ["","a","abc","message digest","abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789","12345678901234567890123456789012345678901234567890123456789012345678901234567890"];
const expected_digests = ["d41d8cd98f00b204e9800998ecf8427e","0cc175b9c0f1b6a831c399e269772661","900150983cd24fb0d6963f7d28e17f72","f96b697d7cb7938d525a2f31aaf161d0","c3fcd3d76192e4007dfb496cca67e13b","d174ab98d277d9f5a5611c2c9f419d9f", "57edf4a22be3c955ac49da2e2107b67a"];

function simple_tests() {
  test_failed = false;

  for(let i = 0; i < test_inputs.length; i++) {
    digest_i = md5.str(test_inputs[i]);
    if(arrayToHexString(digest_i) != expected_digests[i]) {
      test_failed = true;
      console.log("Test failed! Expected:");
      console.log(expected_digests[i]);
      console.log("Got:");
      console.log(arrayToHexString(digest_i));
    }
  }

  if(!test_failed) {
    console.log("All tests passed!");
  }

  return !test_failed;
}

function test_long_input() {
    expected_digest = "9ce33d7cb91cbe57bb1d0658878d32d4";

    let utf8Encode = new TextEncoder();
    block_string = 'a'.repeat(64);
    block_buf = utf8Encode.encode(block_string);

    ctx = md5.init();
    for(let i = 0; i < 20017456; i++) {
      ctx = md5.update(block_buf, ctx);
    }
    digest = md5.final(ctx);
    if(arrayToHexString(digest) == expected_digest) {
      console.log("Long input test passed!");
      return true;
    } else {
      console.log("Long input test failed. Expected:");
      console.log(expected_digest);
      console.log("Got:");
      console.log(arrayToHexString(digest));
      return false;
    }
}

//digest = md5.str("a");
//console.log(arrayToHexString(digest));

simple_tests();
test_long_input();
