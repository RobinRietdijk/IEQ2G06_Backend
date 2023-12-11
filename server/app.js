import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { requestLogger, responseLogger } from './middleware/morgan';

import indexRouter from './routes/index';

var app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));
app.use("/socket-io", express.static(join(__dirname, '../socket-admin')));

app.use(requestLogger);
app.use('/', indexRouter);
app.use(responseLogger);


export default app;
