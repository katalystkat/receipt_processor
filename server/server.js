const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Import routers
const receiptsRouter = require('./routes/receipts.js');

// Parsing request body
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Route handlers
app.use('/receipts', receiptsRouter);

app.listen(PORT, ()=> {
    console.log(`Server listenin at port: ${PORT}`)
});