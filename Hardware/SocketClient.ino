#include <SocketIOClient.h>
#define LedPin 2

const char* ssid = "Braga";
const char* password = "1co13131";

SocketIOClient socket;
const char HexLookup[17] = "0123456789ABCDEF";

String host = "192.168.0.27";
int port = 8000;

void setupNetwork() {

  #ifdef SOFTAP_MODE
    WiFi.disconnect();
    byte mac[6];
    WiFi.macAddress(mac);
    char ssid[14] = "Minion-000000";
    ssid[7] = HexLookup[(mac[3] & 0xf0) » 4];
    ssid[8] = HexLookup[(mac[3] & 0x0f)];
    ssid[9] = HexLookup[(mac[4] & 0xf0) » 4];
    ssid[10] = HexLookup[(mac[4] & 0x0f)];
    ssid[11] = HexLookup[(mac[5] & 0xf0) » 4];
    ssid[12] = HexLookup[(mac[5] & 0x0f)];
    ssid[13] = 0;
    WiFi.softAP(ssid, password);
  #else
    WiFi.begin(ssid, password);
    uint8_t i = 0;
    while (WiFi.status() != WL_CONNECTED && i++ < 20) delay(500);
    if(i == 21){
      while(1) delay(500);
    }
  #endif
}


void led(String state) {
  Serial.println("[led] " + state);
  if (state == "\"state\":true") {
    Serial.println("[led] aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    digitalWrite(LED_BUILTIN, LOW);
  }
  else {
    Serial.println("[led] off");
    digitalWrite(LED_BUILTIN, HIGH);
    
  }
}

//
// This code runs only once
//
void setup() {
  //Set Up ESP8266
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.begin(115200);

  setupNetwork();    

  socket.on("led", led);
  socket.connect(host, port);
}

void loop() {
  socket.monitor();  
}