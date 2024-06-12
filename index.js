const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/notify', (req, res) => {
    const message = req.body.message;
    console.log(`Received notification: ${message}`);
    res.json({ status: 'success', message: 'Notification received' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
