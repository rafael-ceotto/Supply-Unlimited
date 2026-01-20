async function fetchSales(q='', from='', to=''){
  const url = new URL('/sales/api/', location.origin);
  if(q) url.searchParams.set('q', q);
  if(from) url.searchParams.set('from', from);
  if(to) url.searchParams.set('to', to);
  const res = await fetch(url);
  if(!res.ok) throw new Error('Fetch failed');
  return res.json();
}

function formatCurrency(value){
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

function render(results){
  if(!results.length) return '<div style="text-align:center;color:#6b7280;padding:20px;">No sales found</div>';
  let html = '<table><thead><tr><th>Product</th><th>Customer</th><th>Description</th><th>Amount</th><th>Date</th></tr></thead><tbody>';
  for(const r of results){
    const date = new Date(r.created).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
    html += `<tr><td>${r.product}</td><td>${r.customer}</td><td>${r.description || '—'}</td><td><strong>${formatCurrency(parseFloat(r.amount))}</strong></td><td>${date}</td></tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function updateAnalytics(results){
  const totalSales = results.length;
  const totalRevenue = results.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const avgOrder = totalSales > 0 ? totalRevenue / totalSales : 0;

  document.getElementById('total-sales').textContent = totalSales;
  document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('avg-order').textContent = formatCurrency(avgOrder);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const resultsEl = document.getElementById('results');
  const qInput = document.getElementById('q');
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  const btn = document.getElementById('search');

  async function load(q='', from='', to=''){
    resultsEl.innerHTML = '<div style=\"text-align:center;color:#6b7280;padding:20px;\">Loading...</div>';
    try{
      const data = await fetchSales(q, from, to);
      updateAnalytics(data.results);
      resultsEl.innerHTML = render(data.results);
    }catch(e){
      resultsEl.innerHTML = '<div style=\"text-align:center;color:#dc2626;padding:20px;\">Error loading data: ' + e.message + '</div>';
    }
  }

  btn.addEventListener('click', ()=> load(qInput.value, fromInput.value, toInput.value));
  
  // Search on Enter key
  qInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') load(qInput.value, fromInput.value, toInput.value);
  });

  load();
});
