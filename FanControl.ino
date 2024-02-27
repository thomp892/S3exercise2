
int motorPin = 2;
int bPin = 4; //input pin
int buttonState = 0;
int LED_PIN = 10;

//Ultrasonic Pins
int ultraEcho = 13;
int ultraTrig = 12;

//distance and duration
float distance; //distance of object in cm
long duration; //pulse duration of ultrasonic sensor
String dist;

void setup() {
  //set pin modes
  pinMode(bPin, INPUT);
  pinMode(motorPin, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  pinMode(ultraEcho, INPUT); //echo is the input for reading the distance value
  pinMode(ultraTrig, OUTPUT); //trig is the output
  //start the serial
  //copied from lecture code
  Serial.begin(9600);
  Serial.println("serial has begun");
} 

void turnOn() {
  //turn fan and LED on for 5 seconds
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(motorPin, HIGH);
  //  Serial.println("Fan is on!");
    delay(50);
}

void turnOff() {
  //turn off LED & fan when hand is not in required distance
  digitalWrite(LED_PIN, LOW);
  digitalWrite(motorPin, LOW);
  //Serial.println("Fan is off!");
  delay(50);
}

void loop() {
  digitalWrite(ultraTrig, LOW);
  delayMicroseconds(10);
  digitalWrite(ultraTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(ultraTrig, LOW);

  // //read ultrasonic values
  duration = pulseIn(ultraEcho, HIGH);
  //convert duration to distance in centimeters
  distance = duration*0.034/2;
  //Serial.print(distance);
  //Serial.println("cm");
  delay(5);

   //read value from button switch
  buttonState = digitalRead(bPin);

  //Serial.println(buttonState);
  //check for distance between 30.48 = 12 inches
  //then turn on FAN and LED when hand is within required distance
   if (distance >= 0 && distance <= 7.62) {
        if (buttonState == 1) {
          turnOff();
          delay(50);
        }
        else {
          turnOn();
          delay(50);
        }
      } 
      else {
        turnOff();
        delay(50);
      }



  //convert button and ultrasonic distance to Strings for serial
  String distStr = String(distance);
  String buttonStr = String(buttonState);

  //create string of data with distance and button state
  String data = distStr + "," + buttonState + "\n";

  //check if serial is ready to send data
  if(Serial.available() > 0){
    Serial.println("serial is available!");
    //create string of data with distance and button state
    String data = distStr + "," + buttonState + "\n";

    //copied from documentation in lecture
    int strLen = data.length() + 1;
    Serial.println(data);
    char dataArray[strLen];
    //put each char in data into the array str_array
    for(int i = strLen; i >= 0; i--) {
      dataArray[i] = data[i];
    }
    //send the data to the serial to use for p5.js
    Serial.write(dataArray, strLen);
  }
}


