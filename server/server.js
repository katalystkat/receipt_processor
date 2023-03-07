import express from 'express';
import bodyParser from 'body-parser'
import receiptsRouter from './routes/receipts.js';
const app = express();
const PORT = 3000;

// Parsing request body
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Route handlers
app.use('/receipts', receiptsRouter);

app.listen(PORT, ()=> {
    console.log(`Server listenin at port: ${PORT}`)
});