const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/notify', (req, res) => {
    const message = req.body.message;
    // 받은 메시지를 콘솔에 출력하고 응답을 반환합니다.
    console.log(`Received notification: ${message}`);
    res.json({ status: 'success', message: 'Notification received' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
