"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = coerce;
function coerce(fn, val) {
  if (val !== undefined) {
    this.set(fn(val));
  }
}