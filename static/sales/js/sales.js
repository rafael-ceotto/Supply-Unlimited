async function fetchSales(q=''){
  const url = new URL('/sales/api/', location.origin);
  if(q) url.searchParams.set('q', q);
  const res = await fetch(url);
  if(!res.ok) throw new Error('Fetch failed');
  return res.json();
}

function render(results){
  if(!results.length) return '<p>No results</p>';
  let html = '<table><thead><tr><th>Product</th><th>Customer</th><th>Amount</th><th>Date</th></tr></thead><tbody>';
  for(const r of results){
    html += `<tr><td>${r.product}</td><td>${r.customer}</td><td>${r.amount}</td><td>${new Date(r.created).toLocaleString()}</td></tr>`;
  }
  html += '</tbody></table>';
  return html;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const resultsEl = document.getElementById('results');
  const qInput = document.getElementById('q');
  const btn = document.getElementById('search');

  async function load(q=''){
    resultsEl.innerHTML = 'Loading...';
    try{
      const data = await fetchSales(q);
      resultsEl.innerHTML = render(data.results);
    }catch(e){
      resultsEl.innerHTML = '<p>Error loading data</p>';
    }
  }

  btn.addEventListener('click', ()=> load(qInput.value));
  load();
});
