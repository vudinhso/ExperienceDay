#include <Arduino.h>

#define MOT_ENA1 23 // Enable Driver 1
#define MOT_ENA2 32 // Enable Driver 2
#define MOT_IN1A 22
#define MOT_IN1B 21
#define MOT_IN2A 18
#define MOT_IN2B 19
#define MOT_IN3A 33
#define MOT_IN3B 25
#define MOT_IN4A 27
#define MOT_IN4B 26

#define PWM_FREQ 30000
#define PWM_RES 8

double motor_cmd_1 = 0, motor_cmd_2 = 0, motor_cmd_3 = 0, motor_cmd_4 = 0; // Command between [-255; 0] for reverse, [0; 255] for forward
int deadzone = 80;                                                         // Deadzone value

// int PWM_A = 127, PWM_B = 127, PWM_C = 127, PWM_D = 127;
// int LValue, RValue, commaIndex;

// ======================================================
void Init_Motor()
{
    pinMode(MOT_ENA1, OUTPUT);
    pinMode(MOT_ENA2, OUTPUT);
    digitalWrite(MOT_ENA1, HIGH);
    digitalWrite(MOT_ENA2, HIGH);

    pinMode(MOT_IN1A, OUTPUT);
    pinMode(MOT_IN1B, OUTPUT);
    pinMode(MOT_IN2A, OUTPUT);
    pinMode(MOT_IN2B, OUTPUT);
    pinMode(MOT_IN3A, OUTPUT);
    pinMode(MOT_IN3B, OUTPUT);
    pinMode(MOT_IN4A, OUTPUT);
    pinMode(MOT_IN4B, OUTPUT);

    ledcSetup(0, PWM_FREQ, PWM_RES);
    ledcSetup(1, PWM_FREQ, PWM_RES);
    ledcSetup(2, PWM_FREQ, PWM_RES);
    ledcSetup(3, PWM_FREQ, PWM_RES);
    ledcSetup(4, PWM_FREQ, PWM_RES);
    ledcSetup(5, PWM_FREQ, PWM_RES);
    ledcSetup(6, PWM_FREQ, PWM_RES);
    ledcSetup(7, PWM_FREQ, PWM_RES);
}
// ======================================================
void Send_PWM(int PINA, int PINB, double motor_cmd, int channel)
{
    if (motor_cmd < 0) // If the joystick is from [-255; 0]; Reverse direction
    {
        ledcAttachPin(PINB, channel);
        ledcDetachPin(PINA);
        digitalWrite(PINA, LOW);
        ledcWrite(channel, abs(motor_cmd));
    }
    else // If the joystick is from [0; 255]; Forward direction
    {
        ledcAttachPin(PINA, channel);
        ledcDetachPin(PINB);
        digitalWrite(PINB, LOW);
        ledcWrite(channel, abs(motor_cmd));
    }
}
// ======================================================
void Calculate_Motor_Cmd()
{
    // Inverse kinematics
    //   motor_cmd_1 = web_cmd_y - web_cmd_x - web_cmd_z;
    //   motor_cmd_2 = web_cmd_y + web_cmd_x - web_cmd_z;
    //   motor_cmd_3 = web_cmd_y - web_cmd_x + web_cmd_z;
    //   motor_cmd_4 = web_cmd_y + web_cmd_x + web_cmd_z;
    motor_cmd_1 = web_cmd_y - web_cmd_x;
    // motor_cmd_2 = web_cmd_y + web_cmd_x - web_cmd_z;
    motor_cmd_3 = web_cmd_y + web_cmd_x;
    // motor_cmd_4 = web_cmd_y + web_cmd_x + web_cmd_z;

    // Deadzone compensation and constrain
    motor_cmd_1 = (motor_cmd_1 > 0) ? constrain(motor_cmd_1 + deadzone, -255, 255) : constrain(motor_cmd_1 - deadzone, -255, 255);
    // motor_cmd_2 = (motor_cmd_2 > 0) ? constrain(motor_cmd_2 + deadzone, -255, 255) : constrain(motor_cmd_2 - deadzone, -255, 255);
    motor_cmd_3 = (motor_cmd_3 > 0) ? constrain(motor_cmd_3 + deadzone, -255, 255) : constrain(motor_cmd_3 - deadzone, -255, 255);
    // motor_cmd_4 = (motor_cmd_4 > 0) ? constrain(motor_cmd_4 + deadzone, -255, 255) : constrain(motor_cmd_4 - deadzone, -255, 255);
}
// ======================================================
void Run_Motor()
{
    Calculate_Motor_Cmd();
    // Send_PWM(MOT_IN1A, MOT_IN1B, motor_cmd_1, 1);
    // Send_PWM(MOT_IN3A, MOT_IN3B, motor_cmd_3, 3);
    Send_PWM(MOT_IN1B, MOT_IN1A, motor_cmd_1, 1);
    Send_PWM(MOT_IN3B, MOT_IN3A, motor_cmd_3, 3);
    
    
}