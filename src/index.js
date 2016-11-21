import merge from 'lodash.merge'

import Detect from './detect'
import * as defaultRule from './rule/index'

let extendRule = {}

/**
 * go through all rules
 * @param  {Detect} detect detect instance
 * @param  {Object} suit   rule suit
 * @param  {Object} obj    key:value to be proof
 * @return {Object}        key:value that has bee proofed
 */
function process(detect, suit, obj) {
  return Object.keys(suit).reduce(
    (ret, key) => {
      const rules = suit[key]
      const target = obj[key]
      return {
        ...ret,
        [key]: detect.detect(rules, target)
      }
    }, obj)
}

/**
 * proof given option
 * @param  {Object} obj  option to be proof
 * @param  {Object} suit rule suit
 * @return {Object}      option that has been proofed
 */
function proof(obj, suit) {
  const combine = { ...defaultRule, ...extendRule }
  const detect = Object.keys(combine).reduce(
    (ret, key) => ret.addRule(key, combine[key]),
    Detect
  )

  return process(detect, suit, obj)
}

proof.addRule = function (name, assert) {
  extendRule[name] = assert
  return proof
}

proof.peace = function (...args) {
  try {
    return proof.apply(null, args)
  } catch (e) {
    return {
      ...e,
      isError: true
    }
  }
}

proof.assert = function (target, rules) {
  const combine = { ...defaultRule, ...extendRule }
  const detect = Object.keys(combine).reduce(
    (ret, key) => ret.addRule(key, combine[key]),
    Detect
  )

  return detect.detect(rules, target)
}

proof.wrap = function (extend) {
  return (obj, suit) => proof(obj, merge(extend, suit))
}

export default proof
