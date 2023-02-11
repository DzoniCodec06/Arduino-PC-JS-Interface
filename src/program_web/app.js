///*** Script for handeling events on web interface (GUI Client) ***///\

const { SerialPort, ReadlineParser } = require("serialport");

// Declaring Variables

// Command Field
const commandField = document.getElementById("command");
const commandBox = document.querySelector("#commandBox");

// Answer Field
const answerField = document.getElementById("answer");
// Button
const button = document.getElementById("btn");

let port_conected = false;

const port = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    autoOpen: false
});

let interval;

const parser = new ReadlineParser({ delimiter: "\r\n" });
port.pipe(parser);

function findPort() {
    port.open((err) => {
        if (err) portNotFound(err);
        else portFound()
    }); 
}

findPort();
interval = setInterval(findPort, 2000);

port.on("close", () => {
    interval = setInterval(findPort, 2000);
});


function portNotFound(err) {
    port_conected = false;
    console.log("Error opening port: ", err.message);
    commandField.disabled = true;
    commandBox.classList.replace("command-box-enabled", "command-box-disabled");
    button.disabled = true;
    answerField.value = "Arduino not connected";
}

function portFound() {
    port_conected = true;
    console.log(`Port is open ${port.path} at baud: ${port.baudRate}`);
    commandBox.classList.replace("command-box-disabled", "command-box-enabled");
    commandField.disabled = false;
    button.disabled = false;
    clearInterval(interval);
    answerField.value = "Arduino: "
}

// Send data to arduino

parser.on("data", data => {
    console.log(data);
    answerField.value = data;
});


// Function for sending command
function sendCommand() {
    console.log(commandField.value);
    port.write(commandField.value);
    commandField.value = "";
}

// Event Listeners (clicking button or Enter)
button.addEventListener("click", sendCommand);

document.addEventListener("keypress", e => {
    if (e.key == "Enter" && port_conected) {
        sendCommand();
    } else {
        console.log("Port not connected!");
    }
});