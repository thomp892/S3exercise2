//lines 1-5 copied from class lecture
let pHtmlMsg;
let serialOptions = { baudRate: 9600  };
let serial;

//boolean for in or out of distance range
let inRange = false;
//let lf = 10; //int variable for linefeed in ASCII
let myData = "";
let dataValues = [];

let ultraDist;
let buttonData;


function setup() {
  //code below under setup() is copied from class lecture
  createCanvas(640, 480);
  background(0);
  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  //serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");

}

//code below is copied for p5.js class lecture slides
 /**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
 function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  pHtmlMsg.html("onSerialDataReceived: " + newData);
   //code below is modified from documentation in lecture

  console.log(newData);
  //read string from serial into variable until \n marker
    //split data by commas and add into dataValues array
    dataValues = split(newData, ',');
    console.log(dataValues);

    //convert distance & button data into integers
    ultraDist = parseInt(dataValues[0]);
    buttonData = parseInt(dataValues[1]);
    //check that data for each variable is correct
    console.log(ultraDist + " | " + buttonData);

    //check if distance is in range
    if(ultraDist >= 0 && ultraDist <= 7){
      inRange = true;
      console.log("Distance is in range!");
    }
    else {
      inRange = false;
      console.log("Distance is not in range.");
    }
}

//Function mouseClicked() - lines 101 - 110 are copied from class lecture examples
/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
//this function is copied from lecture notes, but lines 147 - 155 are modified
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}

function draw() {
  background(255,255,255);
  if(inRange) {
    drawCheck();
  }
  else {
    drawX();
  }
}

function drawCheck() {
  //draw check for fan on
    stroke(0,255,0);
    strokeWeight(5);
    line(width/2 - 20, height/2 - 20, width/2 + 20, height/2 + 10);
    line(width/2 + 20, height/2 + 10, width/2 + 100, height/2 - 60);
}

function drawX() {
  //draw x for fan off
  stroke(255, 0, 0); 
  strokeWeight(5);
  line(width/2 - 50, height/2 - 50, width/2 + 50, height/2 + 50);
  line(width/2 - 50, height/2 + 50, width/2 + 50, height/2 - 50); 
}