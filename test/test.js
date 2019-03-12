// test.js - 测试
'use strict';
const assert=require('assert');
const leftpad=require('../src/left-pad');

describe('测试left-pad', ()=>{
  it('4位填充', ()=>{
    assert.equal(leftpad('a', 4, 'b'), 'bbba');
  });

  it('10位填充',()=>{
    assert.equal(leftpad('a', 10, 'b'), 'bbbbbbbbba');
  })
});