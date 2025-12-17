document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await getDashboardData();
        populateStats(data);
        renderCharts(data);
        populateTables(data);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        // Display a general error message on the dashboard itself
        document.querySelector('.container').innerHTML = `
            <div class="card empty-state">
                <i class="fas fa-server"></i>
                <h2>Could not connect to server</h2>
                <p>Please ensure the backend is running and try again.</p>
            </div>
        `;
    }
});

function populateStats(data) {
    document.getElementById('total-scans').textContent = data.totalScans || 0;
    document.getElementById('scam-count').textContent = data.scamCount || 0;
    document.getElementById('safe-count').textContent = data.notScamCount || 0;
}

function renderCharts(data) {
     console.log("Daily usage:", data.dailyUsage);
    // Pie Chart
    const pieChartEl = document.getElementById('scans-pie-chart');
    const pieChartEmpty = document.getElementById('pie-chart-empty');
    if (data.totalScans > 0) {
        pieChartEmpty.style.display = 'none';
        pieChartEl.style.display = 'block';
        new Chart(pieChartEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Scam', 'Safe'],
                datasets: [{
                    data: [data.scamCount, data.notScamCount],
                    backgroundColor: ['#e63946', '#28a745'],   // red, green

                    borderColor: 'var(--card-bg)',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: { legend: { position: 'bottom' } }
            }
        });
    } else {
        pieChartEl.style.display = 'none';
        pieChartEmpty.style.display = 'block';
    }

    // Line Chart
    const lineChartEl = document.getElementById('scans-line-chart');
    const lineChartEmpty = document.getElementById('line-chart-empty');
    if (data.dailyUsage && data.dailyUsage.length > 1) {
        lineChartEmpty.style.display = 'none';
        lineChartEl.style.display = 'block';
        new Chart(lineChartEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.dailyUsage.map(d => d._id),
                datasets: [{
                    label: 'Scans Per Day',
                    data: data.dailyUsage.map(d => d.count),
                    fill: true,
                    backgroundColor: 'rgba(106, 17, 203, 0.1)',
                    borderColor: 'var(--primary-color)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    } else {
        lineChartEl.style.display = 'none';
        lineChartEmpty.style.display = 'block';
    }
}

function populateTables(data) {
    // Keywords Table
    const keywordsTable = document.getElementById('keywords-table-container');
    const keywordsEmpty = document.getElementById('keywords-empty');
    const keywordsTbody = document.getElementById('keywords-table').querySelector('tbody');
    
    if (data.mostCommonKeywords && data.mostCommonKeywords.length > 0) {
        keywordsEmpty.style.display = 'none';
        keywordsTable.style.display = 'block';
        keywordsTbody.innerHTML = '';
        data.mostCommonKeywords.forEach(kw => {
            const row = `<tr><td>${kw._id}</td><td>${kw.count}</td></tr>`;
            keywordsTbody.innerHTML += row;
        });
    } else {
        keywordsTable.style.display = 'none';
        keywordsEmpty.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await getDashboardData();
        
        console.log("Dashboard data:", data);   // ← ADD THIS LINE

        populateStats(data);
        renderCharts(data);
        populateTables(data);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
});
