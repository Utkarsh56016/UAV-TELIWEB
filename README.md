# 🚀 UAV-TeliWEB: Drone Telemetry and Control Web Interface

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Open%20in-GitHub%20Codespaces-blue?logo=github)](https://github.com/Utkarsh56016/UAV-TeliWEB)

A modern, responsive web interface for real-time drone telemetry, orientation visualization, and mission control. Built with FastAPI (Python backend) and vanilla JavaScript/CSS (frontend).

![UAV-TeliWEB Dashboard](https://via.placeholder.com/800x400.png?text=UAV-TeliWEB+Dashboard)

## ✨ Features

- **Real-time Telemetry**: Monitor drone position, altitude, speed, and system status
- **Interactive 3D Visualization**: Real-time 3D orientation and position tracking
- **Mission Control**: ARM/DISARM, Take Off, and Start/Stop Mission capabilities
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Themes**: Choose from various color schemes including Dark, Light, and Hacker themes
- **WebSocket Support**: Real-time data updates without page refresh
- **RESTful API**: Well-documented API for integration with other systems

## 📂 Project Structure

```
UAV-TeliWEB/
├── backend/                  # FastAPI backend server
│   ├── main.py              # Main application and API endpoints
│   ├── pi_mavlink_bridge.py  # MAVLink communication bridge
│   ├── requirements.txt      # Python dependencies
│   └── README.md            # Backend documentation
├── static/                  # Frontend static files
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── images/              # Image assets
├── templates/               # HTML templates
├── tests/                   # Unit and integration tests
├── .gitignore               # Git ignore file
├── LICENSE                  # License file
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Utkarsh56016/UAV-TeliWEB.git
   cd UAV-TeliWEB
   ```

2. **Set up a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Access the web interface**
   Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

3. **API Documentation**
   Interactive API documentation is available at:
   ```
   http://localhost:8000/docs
   ```

## 🛠 Development

### Project Structure

- `backend/`: Contains all backend Python code
  - `main.py`: Main FastAPI application and API endpoints
  - `pi_mavlink_bridge.py`: Handles MAVLink communication with Pixhawk
  - `requirements.txt`: Python dependencies

- `static/`: Frontend static files
  - `css/`: Stylesheets
  - `js/`: JavaScript files
  - `images/`: Image assets

- `templates/`: HTML templates

### Available Scripts

- **Run the development server**:
  ```bash
  cd backend
  uvicorn main:app --reload
  ```

- **Run tests**:
  ```bash
  cd backend
  python -m pytest
  ```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Inspired by open-source drone projects
- Thanks to all contributors who have helped improve this project!

## 📞 Contact

Utkarsh Mishra - [@Utkarsh56016](https://github.com/Utkarsh56016) - utkarsh.mishra@example.com

Project Link: [https://github.com/Utkarsh56016/UAV-TeliWEB](https://github.com/Utkarsh56016/UAV-TeliWEB)

---

<div align="center">
  Made with ❤️ by Your Name
</div>

---

## Running the Project on Another Device

To run this UAV Web UI project on another device:

### 1. Copy the Project Files
- Transfer the entire `uav-webui` directory (including `backend`, `static`, and all files) to your target device. You can use a USB drive, SCP, or any file transfer method.

### 2. Install Python and Dependencies
- Ensure Python 3.7+ is installed on the target device.
- Open a terminal and navigate to the `backend` directory:
  ```bash
  cd /path/to/uav-webui/backend
  ```
- Install the required Python packages:
  ```bash
  pip install -r requirements.txt
  ```
  If `pip` is not installed, install it first (e.g., `sudo apt install python3-pip` on Ubuntu).

### 3. Run the Backend Server
- In the `backend` directory, start the FastAPI server:
  ```bash
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```
  - `--host 0.0.0.0` makes the server accessible from other devices on the same network.
  - If you don’t want auto-reload, remove `--reload`.

### 4. Access the App from Another Device
- On the device running the server, find its local IP address (e.g., `192.168.1.100`).
  ```bash
  hostname -I
  ```
- On another device (phone, tablet, laptop) connected to the same network, open a web browser and go to:
  ```
  http://<SERVER_IP>:8000
  ```
  Example: `http://192.168.1.100:8000`

### 5. Firewall and Network
- Make sure port `8000` is open on the server device (disable firewall or allow this port if needed).
- Both devices must be on the same network.

#### (Optional) Production Deployment
For production use, consider using a production server (like `gunicorn` or `uvicorn` without `--reload`) and a reverse proxy (like Nginx), but the above steps are sufficient for development and demo.

---
No build step required. Just open `index.html` in your browser, or access via the backend server at [http://localhost:8000](http://localhost:8000).

---

## API Endpoints (Mock)
- `GET  /api/telemetry` — Returns random telemetry data
- `POST /api/arm` — Arms the drone (mock)
- `POST /api/disarm` — Disarms the drone (mock)
- `POST /api/start_mission` — Starts mission (mock)
- `POST /api/stop_mission` — Stops mission (mock)
- `GET  /` — Serves the frontend UI
- `GET  /static/*` — Serves static assets
- `WS   /ws/telemetry` — WebSocket for real-time telemetry (mock)

> **Note:** `Take Off` and other advanced commands are not implemented yet (UI will show an error if clicked).

---

## Customization & Extension
- To connect to a real drone, replace the random/mock data in `backend/main.py` with actual telemetry and control logic.
- Add/remove endpoints as needed for your mission requirements.
- Tweak the UI in `static/main.js` and `static/styles.css`.

---

## License
MIT License

---

## Credits
- UI/UX: Andrew Mishaz
- Backend/API: FastAPI
- Icons: Font Awesome
- Fonts: Google Fonts (Orbitron, Montserrat)

---

## Contact
For questions or contributions, open an issue or contact the project maintainer.
