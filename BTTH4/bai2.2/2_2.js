
const prices = {
    "Laptop": 20000000,
    "Smartphone": 10000000,
    "Keyboard": 1500000,
    "Mouse": 800000
};

const form = document.getElementById('orderForm');
const overlay = document.getElementById('confirmOverlay');

const showError = (id, msg) => {
    const group = document.getElementById(`group-${id}`);
    group.querySelector('.error-msg').innerText = msg;
};
const clearError = (id) => showError(id, '');

function calculateTotal() {
    const product = document.getElementById('product').value;
    const qty = parseInt(document.getElementById('quantity').value) || 0;
    const total = (prices[product] || 0) * qty;
    document.getElementById('totalPrice').innerText = total.toLocaleString('vi-VN') + "đ";
}

document.getElementById('product').onchange = calculateTotal;
document.getElementById('quantity').oninput = calculateTotal;

document.getElementById('note').oninput = function() {
    const len = this.value.length;
    const charCount = document.getElementById('charCount');
    charCount.innerText = `${len}/200`;
    if (len > 200) {
        charCount.classList.add('limit-exceeded');
        showError('note', 'Ghi chú vượt quá 200 ký tự');
    } else {
        charCount.classList.remove('limit-exceeded');
        clearError('note');
    }
};

function validateDate() {
    const dateInput = document.getElementById('deliveryDate').value;
    if (!dateInput) { showError('deliveryDate', 'Vui lòng chọn ngày giao'); return false; }
    
    const selectedDate = new Date(dateInput);
    selectedDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    if (selectedDate < today) { showError('deliveryDate', 'Không được chọn ngày quá khứ'); return false; }
    if (selectedDate > maxDate) { showError('deliveryDate', 'Ngày giao không được quá 30 ngày tới'); return false; }
    
    clearError('deliveryDate'); return true;
}

function validateAll() {
    let isValid = true;
    
    if (!document.getElementById('product').value) { showError('product', 'Chọn sản phẩm'); isValid = false; }
    else clearError('product');

    const qty = parseInt(document.getElementById('quantity').value);
    if (isNaN(qty) || qty < 1 || qty > 99) { showError('quantity', 'Số lượng từ 1-99'); isValid = false; }
    else clearError('quantity');

    if (!validateDate()) isValid = false;

    const addr = document.getElementById('address').value.trim();
    if (addr.length < 10) { showError('address', 'Địa chỉ ít nhất 10 ký tự'); isValid = false; }
    else clearError('address');

    if (!document.querySelector('input[name="payment"]:checked')) { showError('payment', 'Chọn phương thức'); isValid = false; }
    else clearError('payment');

    return isValid;
}

form.onsubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {

        const product = document.getElementById('product').value;
        const qty = document.getElementById('quantity').value;
        const total = document.getElementById('totalPrice').innerText;
        const date = document.getElementById('deliveryDate').value;

        document.getElementById('summaryContent').innerHTML = `
            <p><strong>Sản phẩm:</strong> ${product}</p>
            <p><strong>Số lượng:</strong> ${qty}</p>
            <p><strong>Ngày giao:</strong> ${date}</p>
            <p><strong>Tổng tiền:</strong> <span style="color:blue">${total}</span></p>
        `;
        overlay.style.display = 'flex';
    }
};

document.getElementById('btnCancel').onclick = () => overlay.style.display = 'none';

document.getElementById('btnConfirm').onclick = () => {
    overlay.style.display = 'none';
    const toast = document.getElementById('successToast');
    toast.classList.add('show');
    form.reset();
    document.getElementById('totalPrice').innerText = "0đ";
    setTimeout(() => toast.classList.remove('show'), 3000);
};