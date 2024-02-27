let pHtmlMsg;
let serialOptions = { baudRate: 9600  };
let serial;

let r = 0;
let g = 0;
let b = 0;

let rippleSize = 0; // tracks the new ripple shape fraction off serial
let preDistance = 0; // tracks the previous distance received from serial
let preRippleSize = 0; //tracks the previous ripple size
let monoSynth;

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

  // Set up the MonoSynth to start playing a note
  monoSynth = new p5.MonoSynth();
}

function draw() {
  background(0);

  noStroke(); // turn off outline
  fill(r,g,b);

  let xCenter = width / 2;
  let yCenter = height / 2;

  if(rippleSize != 0 && rippleSize != preRippleSize){
    circle(xCenter, yCenter, rippleSize);
    playSynth(rippleSize);
    preRippleSize = rippleSize;
  }

  fill(255);
  const tSize = 14; // text size
  const strInstructions = "Mouse click to change the ripple color";
  textSize(tSize);
  let tWidth = textWidth(strInstructions);
  const xText = width / 2 - tWidth / 2;
  text(strInstructions, xText, height - tSize - 10);
}

function playSynth(rippleSize){
  userStartAudio();

  let note = random(['F64', 'G4']);
  let velocity = map(rippleSize, 50, height-10, 0, 1); // note velocity (volume, from 0 to 1)
  let time = 0;
  let dur = 1/10;

  monoSynth.play(note, velocity, time, dur);
}

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
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
  //console.log("onSerialDataReceived", newData);
  pHtmlMsg.html("onSerialDataReceived: " + newData);

  // Parse the incoming value as a int
  let ultraDistance = parseInt(newData);
  if(ultraDistance >= 3 && ultraDistance <= 20){
    if(preDistance == 0 ||  ultraDistance > (preDistance + 1) || ultraDistance < (preDistance - 1)){
      console.log(ultraDistance);
      rippleSize = int(map(ultraDistance, 3, 30, 50, height-10));
      preDistance = ultraDistance;
    }
    
  }
  else{
    rippleSize = 0;
  }
  
}

/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }

  r = int(random(0,256)); // pick a random value between 0 and 255
  g = int(random(0,256)); // pick a random value between 0 and 255
  b = int(random(0,256)); // pick a random value between 0 and 255

  serialWriteLEDColor(r,g,b); // send the red, green, blue information to Arduino through serial
}

/**
 * Called automatically by the browser through p5.js when data sent to the serial
 */
async function serialWriteLEDColor(red, green, blue){
  if(serial.isOpen()){
    let strData = red + "," + green + "," + blue;
    console.log(strData);
    serial.writeLine(strData);
  }
}