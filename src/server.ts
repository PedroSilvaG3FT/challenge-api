import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';

const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '15MB' }))

app.use(cors());
app.use(express.json())
app.use(routes);

app.listen(process.env.PORT || 3333);