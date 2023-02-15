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
// Port Field
const portField = document.getElementById("port");


let port_conected = false;

const VENDOR_ID = 2341;

//setTimeout(() => console.log(portPath), 2000);

SerialPort.list().then(boards => {
    if (boards[0].vendorId == VENDOR_ID) {
        const port = new SerialPort({
            path: boards[0].path,
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
        
        port.on("close", () => {
            interval = setInterval(findPort, 100);
        });
        
        
        function portNotFound(err) {
            port_conected = false;
            console.log("Error opening port: ", err.message);
            commandField.disabled = true;
            commandBox.classList.replace("command-box-enabled", "command-box-disabled");
            portField.innerText = "Port: disconnected!";
            portField.style.color = "#f74848";
            button.disabled = true;
            answerField.value = "Arduino disconnected";
        }
        
        function portFound() {
            port_conected = true;
            console.log(`Port is open ${port.path} at baud: ${port.baudRate}`);
            commandBox.classList.replace("command-box-disabled", "command-box-enabled");
            portField.innerText = `Port: ${port.path}`;
            portField.style.color = "#ffffff";
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
    } else console.error("There is not any mcu board connected!");
})

