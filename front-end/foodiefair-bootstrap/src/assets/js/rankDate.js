const now = new Date();
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

const lastMonthStartFormatted = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-${String(lastMonth.getDate()).padStart(2, '0')}`;
const lastMonthEndFormatted = `${lastMonthEnd.getFullYear()}-${String(lastMonthEnd.getMonth() + 1).padStart(2, '0')}-${String(lastMonthEnd.getDate()).padStart(2, '0')}`;

document.getElementById('dateRange').innerHTML = `집계 기간 : <span class="text-dark">${lastMonthStartFormatted} ~ ${lastMonthEndFormatted}</span>`;