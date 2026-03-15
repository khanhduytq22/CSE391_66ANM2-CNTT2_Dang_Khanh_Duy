let students = [];
let sortDirection = 0;

const studentForm = document.getElementById('studentForm');
const txtName = document.getElementById('txtName');
const txtScore = document.getElementById('txtScore');
const studentBody = document.getElementById('studentBody');
const statsArea = document.getElementById('statsArea');
const searchInput = document.getElementById('searchName');
const filterRank = document.getElementById('filterRank');

const getRank = (score) => {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
};

function renderTable() {
    let filtered = [...students];

   
    const keyword = searchInput.value.toLowerCase();
    if (keyword) filtered = filtered.filter(s => s.name.toLowerCase().includes(keyword));

    const rankValue = filterRank.value;
    if (rankValue !== "All") filtered = filtered.filter(s => s.rank === rankValue);

    if (sortDirection !== 0) {
        filtered.sort((a, b) => (a.score - b.score) * sortDirection);
        document.getElementById('sortIcon').innerText = sortDirection === 1 ? "▲" : "▼";
    }

    studentBody.innerHTML = "";
    filtered.forEach((s, index) => {
        const row = document.createElement('tr');

        if (s.rank === "Yếu") row.classList.add('low-score');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td><strong>${s.score}</strong></td>
            <td>${s.rank}</td>
            <td><button class="btn-delete" data-id="${s.id}">Xóa</button></td>
        `;
        studentBody.appendChild(row);
    });

    updateStats();
}

function updateStats() {
    const total = students.length;
    const avg = total === 0 ? 0 : (students.reduce((sum, s) => sum + s.score, 0) / total).toFixed(2);
    statsArea.querySelector('strong').innerText = total;
    statsArea.querySelector('.avg-highlight').innerText = avg;
}

studentForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const name = txtName.value.trim();
    const score = parseFloat(txtScore.value);

    students.push({
        id: Date.now(),
        name: name,
        score: score,
        rank: getRank(score)
    });

    renderTable();
    studentForm.reset(); 
    txtName.focus(); 
});

studentBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const id = parseInt(e.target.dataset.id);
        students = students.filter(s => s.id !== id);
        renderTable();
    }
});

searchInput.addEventListener('input', renderTable);
filterRank.addEventListener('change', renderTable);
document.getElementById('sortScore').onclick = () => {
    sortDirection = sortDirection === 1 ? -1 : 1;
    renderTable();
};