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

// Measure ping initially and then every second
measurePing();
setInterval(measurePing, 1000);



const selectAllCmd = document.getElementById('selectAllCmd');
const selectAllEvent = document.getElementById('selectAllEvent');
const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', () => {
    	State();
    });
    
    let Commands = [{
        'commands': []
    }, {
        'handleEvent': []
    }];

async function State() {
    const jsonInput = document.getElementById('json-data');
    const button = document.getElementById('submitButton');
    
    if (jsonInput.value === '') {
        return showResult('Missing appstate');
    }

    try {
        const State = JSON.parse(jsonInput.value);
        if (State && typeof State === 'object') {
            // Fetch all commands and handle events from the server
            const commandResponse = await fetch('/commands');
            const commandData = await commandResponse.json();

            if (commandData.success) {
                const commands = commandData.commands;
                // Clear and populate Commands array dynamically
                Commands[0].commands = [];  // Clear previous commands
                Commands[1].handleEvent = []; // Clear previous handle events

                commands.forEach(command => {
                    if (command.run) {
                        Commands[0].commands.push(command); // Push command to commands
                    }
                    if (command.handleEvent) {
                        Commands[1].handleEvent.push(command); // Push command to handleEvent
                    }
                });

                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        state: State,
                        commands: Commands,
                        prefix: document.getElementById('inputOfPrefix').value,
                        admin: document.getElementById('inputOfAdmin').value,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    jsonInput.value = '';
                    showResult(data.message, true); // Indicate success
                } else {
                    jsonInput.value = '';
                    showResult(data.message);
                }
            } else {
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
        hideClass: true
    });
}

async function updateActiveSessions() {
      const response = await fetch('/active-sessions');
      const data = await response.json();
      document.getElementById('activeSessions').innerText = data.activeSessions;
             }
