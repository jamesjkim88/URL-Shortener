const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// connecting to db
connectDB();

app.use(express.json({extended: false}));

//define routes
app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

const PORT = 5000;
const date = new Date();
const time = `${date.getHours()}:${date.getMinutes()}`;

app.listen(PORT, () => console.log(`Server running on port ${PORT} on ${time}`));
