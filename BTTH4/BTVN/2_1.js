const form = document.getElementById('registerForm');
const successContainer = document.getElementById('successMsg');
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const togglePassword = document.getElementById('togglePassword');
const fullnameInput = document.getElementById('fullname');
const nameCount = document.getElementById('nameCount');
function showError(fieldId, message) {
    const group = document.getElementById(`group-${fieldId}`);
    const input = document.getElementById(fieldId);
    const errorDisplay = group.querySelector('.error-msg');
    
    if (input && input.type !== 'radio' && input.type !== 'checkbox') {
        input.classList.add('error');
    }
    errorDisplay.innerText = message;
}
fullnameInput.addEventListener('input', () => {
    const len = fullnameInput.value.length;
    nameCount.innerText = `${len}/50`;
});
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.innerText = type === 'password' ? '👁️' : '🙈';
});
passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    strengthBar.className = '';
    
    if (val.length === 0) {
        strengthBar.style.width = '0';
        strengthText.innerText = '';
    } else if (score <= 1) {
        strengthBar.classList.add('weak');
        strengthText.innerText = 'Mức độ: Yếu';
        strengthText.style.color = '#ef4444';
    } else if (score <= 3) {
        strengthBar.classList.add('medium');
        strengthText.innerText = 'Mức độ: Trung bình';
        strengthText.style.color = '#facc15';
    } else {
        strengthBar.classList.add('strong');
        strengthText.innerText = 'Mức độ: Mạnh';
        strengthText.style.color = '#10b981';
    }
});
function clearError(fieldId) {
    const group = document.getElementById(`group-${fieldId}`);
    const input = document.getElementById(fieldId);
    const errorDisplay = group.querySelector('.error-msg');
    
    if (input) input.classList.remove('error');
    errorDisplay.innerText = '';
}

function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/; // Hỗ trợ tiếng Việt
    if (!val) { showError('fullname', 'Họ tên không được để trống'); return false; }
    if (val.length < 3) { showError('fullname', 'Họ tên phải ít nhất 3 ký tự'); return false; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên chỉ được chứa chữ cái'); return false; }
    clearError('fullname');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { showError('email', 'Email không được để trống'); return false; }
    if (!regex.test(val)) { showError('email', 'Định dạng email không hợp lệ'); return false; }
    clearError('email');
    return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/;
    if (!val) { showError('phone', 'Số điện thoại không được để trống'); return false; }
    if (!regex.test(val)) { showError('phone', 'SĐT phải có 10 số và bắt đầu bằng số 0'); return false; }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!val) { showError('password', 'Mật khẩu không được để trống'); return false; }
    if (!regex.test(val)) { showError('password', 'Mật khẩu ≥ 8 ký tự, gồm chữ Hoa, chữ thường và số'); return false; }
    clearError('password');
    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (!confirm) { showError('confirmPassword', 'Vui lòng xác nhận mật khẩu'); return false; }
    if (confirm !== pass) { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return false; }
    clearError('confirmPassword');
    return true;
}

function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    if (!selected) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
    clearError('gender');
    return true;
}

function validateTerms() {
    const checked = document.getElementById('terms').checked;
    if (!checked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return false; }
    clearError('terms');
    return true;
}


const fields = ['fullname', 'email', 'phone', 'password', 'confirmPassword'];
fields.forEach(id => {
    const input = document.getElementById(id);
  
    input.addEventListener('blur', () => {
        if (id === 'fullname') validateFullname();
        if (id === 'email') validateEmail();
        if (id === 'phone') validatePhone();
        if (id === 'password') validatePassword();
        if (id === 'confirmPassword') validateConfirmPassword();
    });

    input.addEventListener('input', () => clearError(id));
});

document.querySelectorAll('input[name="gender"]').forEach(r => r.addEventListener('change', () => clearError('gender')));
document.getElementById('terms').addEventListener('change', () => clearError('terms'));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = validateFullname() & 
                    validateEmail() & 
                    validatePhone() & 
                    validatePassword() & 
                    validateConfirmPassword() & 
                    validateGender() & 
                    validateTerms();

    if (isValid) {
        const name = document.getElementById('fullname').value;
        form.style.display = 'none';
        successContainer.style.display = 'block';
        document.getElementById('displayUserName').innerText = name;
    }
});