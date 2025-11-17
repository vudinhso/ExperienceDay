#include <Arduino.h>
#include "MyServer.h"
#include "MyMotor.h"
#include "Config.h"

// ===========================================
// Setup
// ===========================================
void setup()
{
  Init_Motor();
  Init_Webserver();
}
// ===========================================
// Loop
// ===========================================
void loop()
{
  auto client = WebSocket.accept();
  client.onMessage(handle_message);

  while (client.available())
  {
    client.poll(); // Get Joystick value from websocket
    Run_Motor();   // Send motor command
  }
}
