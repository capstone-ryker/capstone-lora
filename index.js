const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Firebase 설정 파일 경로

const app = express();
const PORT = process.env.PORT || 5000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com/'
});

app.use(bodyParser.json());

app.post('/notify', (req, res) => {
    const message = req.body.message;
    const registrationToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkIjp7InVpZCI6IjkwMTU1M2QxLTEzMDUtNGZmZS04MjdhLTMxNWVjYzBlOTRjYSIsInByb2plY3QiOiJhcGkiLCJkZXZlbG9wZXIiOiJoaWRvdG9sQGdtYWlsOmNvbSJ9LCJ2IjowLCJleHAiOjE2NzM5MTc0MjYxLCJpYXQiOjE3MTgxMDIyNjF9.mOayd9fCovCrtXlQtWLnbkLsdSc6v-tUCoWyXH3QuIo'; // 사용자 디바이스 토큰

    const payload = {
        notification: {
            title: 'Face Recognition Alert',
            body: message
        }
    };

    admin.messaging().sendToDevice(registrationToken, payload)
        .then(response => {
            console.log('Successfully sent message:', response);
            res.json({ status: 'success', message: 'Notification sent' });
        })
        .catch(error => {
            console.log('Error sending message:', error);
            res.json({ status: 'failure', message: 'Notification failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
