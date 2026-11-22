const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js', 'utf8');

function run(inputs = {}) {
  const defaults = {customer:'Sample residential service call',hours:4,rate:95,materials:175,markup:20,fees:35,tax:0};
  const nodes = Object.fromEntries([...Object.keys(defaults),'project','laborTotal','materialTotal','feeTotal','taxTotal','grandTotal','reset','print'].map(id=>[id,{value:String(inputs[id] ?? defaults[id] ?? ''),textContent:'',listeners:{},addEventListener(event,handler){this.listeners[event]=handler;}}]));
  vm.runInNewContext(source,{document:{getElementById:id=>nodes[id]},Intl,Number,Object,window:{print(){}}});
  return nodes;
}
test('sample estimate totals $625',()=>{const n=run();assert.equal(n.grandTotal.textContent,'$625.00');assert.equal(n.laborTotal.textContent,'$380.00');assert.equal(n.materialTotal.textContent,'$210.00');});
test('material tax applies only to marked-up materials',()=>{const n=run({tax:10});assert.equal(n.taxTotal.textContent,'$21.00');assert.equal(n.grandTotal.textContent,'$646.00');});
test('negative numeric inputs are clamped to zero',()=>{const n=run({hours:-5,materials:-100,fees:-10});assert.equal(n.grandTotal.textContent,'$0.00');});
test('input recalculates immediately',()=>{const n=run();n.hours.value='5';n.hours.listeners.input();assert.equal(n.grandTotal.textContent,'$720.00');});
test('reset restores defaults',()=>{const n=run({hours:10});n.reset.listeners.click();assert.equal(n.grandTotal.textContent,'$625.00');});
