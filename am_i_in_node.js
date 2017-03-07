var v = typeof global !== "undefined" && {}.toString.call(global) == '[object global]' ? 1 : 0;
var w = typeof process !== 'undefined' && process.release.name === 'node' ? 1 : 0;
var x = typeof window === 'undefined' ? 1 : 0;
var y = typeof require === 'undefined' ? 0 : 1
var z = typeof module !== 'undefined' && this.module !== module ? 1 : 0;

console.log(v, w, x, y, z);