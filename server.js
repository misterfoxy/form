const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = 8080 || process.env.PORT;

app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.get('/', (req, res) =>{
    res.sendFile('index.html', { root: path.join(__dirname, './views') });
});

app.get('/about', (req, res) =>{
    res.sendFile('about.html', { root: path.join(__dirname, './views') });
});

app.listen(PORT);

