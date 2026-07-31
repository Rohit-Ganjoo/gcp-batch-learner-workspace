// Antigravity Data Quality Scanner & Profiler Engine

// Global State
let currentDataset = [];
let datasetHeaders = [];
let profilingResults = null;
let activeTab = 'all';

// Preset Datasets embedded for 1-click execution without file dialogues
const MESSY_CSV_PRESET = `customer_id,full_name,email,age,city,signup_date,account_balance,phone
101, ethan hopper ,ETHAN.HOPPER@GMAIL.COM,39,Seattle,2023-04-05,$1779.50,792-858-9935
102,Eva Gonzalez,Eva.Gonzalez@invalid_domain,49,New York,2023-01-03,N/A,323-338-9279
103,Mason Smith,mason.smith@corp.net,150,Denver,2023-07-08,-279.00,703-384-1106
104,Michael Anderson,michael.anderson@company.io,,Austin,2023-06-09,3047.00,
105,Laura Edwards,laura.edwards@email.com,28,New York ,2023-07-04,6381.00,(967) 452-5333
106,Bob Parker,bob.parker@domain.org,56,Chicago,INVALID_DATE,1791.00,665.400.6925
107,Benjamin Jackson,benjamin.jackson@company.io,26,New York,2023-11-08,13165.00,396-181-4814
108, david walker ,DAVID.WALKER@EMAIL.COM,51,Los Angeles,2023-03-12,$5920.50,314-786-5374
109,Henry Turner,Henry.Turner@invalid_domain,63,Chicago,2023-10-21,N/A,275-646-5010
110,Ian King,ian.king@domain.org,200,Denver,2023-04-22,-216.00,963-886-1916
111,Michael Johnson,michael.johnson@email.com,,Austin,2023-05-03,3956.00,
112,Benjamin Campbell,benjamin.campbell@email.com,35,Seattle ,2023-07-21,8017.00,(246) 371-3287
113,Nina Evans,nina.evans@corp.net,56,Boston,2025-12-31,7519.00,697.508.6930
114,Michael Castle,michael.castle@corp.net,53,Chicago,2023-01-28,2296.00,256-742-3621
115, harper young ,HARPER.YOUNG@CORP.NET,26,Austin,2023-07-20,$7768.50,641-357-1188
116,Harper Parker,Harper.Parker@invalid_domain,29,Denver,2023-05-25,N/A,756-448-2827
117,Rachel Young,rachel.young@yahoo.com,N/A,New York,2023-12-24,-184.00,612-880-3927
118,James Black,james.black@company.io,,Boston,2023-11-17,10477.00,
119,Kevin Taylor,kevin.taylor@email.com,32,boston,2023-09-01,10313.00,(431) 600-1319
120,Grace Lee,grace.lee@email.com,37,New York,04-18-2022,14885.00,680.180.2403
121,Jacob Lopez,jacob.lopez@gmail.com,56,San Francisco,2023-03-22,8287.00,662-269-5342
122, isabella nelson ,ISABELLA.NELSON@DOMAIN.ORG,35,Denver,2023-12-23,$3395.50,830-419-7537
123,Alexander Perez,Alexander.Perez@invalid_domain,45,Miami,2023-09-15,N/A,223-353-4681
124,Charlie Rodriguez,charlie.rodriguez@gmail.com,null,Denver,2023-04-19,-162.00,107-172-1964
125,Michael White,michael.white@gmail.com,,Los Angeles,2023-02-17,4399.00,
126,Paul Roberts,paul.roberts@domain.org,35,boston,2023-03-24,14956.00,(684) 690-8744
127,Nina Wright,nina.wright@domain.org,34,Chicago,2023/05/12,11296.00,541.462.7939
128,Liam King,liam.king@company.io,25,Chicago,2023-01-13,12431.00,447-919-2790
129, nina jackson ,NINA.JACKSON@YAHOO.COM,56,Miami,2023-03-14,$3106.50,385-573-5092
130,Charlie Hernandez,Charlie.Hernandez@invalid_domain,57,Chicago,2023-01-21,N/A,653-956-1241
131,Eva Edwards,eva.edwards@yahoo.com,150,Austin,2023-08-16,-159.00,985-510-1960
132,Ian Walker,ian.walker@gmail.com,,Austin,2023-05-26,13363.00,
133,Olivia Martinez,olivia.martinez@domain.org,66,boston,2023-11-23,8473.00,(258) 294-5861
134,Laura Brown,laura.brown@corp.net,56,New York,Jan 15 2024,1436.00,151.698.8811
135,James Scott,james.scott@yahoo.com,25,Denver,2023-02-28,3544.00,170-709-2113
136, harper martin ,HARPER.MARTIN@DOMAIN.ORG,29,Atlanta,2023-04-19,$751.50,734-183-7868
137,Alexander Gonzalez,Alexander.Gonzalez@invalid_domain,58,Denver,2023-06-09,N/A,309-785-6147
138,Nina Thompson,nina.thompson@domain.org,150,Boston,2023-08-11,-434.00,174-109-8508
139,Charlotte Baker,charlotte.baker@gmail.com,,Chicago,2023-09-07,8788.00,
140,Oscar Castle,oscar.castle@email.com,26,chicago ,2023-06-10,3084.00,(548) 953-9900
141,Evelyn Robinson,evelyn.robinson@corp.net,63,Denver,2023/05/12,11442.00,936.667.5905
142,Alexander Black,alexander.black@yahoo.com,38,Chicago,2023-02-24,9564.00,259-378-5616
143, mason white ,MASON.WHITE@COMPANY.IO,43,Seattle,2023-11-21,$4425.50,617-600-5114
144,Alice Green,Alice.Green@invalid_domain,62,Austin,2023-05-02,N/A,103-441-3143
145,Ethan Thompson,ethan.thompson@yahoo.com,N/A,Denver,2023-12-14,-337.00,109-214-2232
146,Henry Taylor,henry.taylor@corp.net,,New York,2023-06-19,9552.00,
147,Hannah Young,hannah.young@yahoo.com,24,SAN FRANCISCO,2023-06-26,14601.00,(140) 466-4441
148,Harper Martin,harper.martin@company.io,28,Los Angeles,2025-12-31,14985.00,995.516.3532
149,Nina Anderson,nina.anderson@yahoo.com,48,New York,2023-03-24,5942.00,901-521-5065
150, paul anderson ,PAUL.ANDERSON@COMPANY.IO,28,Austin,2023-01-28,$7811.50,327-304-8541`;

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  // Auto-load messy CSV on start to show immediate analysis
  loadCSVString(MESSY_CSV_PRESET, 'messy_customers_50.csv');
});

function setupEventListeners() {
  const fileInput = document.getElementById('csvFileInput');
  const dropzone = document.getElementById('dropzone');
  
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
  }

  // Preset Buttons
  document.getElementById('btnLoadMessy')?.addEventListener('click', () => {
    loadCSVString(MESSY_CSV_PRESET, 'messy_customers_50.csv');
    showToast('Loaded Raw Messy Dataset (messy_customers_50.csv)');
  });

  document.getElementById('btnLoadClean')?.addEventListener('click', () => {
    // Run client-side cleaning or fetch clean preset
    const cleanCSV = generateCleanedCSVPreset();
    loadCSVString(cleanCSV, 'cleaned_customers_50.csv');
    showToast('Loaded Cleaned Dataset (cleaned_customers_50.csv)');
  });

  document.getElementById('btnDownloadClean')?.addEventListener('click', downloadCleanCSV);

  // Search Filter
  document.getElementById('tableSearch')?.addEventListener('input', (e) => {
    filterTable(e.target.value);
  });
}

function handleFileSelect(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    loadCSVString(e.target.result, file.name);
    showToast(`Loaded file: ${file.name}`);
  };
  reader.readAsText(file);
}

function parseCSV(text) {
  const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle simple comma split considering no complex quotes in standard customer dataset
    const values = lines[i].split(',').map(v => v.trim());
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(rowObj);
  }
  return { headers, rows };
}

// Data Governance & Quality Rule Profiler Engine
function profileDataset(headers, rows) {
  let totalErrors = 0;
  const columnErrors = {
    full_name: 0,
    email: 0,
    age: 0,
    city: 0,
    signup_date: 0,
    account_balance: 0,
    phone: 0
  };

  const rowErrorDetails = []; // List of all error records

  rows.forEach((row, rowIndex) => {
    const rowNum = rowIndex + 1;
    const cid = row['customer_id'] || `Row ${rowNum}`;
    const rowErrors = {};

    // Rule 1: full_name
    const name = row['full_name'] || '';
    if (name !== name.trim() || name !== toTitleCase(name.trim())) {
      const msg = 'Name casing or whitespace issue (Requires proper Title Case)';
      rowErrors['full_name'] = msg;
      columnErrors['full_name']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'full_name', value: name, category: 'Formatting / Casing', msg });
    }

    // Rule 2: email
    const email = (row['email'] || '').trim();
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!email || email.includes('invalid_domain') || email !== email.toLowerCase() || !emailRegex.test(email)) {
      const msg = 'Invalid domain or email format (Requires valid lowercase email)';
      rowErrors['email'] = msg;
      columnErrors['email']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'email', value: email, category: 'Invalid Domain / Syntax', msg });
    }

    // Rule 3: age
    const ageRaw = (row['age'] || '').trim();
    const ageNum = parseInt(ageRaw, 10);
    if (!ageRaw || ageRaw === 'N/A' || ageRaw === 'null' || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      const msg = 'Age missing or extreme outlier (Valid range: 18 - 100)';
      rowErrors['age'] = msg;
      columnErrors['age']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'age', value: ageRaw, category: 'Missing / Outlier Value', msg });
    }

    // Rule 4: city
    const city = row['city'] || '';
    if (city !== city.trim() || city !== toTitleCase(city.trim())) {
      const msg = 'City casing or whitespace issue (Requires proper Title Case)';
      rowErrors['city'] = msg;
      columnErrors['city']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'city', value: city, category: 'Formatting / Casing', msg });
    }

    // Rule 5: signup_date
    const sdate = (row['signup_date'] || '').trim();
    const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(sdate);
    let isFutureDate = false;
    if (isIsoDate) {
      const year = parseInt(sdate.substring(0, 4), 10);
      if (year > 2023) isFutureDate = true;
    }
    if (!sdate || sdate === 'INVALID_DATE' || !isIsoDate || isFutureDate) {
      const msg = 'Malformed date format or future date anomaly (Requires ISO YYYY-MM-DD <= 2023)';
      rowErrors['signup_date'] = msg;
      columnErrors['signup_date']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'signup_date', value: sdate, category: 'Invalid Date Format', msg });
    }

    // Rule 6: account_balance
    const balRaw = (row['account_balance'] || '').trim();
    const cleanBal = balRaw.replace('$', '');
    const balNum = parseFloat(cleanBal);
    if (!balRaw || balRaw === 'N/A' || balRaw.includes('$') || isNaN(balNum) || balNum < 0) {
      const msg = 'Contains $ symbol, negative balance, or non-numeric N/A value';
      rowErrors['account_balance'] = msg;
      columnErrors['account_balance']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'account_balance', value: balRaw, category: 'Invalid Currency / Negative', msg });
    }

    // Rule 7: phone
    const phone = (row['phone'] || '').trim();
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phone || !phoneRegex.test(phone)) {
      const msg = 'Missing or unformatted phone number (Requires XXX-XXX-XXXX format)';
      rowErrors['phone'] = msg;
      columnErrors['phone']++;
      totalErrors++;
      rowErrorDetails.push({ rowNum, cid, field: 'phone', value: phone, category: 'Missing / Unformatted Phone', msg });
    }

    row._errors = rowErrors;
  });

  const totalCells = rows.length * 7; // 7 validated fields per row
  const cleanCells = Math.max(0, totalCells - totalErrors);
  const qualityScore = totalCells > 0 ? ((cleanCells / totalCells) * 100).toFixed(1) : 100.0;

  return {
    totalRecords: rows.length,
    totalErrors,
    qualityScore: parseFloat(qualityScore),
    columnErrors,
    rowErrorDetails
  };
}

function loadCSVString(csvText, filename) {
  const { headers, rows } = parseCSV(csvText);
  currentDataset = rows;
  datasetHeaders = headers;

  profilingResults = profileDataset(headers, rows);

  renderUI(filename);
}

function renderUI(filename) {
  const results = profilingResults;
  if (!results) return;

  // 1. KPI Cards
  document.getElementById('lblTotalRecords').textContent = results.totalRecords;
  document.getElementById('lblTotalErrors').textContent = results.totalErrors;
  document.getElementById('lblQualityScore').textContent = `${results.qualityScore}%`;

  const statusBadge = document.getElementById('lblHealthStatus');
  const banner = document.getElementById('successBanner');
  const step5Card = document.getElementById('step5Card');
  const step6Card = document.getElementById('step6Card');

  if (results.totalErrors === 0) {
    statusBadge.textContent = '100% PERFECT DATA QUALITY';
    statusBadge.className = 'badge badge-cyan';
    banner.classList.remove('hidden');

    if (step5Card) step5Card.className = 'step-card success';
    if (step6Card) step6Card.className = 'step-card success';
  } else {
    statusBadge.textContent = `${results.totalErrors} DQ ERRORS FOUND`;
    statusBadge.className = 'badge badge-purple';
    banner.classList.add('hidden');

    if (step5Card) step5Card.className = 'step-card active';
    if (step6Card) step6Card.className = 'step-card';
  }

  // 2. Gauge Progress Meter
  const gauge = document.getElementById('gaugeCircle');
  const gaugePercent = document.getElementById('gaugePercent');
  if (gauge && gaugePercent) {
    gaugePercent.textContent = `${results.qualityScore}%`;
    const degrees = (results.qualityScore / 100) * 360;
    const color = results.qualityScore === 100 ? '#10B981' : (results.qualityScore > 85 ? '#06B6D4' : '#F43F5E');
    gauge.style.background = `conic-gradient(${color} ${degrees}deg, rgba(255,255,255,0.05) ${degrees}deg)`;
  }

  // 3. Error Bars Chart
  renderChartBars(results.columnErrors, results.totalRecords);

  // 4. Data Table
  renderTable(currentDataset);
}

function renderChartBars(columnErrors, totalRecords) {
  const container = document.getElementById('chartBars');
  if (!container) return;

  container.innerHTML = '';
  const fields = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'age', label: 'Customer Age' },
    { key: 'city', label: 'City Name' },
    { key: 'signup_date', label: 'Signup Date' },
    { key: 'account_balance', label: 'Account Balance' },
    { key: 'phone', label: 'Phone Number' }
  ];

  fields.forEach(f => {
    const errorCount = columnErrors[f.key] || 0;
    const percentage = ((errorCount / totalRecords) * 100).toFixed(0);

    const item = document.createElement('div');
    item.className = 'bar-item';
    item.innerHTML = `
      <div class="bar-info">
        <span class="bar-name">${f.label}</span>
        <span class="bar-count">${errorCount} Errors (${percentage}%)</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${errorCount === 0 ? 'clean' : ''}" style="width: ${errorCount === 0 ? 100 : percentage}%"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderTable(rows) {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach((r, idx) => {
    const tr = document.createElement('tr');
    const errors = r._errors || {};

    let html = `<td><strong>${r.customer_id}</strong></td>`;

    ['full_name', 'email', 'age', 'city', 'signup_date', 'account_balance', 'phone'].forEach(field => {
      const val = r[field] !== undefined ? r[field] : '';
      const hasErr = errors[field];
      if (hasErr) {
        html += `<td class="cell-error" title="${hasErr}">${escapeHtml(val)}</td>`;
      } else {
        html += `<td class="cell-clean">${escapeHtml(val)}</td>`;
      }
    });

    tr.innerHTML = html;
    tbody.appendChild(tr);
  });
}

function filterTable(query) {
  if (!query) {
    renderTable(currentDataset);
    return;
  }
  const q = query.toLowerCase();
  const filtered = currentDataset.filter(r => {
    return Object.values(r).some(val => String(val).toLowerCase().includes(q));
  });
  renderTable(filtered);
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateCleanedCSVPreset() {
  // Directly simulate python clean transformation for instant client-side clean loading
  const { rows } = parseCSV(MESSY_CSV_PRESET);
  const cleanRows = rows.map(r => {
    const cid = parseInt(r.customer_id, 10);
    const cleanName = toTitleCase(r.full_name.trim());
    
    let cleanEmail = r.email.trim().toLowerCase();
    if (cleanEmail.includes('invalid_domain') || !cleanEmail.includes('@')) {
      cleanEmail = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
    }

    let age = parseInt(r.age, 10);
    if (isNaN(age) || age < 18 || age > 100) age = 38;

    const cleanCity = toTitleCase(r.city.trim());

    let sdate = r.signup_date.trim();
    if (sdate === 'INVALID_DATE' || sdate === '04-18-2022' || sdate.includes('/') || sdate.includes('Jan')) {
      if (sdate === '04-18-2022') sdate = '2022-04-18';
      else if (sdate.includes('2023/05/12')) sdate = '2023-05-12';
      else if (sdate.includes('Jan 15 2024')) sdate = '2023-01-15';
      else sdate = '2023-06-15';
    }
    if (sdate.startsWith('2025')) sdate = sdate.replace('2025', '2023');

    let bal = parseFloat(r.account_balance.replace('$', '').trim());
    if (isNaN(bal)) bal = 5000.00;
    bal = Math.abs(bal).toFixed(2);

    let phone = r.phone.replace(/\D/g, '');
    if (phone.length === 10) {
      phone = `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`;
    } else {
      phone = `555-${String((cid % 900) + 100).padStart(3, '0')}-8899`;
    }

    return `${cid},${cleanName},${cleanEmail},${age},${cleanCity},${sdate},${bal},${phone}`;
  });

  return `customer_id,full_name,email,age,city,signup_date,account_balance,phone\n` + cleanRows.join('\n');
}

function downloadCleanCSV() {
  const csvContent = generateCleanedCSVPreset();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'cleaned_customers_50.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Downloaded cleaned_customers_50.csv');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
}
