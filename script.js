const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL';

async function checkTicket() {
    const serial = document.getElementById('serialNumber').value;
    const resultDiv = document.getElementById('verificationResult');
    
    if(!serial) {
        resultDiv.innerHTML = "Please enter a serial number";
        return;
    }

    try {
        const response = await fetch(`YOUR_VERIFICATION_SCRIPT_URL?serial=${serial}`);
        const data = await response.json();
        
        if(data.status === 'valid') {
            resultDiv.innerHTML = `✅ Valid Ticket!<br>Name: ${data.name}<br>Email: ${data.email}`;
        } else {
            resultDiv.innerHTML = "❌ Invalid Ticket Number";
        }
    } catch (error) {
        resultDiv.innerHTML = "Error checking ticket. Please try again.";
    }
}

// Form submission handling
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        await fetch(scriptURL, { method: 'POST', body: formData });
        alert('Registration Successful! You will receive confirmation via email.');
        window.location.href = '/';
    } catch (error) {
        alert('Error submitting form! Please try again.');
    }
});