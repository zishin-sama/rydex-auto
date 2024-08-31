// Function to measure ping
function measurePing() {
    var xhr = new XMLHttpRequest();
    var startTime, endTime;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            endTime = Date.now();
            var pingTime = endTime - startTime;
            var pingElement = document.getElementById("ping");
            
            // Update ping time text
            pingElement.textContent = pingTime + " ms";
            
            // Update color based on ping time
            if (pingTime <= 199) {
                pingElement.style.color = 'yellowgreen';
            } else if (pingTime <= 499) {
                pingElement.style.color = 'yellow';
            } else {
                pingElement.style.color = 'red';
            }
        }
    };
    
    // Initiate the request with a cache-busting query parameter
    xhr.open("GET", location.href + "?t=" + new Date().getTime());
    startTime = Date.now();
    xhr.send();
}

measurePing();
setInterval(measurePing, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', () => {
        State();
    });

    async function State() {
        const jsonInput = document.getElementById('json-data');
        const prefix = document.getElementById('inputOfPrefix').value;
        const admin = document.getElementById('inputOfAdmin').value.trim().split(/\s+/);

        if (jsonInput.value === '') {
            showResult('Missing appstate');
            return;
        }

        try {
            const state = JSON.parse(jsonInput.value);
            if (state && typeof state === 'object') {
                try {
                    const response = await fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            state: state,
                            prefix: prefix,
                            admin: admin,
                        }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        jsonInput.value = '';
                        showResult(data.message, true);
                    } else {
                        jsonInput.value = '';
                        showResult(data.message);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    showResult('Failed to fetch commands from server');
                }
            } else {
                jsonInput.value = '';
                showResult('Invalid JSON data. Please check your input.');
            }
        } catch (parseError) {
            jsonInput.value = '';
            console.error('Error parsing JSON:', parseError);
            showResult('Error parsing JSON. Please check your input');
        }
    }

    function showResult(message, isSuccess = false) {
        Swal.fire({
            title: isSuccess ? 'Success' : 'Error',
            text: message,
            icon: isSuccess ? 'success' : 'error',
            iconColor: isSuccess ? 'green' : 'red',
            color: isSuccess ? 'green' : 'red',
            background: '#252525',
            showConfirmButton: false,
            timer: 3000
        });
    }
});