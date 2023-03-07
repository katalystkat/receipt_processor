import express from 'express';
import bodyParser from 'body-parser'
import receiptsRouter from './routes/receipts.js';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/receipts', receiptsRouter);

app.listen(PORT, ()=> {
    console.log(`Server listenin at port: ${PORT}`)
});