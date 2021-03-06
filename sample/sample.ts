///<reference path="../node.d.ts" />
///<reference path="../Promise.d.ts" />

import Promise = require('../Promise');

import fs = require('fs');

var readFileAsync = function (path: string) {
	return Promise.nfcall<string>(fs, "readFile", path, 'utf8');
}

Promise.spawn(() => {
	try { var content = yield(readFileAsync('sample.ts')); console.log(content.length); } catch (e) { console.error(e); }
	try { var content = yield(readFileAsync('sample2.ts')); console.log(content.length); } catch (e) { console.error(e); }
}).catch((error) => {
	console.error(error);
});

// This should not cause a stack overflow!
var start = Date.now();
var resolvePromise;
var promise = new Promise<number>((resolve, reject) => { resolvePromise = resolve });
for (var n = 0; n < 100000; n++) promise = promise.then((value) => value + 1);
resolvePromise(0);
promise.then((value) => {
	console.log('completed! : ' + value + ' : ' + (Date.now() - start));
});

/*
var testAsync = Promise.async((a: String, b: String) => {
	console.log('[1]: ' + a);
	yield(Promise.waitAsync(1000));
	console.log('[2]: ' + b);
	return a + ':' + b;
});

testAsync("A", 'B').then(result => {
	console.log('result: ' + result);
});

Promise.spawn(() => {
	console.log('[1]: ' + 'a');
	yield(Promise.waitAsync(1000));
	console.log('[2]: ' + 'b');
});

console.log('start');
Promise.waitAsync(1000).then(() => {
	console.log('[1]');
	return Promise.waitAsync(2000).then(() => {
		throw(new Error("ERROR!"));
		console.log('[2]');
	});
}).then(() => {
	console.log('[3]');
	return 'hello';
}).then((value) => {
	console.log('[' + value.toUpperCase() + ']');
}).catch((error) => {
	console.error('error: ' + error);
});

Promise.all([
	Promise.waitAsync(1000),
	Promise.waitAsync(2000),
	Promise.waitAsync(1000),
	Promise.waitAsync(1000),
	Promise.waitAsync(1000)
]).then(() => {
	console.log('resolved all!');
});
*/
