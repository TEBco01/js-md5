# js-md5

A fast, pure javascript implementation of MD5. Faster than most standard pure-JS implementations on my machine.

## Benchmarks
Results of benchmarks on my machine. This implementation is labelled "md5-js".

### Included benchmark:

|Implementation|Benchmark Performance|
|:-------------|:--------------------|
|md5-js            |1.71 ops/sec     |
|Joseph Meyers's*  |1.51 ops/sec     |
|Node's crypto     |1.12 ops/sec     |
|crypto-js         |0.99 ops/sec     |

*Meyer's works natively on strings; the other implementations are run on buffers.

### Hash-wasm benchmark:

![browser-benchmark](https://user-images.githubusercontent.com/15075477/229320010-db33e9ce-32dc-4104-ba4f-867f0ff00d1c.png)

https://github.com/Daninet/hash-wasm-benchmark

Note that implementations with -wasm use WebAssembly and are not pure javascript.

## Why it is fast
### 1. Strategic number conversion
Javascript has one number type that stores numbers as 64 bit floats, but converts them to 32 bit integers for bitwise operations.
You can force it to do a conversion by doing a bitwise operation that won't affect the data, such as `& 0xFFFFFFFF` or `| 0`.
You can get quite a significant speedup if you do this just before assigning to a variable which will be used in multiple bitwise operations.

For example, look at this snippet from the transform function.
```
a = (b + (rotate_left((a + F(b,c,d) + X_0  + 0xd76aa478), 7 ))) | 0;
d = (a + (rotate_left((d + F(a,b,c) + X_1  + 0xe8c7b756), 12))) | 0;
c = (d + (rotate_left((c + F(d,a,b) + X_2  + 0x242070db), 17))) | 0;
b = (c + (rotate_left((b + F(c,d,a) + X_3  + 0xc1bdceee), 22))) | 0;
a = (b + (rotate_left((a + F(b,c,d) + X_4  + 0xf57c0faf), 7 ))) | 0;
```
Between the assigment to `a` on the first and last line, its value is used five times.
Without the `| 0` at the end of the line, this would mean five conversions from float representation to integer representation.
With it, there is only one conversion. This leads to a significant speedup (around 45-70% when it was added orginally).

Bear in mind there is an overhead for the `| 0` operation. Doing one after every addition is slower, for instance.
Thus they are best used in cases like this example, where one variable is going to be used in several 
bitwise operations later and the conversion operation is cheaper than the later conversions together.

### 2. Using many local variables instead of an array

One peculiar optimization which I can't fully explain but nonetheless sped up the implementation by 10-15% is using 
16 local variables instead of a typed array of length 16.

Before, `X` was computed as follows and used as `X[i]`.
```
X = new Uint32Array(16);

for (let i = j = 0; i < 64; i += 4) {
    X[j] = buf[i] | (buf[i+1] << 8) | (buf[i+2] << 16) | (buf[i+3] << 24);
    j += 1;
}
```
After, each `X[i]` became a variable assigned as follows (showing `i = 0` as an example).
```
X_0  = buf[0 ] | (buf[1 ] << 8) | (buf[2 ] << 16) | (buf[3 ] << 24);
```
Clearly there is some sort of overhead to using arrays over smallish collections of local variables.
Presumably there is some number of elements where using an array is faster, but I did not investigate what that limit might be.

### 3. Careful data handling
Data can only be processed as fast as it is fetched.
Early iterations of this implementation had several bottlenecks related to passing data to the transform function.

For an example, take part of the `md5_update` function. This part of the code combines new data with whatever old 
data there was not long enough to fill a 64 byte block for the transform function.
Before there was the following, which combines the two by concatenating the relevant slices into a new array.
```
buf_part = ctx.buffer.slice(0, index);
input_part = buf.slice(0,partLen);
md5_transform(ctx, [...buf_part, ...input_part]);
```
Latter iterations changed this to what follows, which uses the fast `set` method to fill the already existant buffer 
rather than creating a new one.
```
ctx.buffer.set(buf.slice(0,partLen), index);
md5_transform(ctx, ctx.buffer);
```


As another example, there is a sizable overhead to using strings as inputs instead of buffers (because strings are converted to buffers).
This led to discrepancies when benchmarking.
Joseph Meyer's implementation (linked in benchmarks file), for instance, is string-native and faster than this implementation on strings,
but slower than this implementation when it uses buffers (you can try this yourself in the benchmarks).

These sorts of data processing things are common sense, but important. The buffer change made the implementation ~25% faster and 
using buffers instead of strings makes it ~50% faster.
