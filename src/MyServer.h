#include <Arduino.h>           // Arduino Library
#include <WiFi.h>              // Wifi Library
#include <ESPAsyncWebServer.h> // ESP32 Asynchronous Webserver - To receive data from the web server
#include <ArduinoWebsockets.h> // Tiny web socket client
#include <AsyncTCP.h>          // ESP32 Asynchronous Webserver
#include <Arduino_JSON.h>      // JSON for web server
#include "SPIFFS.h"            // Library to collect the website file

// ===========================================
// Variable declaration
// ===========================================
// const char *ssid = "ESP32_Barbarian";   //ok
// const char *ssid = "ESP32_Bard";    //ok
// const char *ssid = "ESP32_Cleric";   //ok
// const char *ssid = "ESP32_Druid";    //ok
// const char *ssid = "ESP32_Fighter"; //ok
// const char *ssid = "ESP32_Monk";    //ok
// const char *ssid = "ESP32_Paladin";  //ok
// const char *ssid = "ESP32_Ranger"; //ok
// const char *ssid = "ESP32_Rogue";    //ok
// const char *ssid = "ESP32_Sorcerer"; //ok 
// const char *ssid = "ESP32_Engineer";
const char *ssid = "ESP32_Fireman";
// const char *ssid = "ESP32_Teacher";


const char *password = "";                                     // Password for soft access point
int commaIndex1, commaIndex2, web_cmd_x, web_cmd_y, web_cmd_z; // Data from the webserver
String ReceivedString;                                         // For debugging only

using namespace websockets; // Required to use websocket
WebsocketsServer WebSocket; // WebsocketsServer creates the two-way communication link, but not the webpage
AsyncWebServer server(80);  // AsyncWebServer creates the webpage, not the websocket

// ===========================================
void Init_Server()
{
    // Website init
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html"); });
    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/style.css"); });
    server.on("/joy.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/joy.js"); });
    server.on("/RMIT-Logo.png", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/RMIT-Logo.png"); });
    server.begin();

    // Check if the websocket communication is online
    WebSocket.listen(82); 
}

// ===========================================
// Configuration to use ESP32 as a hotspot - soft access point
// You may change local IP for each module

void Init_WiFi_AP(const char *ssid, const char *password)
{
    IPAddress local_ip(192, 168, 1, 1);
    IPAddress gateway(192, 168, 1, 1);
    IPAddress subnet(255, 255, 255, 0);
    WiFi.softAP(ssid);
    WiFi.setTxPower(WIFI_POWER_8_5dBm); // Set the WiFi power to 8.5 dBm - Required for the ESP32-C3 supermini
    WiFi.softAPConfig(local_ip, gateway, subnet);
    IPAddress IP = WiFi.softAPIP();
}

// ===========================================
void handle_message(WebsocketsMessage msg)
{
    ReceivedString = msg.data();
    commaIndex1 = msg.data().indexOf(',');
    commaIndex2 = msg.data().indexOf(',', commaIndex1 + 1);
    web_cmd_x = map(msg.data().substring(0, commaIndex1).toInt(), -200, 200, -200, 200);               // Originally: [-100; 100] --> [-255; 255]
    web_cmd_y = map(msg.data().substring(commaIndex1 + 1, commaIndex2).toInt(), -200, 200, -200, 200); // Originally: [-100; 100] --> [-255; 255]
    web_cmd_z = map(msg.data().substring(commaIndex2 + 1).toInt(), 0, 100, 0, 100);              // Originally: [0; 100] --> [-255; 255]
}

// ===========================================
void Init_Webserver()
{
    SPIFFS.begin();               // Load the data for the website: html, css, js, ico
    Init_WiFi_AP(ssid, password); // Wifi configuration
    Init_Server();                // Webpage creation
}