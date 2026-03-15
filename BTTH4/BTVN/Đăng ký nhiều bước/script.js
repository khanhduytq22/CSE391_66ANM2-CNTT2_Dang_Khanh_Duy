let currentStep = 1;
const totalSteps = 3;

const form = document.getElementById('multiStepForm');
const steps = document.querySelectorAll('.step');
const indicators = document.querySelectorAll('.step-indicator');
const progressBar = document.getElementById('progressBar');

const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const btnSubmit = document.getElementById('btnSubmit');

function validateStep(step) {
    let isValid = true;
    const clearError = (id) => { document.getElementById(id).nextElementSibling.innerText = ""; };
    const setError = (id, msg) => { document.getElementById(id).nextElementSibling.innerText = msg; isValid = false; };

    if (step === 1) {
        const name = document.getElementById('fullname').value.trim();
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;

        if (name.length < 3) setError('fullname', 'Tên tối thiểu 3 ký tự'); else clearError('fullname');
        if (!dob) setError('dob', 'Vui lòng chọn ngày sinh'); else clearError('dob');
        if (!gender) setError('gender', 'Vui lòng chọn giới tính'); else clearError('gender');
    }

    if (step === 2) {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (!/^\S+@\S+\.\S+$/.test(email)) setError('email', 'Email không hợp lệ'); else clearError('email');
        if (pass.length < 8) setError('password', 'Mật khẩu tối thiểu 8 ký tự'); else clearError('password');
        if (confirm !== pass) setError('confirmPassword', 'Mật khẩu không khớp'); else clearError('confirmPassword');
    }

    return isValid;
}

function updateUI() {

    steps.forEach((s, idx) => {
        s.classList.toggle('active', idx + 1 === currentStep);
    });

    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = progressPercent + "%";

    indicators.forEach((ind, idx) => {
        ind.classList.toggle('active', idx + 1 <= currentStep);
    });

    btnPrev.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'block';
        showSummary(); 
    } else {
        btnNext.style.display = 'block';
        btnSubmit.style.display = 'none';
    }
}

function showSummary() {
    const summaryBox = document.getElementById('summaryBox');
    const data = {
        "Họ tên": document.getElementById('fullname').value,
        "Ngày sinh": document.getElementById('dob').value,
        "Giới tính": document.getElementById('gender').value,
        "Email": document.getElementById('email').value
    };

    summaryBox.innerHTML = Object.entries(data)
        .map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`)
        .join('');
}

btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        currentStep++;
        updateUI();
    }
});

btnPrev.addEventListener('click', () => {
    currentStep--;
    updateUI();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("🎉 Đăng ký thành công!");
    console.log("Dữ liệu gửi đi:", new FormData(form));
});

updateUI();