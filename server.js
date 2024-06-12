const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');

// 네이버 지도 API 키 설정
const CLIENT_ID = '827gqzxl9b';
const CLIENT_SECRET = '0FoGmVF5PW5t3MbBRguI5h2Pftv1ev4hjSkWjuTp';

// 위치 데이터를 저장할 변수
let latestLocation = { lat: 37.5665, lng: 126.9780 };
let cache = {};
let locationQueue = [];

// 캐시 유효 시간 설정 (예: 5분)
const CACHE_DURATION = 20 * 60 * 1000;

// 포스트 요청으로 받은 데이터를 처리하기 위해 필요
app.use(express.json());

// 정적 파일 제공 (HTML 파일 등)
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로에서 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 위치 정보를 받아 네이버 지도 API로 요청
app.post('/api/location', async (req, res) => {
  const { lat, lng } = req.body;
  const cacheKey = `${lat},${lng}`;
  
  latestLocation = { lat, lng };

  // 캐시 확인
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
    console.log('Returning cached data');
    return res.json({ mapUrl: cache[cacheKey].data });
  }

  locationQueue.push({ lat, lng });

  if (locationQueue.length >= 10) {
    // 네이버 지도 API 요청 URL
    const apiUrl = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?center=${lng},${lat}&level=16&w=600&h=400&markers=type:d|size:mid|pos:${lng}%20${lat}`;

    // API 요청 헤더 설정
    const headers = {
      'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
      'X-NCP-APIGW-API-KEY': CLIENT_SECRET
    };

    console.log('API URL:', apiUrl); // 로그 추가
    console.log('Headers:', headers); // 로그 추가

    try {
      // API 요청
      const response = await axios.get(apiUrl, { headers, responseType: 'arraybuffer' });

      // 요청 성공 시 응답
      if (response.status === 200) {
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imgSrc = `data:image/jpeg;base64,${base64Image}`;
        cache[cacheKey] = { data: imgSrc, timestamp: Date.now() };
        locationQueue = []; // 큐 초기화

        res.json({ mapUrl: imgSrc });
      } else {
        console.log('Response Error:', response.data); // 로그 추가
        res.status(response.status).json({ error: response.data });
      }
    } catch (error) {
      console.error('Request Error:', error.response ? error.response.data : error.message); // 로그 추가
      res.status(500).send('Error processing location data');
    }
  } else {
    res.send('Data added to queue');
  }
});

// 클라이언트가 최신 위치 데이터를 요청할 때 제공
app.get('/api/latest-location', (req, res) => {
  res.json(latestLocation);
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
