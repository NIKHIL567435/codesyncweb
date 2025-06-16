// Form validation and error handling
function validateForm() {
    const groupName = document.getElementById('groupName');
    const yourName = document.getElementById('yourName');
    let isValid = true;

    // Reset error states
    resetError(groupName);
    resetError(yourName);

    // Validate group name
    if (!groupName.value.trim()) {
        showError(groupName, 'Please enter a group name');
        isValid = false;
    } else if (groupName.value.trim().length < 3) {
        showError(groupName, 'Group name must be at least 3 characters');
        isValid = false;
    }

    // Validate user name
    if (!yourName.value.trim()) {
        showError(yourName, 'Please enter your name');
        isValid = false;
    } else if (yourName.value.trim().length < 2) {
        showError(yourName, 'Name must be at least 2 characters');
        isValid = false;
    }

    return isValid;
}

function showError(inputElement, message) {
    const errorElement = document.getElementById(inputElement.id + 'Error');
    inputElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function resetError(inputElement) {
    const errorElement = document.getElementById(inputElement.id + 'Error');
    inputElement.classList.remove('error');
    errorElement.classList.remove('show');
}

// Save data in localStorage and redirect
function handleCreate() {
    if (!validateForm()) return;

    const yourName = document.getElementById('yourName').value.trim();
    const groupName = document.getElementById('groupName').value.trim();
    const status = "royal";

    localStorage.setItem("currentUser", JSON.stringify({
        name: yourName,
        group: groupName,
        status: status
    }));

    window.location.href = "editor.html";
}

function handleJoin() {
    if (!validateForm()) return;

    const yourName = document.getElementById('yourName').value.trim();
    const groupName = document.getElementById('groupName').value.trim();
    const status = "commoner";

    localStorage.setItem("currentUser", JSON.stringify({
        name: yourName,
        group: groupName,
        status: status
    }));

    window.location.href = "editor.html";
}

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['groupName', 'yourName'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        
        // Clear error when user starts typing
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                resetError(this);
            }
        });

        // Show error when input loses focus and is empty
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showError(this, `Please enter ${inputId === 'groupName' ? 'a group name' : 'your name'}`);
            }
        });
    });
}); 