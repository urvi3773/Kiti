document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const paymentDetails = document.getElementById('payment-details');
    const upiInfo = document.getElementById('upi-info');
    const qrInfo = document.getElementById('qr-info');
    const cardInfo = document.getElementById('card-info');

    paymentForm.addEventListener('change', (e) => {
        const selectedPaymentMethod = e.target.value;

        upiInfo.classList.add('hidden');
        qrInfo.classList.add('hidden');
        cardInfo.classList.add('hidden');

        if (selectedPaymentMethod === 'upi') {
            upiInfo.classList;
        } else if (selectedPaymentMethod === 'qr') {
            qrInfo.classList;
        } else if (selectedPaymentMethod === 'debit' || selectedPaymentMethod === 'credit') {
            cardInfo.classList;
        }
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add payment processing logic here
        alert('Payment processing...');
    });
});
