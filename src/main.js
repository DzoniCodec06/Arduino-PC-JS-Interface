//*** Program za komunikaciju Arduino i PC-a pomocu SerialPorta i JavaScripte sve se desava u konzoli ***/

const { SerialPort, ReadlineParser } = require("serialport");
const readLine = require("readline");

const port = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    autoOpen: false
});

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let interval;

port.open((err) => {
    if (err) console.log("Error opening port: ", err.message);
    else console.log(`Port is open ${port.path} at baud: ${port.baudRate}`);
}); 

const parser = new ReadlineParser({ delimiter: "\r\n" });
port.pipe(parser);

// Send data to arduino
// setTimeout(() => port.write("hello"), 2000);


setTimeout(() => {
    rl.question("Enter command: ", command => { 
        port.write(command);
    });
}, 2000);



parser.on("data", data => {
    console.log(data);
});



/*
port.write("hello", (err) => {
    if (err) console.log(err.message);
    else console.log("sent");
}); */

/*
port.on("data", data => {
    console.log(data);
});


port.on('readable', function () {
    console.log('Data:', port.read());
}); 
*/



