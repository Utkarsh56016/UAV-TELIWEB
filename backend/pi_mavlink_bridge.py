# pi_mavlink_bridge.py
"""
Efficient MAVLink telemetry bridge for UAV Mission Control
- Persistent connection to Pixhawk (via /dev/ttyACM0 @ 115200)
- Serves all fields needed by the web UI, robust to missing data
"""
import time
from flask import Flask, jsonify
from flask_cors import CORS
from pymavlink import mavutil
import RPi.GPIO as GPIO
import threading

# MAVLink connection params
SERIAL_PORT = '/dev/ttyACM0'
BAUD_RATE = 115200

# Ultrasonic GPIO pins
TRIG = 24  # Pin 18
ECHO = 25  # Pin 22

app = Flask(__name__)
CORS(app)

# Shared telemetry state
tlm = {
    'lat': None, 'lon': None, 'alt_baro': None, 'alt_ultrasonic': None, 'alt_fused': None,
    'vx': None, 'vy': None, 'vz': None,
    'battery': None, 'voltage': None,
    'roll': None, 'pitch': None, 'yaw': None,
    'armed': None, 'mode': None, 'is_mission_running': None
}

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

def read_ultrasonic():
    GPIO.output(TRIG, False)
    time.sleep(0.05)
    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    timeout = time.time() + 0.04
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()
        if time.time() > timeout:
            return None

    timeout = time.time() + 0.04
    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()
        if time.time() > timeout:
            return None

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150 / 100  # meters
    if 0.02 < distance < 4.0:
        return round(distance, 2)
    return None

# Background thread for persistent MAVLink connection and polling
def mavlink_thread():
    global tlm
    mav = None
    data_streams_requested = False
    while True:
        try:
            if mav is None:
                print("[MAVLINK] Connecting to Pixhawk...")
                mav = mavutil.mavlink_connection(SERIAL_PORT, baud=BAUD_RATE)
                mav.wait_heartbeat(timeout=10)
                print("[MAVLINK] Heartbeat received. System booted.")
                data_streams_requested = False
            # Request all required data streams ONCE after connection
            if not data_streams_requested and mav is not None:
                for stream_id in [0, 1, 2, 6]:  # ALL, RAW_SENSORS, EXTENDED_STATUS, POSITION
                    mav.mav.request_data_stream_send(
                        mav.target_system,
                        mav.target_component,
                        stream_id,
                        4,  # 4Hz (adjust as needed)
                        1   # Start
                    )
                print("[MAVLINK] Data streams requested.")
                data_streams_requested = True
            # Poll messages (non-blocking)
            msg = mav.recv_match(blocking=False)
            if msg:
                print(f"[MAVLINK] Received: {msg.get_type()}")  # Debug: print every type
                if msg.get_type() == 'GLOBAL_POSITION_INT':
                    tlm['alt_baro'] = msg.relative_alt / 1000.0 if hasattr(msg, 'relative_alt') else None
                    tlm['lat'] = msg.lat / 1e7 if hasattr(msg, 'lat') else None
                    tlm['lon'] = msg.lon / 1e7 if hasattr(msg, 'lon') else None
                    tlm['vx'] = msg.vx / 100.0 if hasattr(msg, 'vx') else None
                    tlm['vy'] = msg.vy / 100.0 if hasattr(msg, 'vy') else None
                    tlm['vz'] = msg.vz / 100.0 if hasattr(msg, 'vz') else None
                elif msg.get_type() == 'ATTITUDE':
                    tlm['roll'] = round(msg.roll * 180.0 / 3.14159, 2) if hasattr(msg, 'roll') else None
                    tlm['pitch'] = round(msg.pitch * 180.0 / 3.14159, 2) if hasattr(msg, 'pitch') else None
                    tlm['yaw'] = round(msg.yaw * 180.0 / 3.14159, 2) if hasattr(msg, 'yaw') else None
                elif msg.get_type() == 'SYS_STATUS':
                    tlm['battery'] = msg.battery_remaining if hasattr(msg, 'battery_remaining') else None
                    tlm['voltage'] = msg.voltage_battery / 1000.0 if hasattr(msg, 'voltage_battery') else None
                elif msg.get_type() == 'HEARTBEAT':
                    tlm['armed'] = (msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED) != 0
                    tlm['mode'] = mavutil.mode_string_v10(msg)
                elif msg.get_type() == 'MISSION_CURRENT':
                    tlm['is_mission_running'] = hasattr(msg, 'seq') and (msg.seq > 0)
        except Exception as e:
            print(f"MAVLink error: {e}")
            mav = None
            data_streams_requested = False
            time.sleep(2)
        time.sleep(0.05)  # ~20Hz polling

@app.route('/api/telemetry')
def get_telemetry():
    # Return all fields, use None for missing
    return jsonify(tlm)

if __name__ == '__main__':
    t = threading.Thread(target=mavlink_thread, daemon=True)
    t.start()
    app.run(host='0.0.0.0', port=5000, debug=False)
