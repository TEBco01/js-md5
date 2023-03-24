var md5 = require('./md5');

function arrayToHexString(input) {
  output = "";
  for (let i = 0; i < input.length; i++) {
    output += ("00" + input[i].toString(16)).slice(-2);
  }
  return output;
}

function simple_tests() {
  test_inputs = ["","a","abc","message digest","abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789","12345678901234567890123456789012345678901234567890123456789012345678901234567890"];
  expected_digests = ["d41d8cd98f00b204e9800998ecf8427e","0cc175b9c0f1b6a831c399e269772661","900150983cd24fb0d6963f7d28e17f72","f96b697d7cb7938d525a2f31aaf161d0","c3fcd3d76192e4007dfb496cca67e13b","d174ab98d277d9f5a5611c2c9f419d9f", "57edf4a22be3c955ac49da2e2107b67a"];

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
}

//digest = md5.str("");
//console.log(arrayToHexString(digest));

simple_tests();
