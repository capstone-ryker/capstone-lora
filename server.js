const express = require('express');
const app = express();
const path = require('path');

// 센서 데이터를 저장할 변수
let sensorData = {}; // 센서 데이터를 저장할 변수

// 포스트 요청으로 받은 데이터를 처리하기 위해 필요
app.use(express.json());

// 정적 파일 제공 (HTML 파일 등)
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로에서 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Arduino에서 데이터를 전송받기 위한 엔드포인트
app.post('/api/sensor-data', (req, res) => {
  const { temperature, humidity } = req.body;
  sensorData = { temperature, humidity, timestamp: Date.now() };
  console.log('Received sensor data:', sensorData);
  res.status(200).send('Sensor data received');
});

// 최신 센서 데이터를 제공
app.get('/api/latest-sensor-data', (req, res) => {
  res.json(sensorData);
});

// 안드로이드 앱에서 제어 명령을 받기 위한 엔드포인트
app.post('/api/control', (req, res) => {
  const { command } = req.body;
  console.log('Received control command:', command);
  // 여기서 명령을 처리하고 필요한 작업을 수행할 수 있습니다.
  res.status(200).send('Control command received');
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
