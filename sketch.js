
let pHtmlMsg;
let serialOptions = { baudRate: 9600  };
let serial;

//boolean for in or out of distance range
let inRange = false;
//let lf = 10; //int variable for linefeed in ASCII
let myData = "";
let dataValues = [];

function setup() {
  createCanvas(640, 480);

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");

}

function draw() {
  background(255,255,255);
  //loading
  stroke(0,0,0);
  textSize(20);
  text("Detecting...");


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

// //turn system on
// function turnOn(){
//   if(serial.isOpen()){
//     let strData = "HIGH";
//     serial.writeLine(strData);
//   }
// }

// //turn system off
// function turnOff() {
//   if(serial.isOpen()) {
//     let strData = "LOW";
//     serial.writeLine(strData);
//   }
// }

//code below is copied for p5.js class lecture slides
/**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
function onSerialErrorOccurred(eventSender, error) {
  //console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  //console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  //console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}
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

  //copied from lecture
  // Parse the incoming value as a int
  // let ultraDistance = parseInt(newData);
  // console.log(ultraDistance);
  // //check if distance is in range
  // if(ultraDistance >= 0 && ultraDistance <= 7){
  //   inRange = true;
  //   console.log(inRange);
  // }
  // else {
  //   inRange = false;
  //   console.log(inRange);
  // }
}

/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
//this function is copied from lecture notes, but lines 147 - 155 are modified
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }

//NOTE: MAYBE MOVE THIS TO on serial data received??

  //code below is modified from documentation in lecture
  while(serial.isOpen() > 0) {
    //read string from serial into variable until \n marker
    myData = serial.readStringUntil('\n');

    if (myString != null) {
      console.log(myData);
      myData.trim();
      //split data by commas and add into dataValues array
      dataValues.push(split(myData, ','));
      console.log
      //check that both distance and button values are in the array
      if(dataValues.length == 2) {
        console.log(dataValues[0]);
        console.log(dataValues[1]);
      }
      //convert distance & button data into integers
      let ultraDist = parseInt(dataValues[0].trim());
      let buttonData = parseInt(dataValues[1].trim());
      //check that data for each variable is correct
      console.log(ultraDist + " | " + buttonData);
  
      //check if distance is in range
      if(ultraDist >= 0 && ultraDist <= 7){
        inRange = true;
        console.log("Distance is in range!");
      }
      else {
        inRange = false;
        console.log("Distance is not in range");
      }
    }
  }
}
