//#include <LiquidCrystal.h>

int motorPin = 2;
int bPin = 4; //input pin
int buttonState = 0;
int LED_PIN = 10;

//Ultrasonic Pins
int ultraEcho = 13;
int ultraTrig = 12;

//distance and duration
float distance;
long duration;

//const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
//LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

void setup() {

  //set pin modes
  pinMode(bPin, INPUT);
  pinMode(motorPin, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  pinMode(ultraEcho, INPUT); //echo is the input for reading the distance value
  pinMode(ultraTrig, OUTPUT); //trig is the output
  //start the serial
  Serial.begin(9600);
  Serial.println("serial has begun!");
} 

void loop() {
  digitalWrite(ultraTrig, LOW);
  delayMicroseconds(5);
  digitalWrite(ultraTrig, HIGH);
  delayMicroseconds(20);
  digitalWrite(ultraTrig, LOW);

  //read ultrasonic values
  duration = pulseIn(ultraEcho, HIGH);
  //convert duration to distance in centimeters
  distance = duration*0.034/2;
  Serial.print(distance);
  Serial.println("cm");
  delay(5);

  //read value from button switch
  buttonState = digitalRead(bPin);
  //Serial.println(buttonState);


  if (buttonState == 1) {
     //stop fan
    digitalWrite(motorPin, LOW);
    //turn on LED
    digitalWrite(LED_PIN, LOW);
    Serial.println("Fan is off");
    delay(50);
  }
  
  //check for distance between 30.48 = 12 inches
  //then turn on FAN and LED when hand is within required distance
  if(distance >= 0 && distance <= 7.62) {
    //turn fan and LED on for 5 seconds
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(motorPin, HIGH);
    delay(500);
  } else {
    //turn off LED & fan when hand is not in required distance
    digitalWrite(LED_PIN, LOW);
    digitalWrite(motorPin, LOW);
    delay(500);
  }
}
