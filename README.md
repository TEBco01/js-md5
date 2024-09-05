# js-md5

A fast, pure javascript implementation of MD5. Faster than most standard pure-JS implementations.

## Benchmarks
Results of benchmarks on one machine. One is the benchmark included as `benchmark-md5.js`. The other is an independent benchmark (accessible at the link below) with this implementation added. This implementation is labelled "md5-js" in both.

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

Note that implementations with -wasm use WebAssembly. Despite this, this implementation is faster than one of them, _md5-wasm 2.0.0_.

## Why it is fast
### 1. Working around javascript's number type
Due to how javascript works under the hood, many implementations are burdened by unnecessary work spent converting types.
Javascript has one number type that stores numbers as 64 bit floats, but converts them to 32 bit integers for bitwise operations.
In a situation where one number variable's value is used in bitwise operations many times, the conversion will take place each time it is referenced.
However, you can force it to do the conversion only once by doing a bitwise operation that won't affect the data, such as `& 0xFFFFFFFF` or `| 0`, just before assignment.
This results in quite a significant speedup.

For example, consider the variable `a` in this snippet from MD5's transform function.
```
a = (b + (rotate_left((a + F(b,c,d) + X_0  + 0xd76aa478), 7 ))) | 0;
d = (a + (rotate_left((d + F(a,b,c) + X_1  + 0xe8c7b756), 12))) | 0;
c = (d + (rotate_left((c + F(d,a,b) + X_2  + 0x242070db), 17))) | 0;
b = (c + (rotate_left((b + F(c,d,a) + X_3  + 0xc1bdceee), 22))) | 0;
a = (b + (rotate_left((a + F(b,c,d) + X_4  + 0xf57c0faf), 7 ))) | 0;
```
Between the assigment to `a` on the first and last line, its value is used five times.
Without the `| 0` at the end of the line, this would mean five conversions from float representation to integer representation.
With it, there is only one conversion done. This leads to a significant speedup (around 45-70% when it was added here).

Bear in mind there is an overhead for the `| 0` operation. Doing one after every addition is slower, for instance.
Thus they are best used in cases like this example, where one variable is going to be used in several 
bitwise operations later and the conversion operation is cheaper than the later conversions together.

### 2. Decomposing a frequently used array

One optimization which empirically sped up the implementation by 10-15% is using 
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

### 3. Efficient handling of input
An MD5 implementation has two bottlenecks.
One is the computation done to transform each block as the hash requires.
The other is to provide those blocks of data to be transformed.
Simply ensuring the latter is done in the quickest way possible is a simple but crucial part of a fast implementation.

For an example, take part of the `md5_update` function. This part of the code combines new data with any previous 
data that was not long enough to fill a 64 byte block for the transform function.
Early on, I used the following, which combines the two by concatenating the relevant slices into a new array.
```
buf_part = ctx.buffer.slice(0, index);
input_part = buf.slice(0,partLen);
md5_transform(ctx, [...buf_part, ...input_part]);
```
Later iterations changed this to what follows, which uses the fast `set` method to fill the already existant buffer 
rather than creating a new one.
```
ctx.buffer.set(buf.slice(0,partLen), index);
md5_transform(ctx, ctx.buffer);
```
This simple change made the implementation ~25% faster.

As another example, there is a sizable overhead to using strings as inputs instead of buffers (because strings are then converted to buffers).
This led to discrepancies when benchmarking.
Joseph Meyer's implementation (linked in benchmarks file), for instance, is string-native and faster than this implementation on strings,
but slower than this implementation when it uses buffers (you can try this yourself in the benchmarks).
Avoiding the conversion by providing input as buffers instead of strings makes the implementation ~50% faster.
