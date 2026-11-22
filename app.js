(function () {
  'use strict';
  const fields = ['customer','hours','rate','materials','markup','fees','tax'];
  const defaults = {customer:'Sample residential service call',hours:4,rate:95,materials:175,markup:20,fees:35,tax:0};
  const el = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  function number(id){ const n=Number(el(id).value);return Number.isFinite(n)?Math.max(0,n):0; }
  function calculate(){
    const labor=number('hours')*number('rate');
    const materials=number('materials')*(1+number('markup')/100);
    const fees=number('fees');
    const tax=materials*number('tax')/100;
    const total=labor+materials+fees+tax;
    el('project').textContent=el('customer').value.trim()||'Untitled estimate';
    for(const [id,value] of Object.entries({laborTotal:labor,materialTotal:materials,feeTotal:fees,taxTotal:tax,grandTotal:total}))el(id).textContent=money(value);
  }
  fields.forEach(id=>el(id).addEventListener('input',calculate));
  el('reset').addEventListener('click',()=>{for(const [id,value] of Object.entries(defaults))el(id).value=value;calculate();});
  el('print').addEventListener('click',()=>window.print());
  calculate();
})();
