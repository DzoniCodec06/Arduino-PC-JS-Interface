///*** Script for handeling events on web interface (GUI Client) ***///\

const { SerialPort, ReadlineParser } = require("serialport");

const port = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    autoOpen: false
});

const parser = new ReadlineParser({ delimiter: "\r\n" });
port.pipe(parser);

port.open((err) => {
    if (err) console.log("Error opening port: ", err.message);
    else console.log(`Port is open ${port.path} at baud: ${port.baudRate}`);
}); 

// Send data to arduino

parser.on("data", data => {
    console.log(data);
    answerField.value = data;
});



// Declaring Variables
// Command Field
const commandField = document.getElementById("command");
// Answer Field
const answerField = document.getElementById("answer");
// Button
const button = document.getElementById("btn");

// Function for sending command
function sendCommand() {
    console.log(commandField.value);
    port.write(commandField.value);
    commandField.value = "";
}

// Event Listeners (clicking button or Enter)
button.addEventListener("click", sendCommand);

document.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        sendCommand();
    }
});