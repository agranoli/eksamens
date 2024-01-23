var entries = [];

function displayEntries() {
    fetch('http://localhost:8888/GetMessages.php')
        .then(response => response.json())
        .then(data => {
            entries = data;
            renderEntries(entries);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function renderEntries(data) {
    var recordsTable = document.querySelector('.records');
    recordsTable.innerHTML = ''; // Clear existing content

    data.forEach(entry => {
        var row = recordsTable.insertRow();
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.message}</td>
            <td>${entry.dateAdded}</td>
        `;
    });
}

function sortTable(columnIndex) {
    entries.sort(function (a, b) {
        var aValue = a[Object.keys(a)[columnIndex]];
        var bValue = b[Object.keys(b)[columnIndex]];

        if (typeof aValue === "string") {
            return aValue.localeCompare(bValue);
        } else {
            return aValue - bValue;
        }
    });

    renderEntries(entries);
}

function validateForm() {
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');
    var isValid = true;

    // Clear previous error messages
    clearErrorMessages();

    // Validate name
    if (nameInput.value.trim() === '') {
        displayErrorMessage('name-error', 'Name is required');
        isValid = false;
    }

    // Validate email
    if (emailInput.value.trim() === '') {
        displayErrorMessage('email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        displayErrorMessage('email-error', 'Invalid email format');
        isValid = false;
    }

    // Validate message
    if (messageInput.value.trim() === '') {
        displayErrorMessage('message-error', 'Message is required');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    // Basic email validation regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayErrorMessage(elementId, message) {
    var errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.color = 'red';
}

function clearErrorMessages() {
    var errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

var form = document.getElementById('contactForm');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    validateAndSubmit();
});

function validateAndSubmit() {
    var isValid = validateForm();

    if (isValid) {
        fetch('insert.php', {
            method: 'POST',
            body: new FormData(form)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Try to parse response as JSON
            })
            .then(data => {
                console.log('Entry added successfully:', data);
                // Display entries without reloading the page
                entries.push(data); // Assuming data is the newly added entry
                renderEntries(entries);
                clearForm();
            })
            .catch(error => {
                console.error('Error submitting form:', error);
            });
    }
}

function clearForm() {
    // Clear the form fields after successful submission
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    clearErrorMessages();
}


document.addEventListener("DOMContentLoaded", function () {
    displayEntries();
});
