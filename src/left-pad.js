'use strict';
/**
 * 左填充
 * @param {string} str 原字符串
 * @param {number} length 填充到指定长度
 * @param {string} pad 用什么填充，默认是一个半角空格
 * @return {string} 经过填充的字符串。不满足要求时按原样返回str。
 */
function leftpad(str, length, pad = ' ') {
  if (typeof str === 'string' && typeof length === 'number' && length > 0 && str.length < length) {
    str = new Array(length - str.length + 1).join(pad) + str;
    
    // console.log('填充!', str);
  }
  return str;
}

module.exports=leftpad;