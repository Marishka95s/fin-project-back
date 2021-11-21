const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const authRouter = require('./routes/api/auth');
const transactionsRouter = require('./routes/api/transaction');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Упс не найдено :) ' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Ошибка сервера' } = err;
  res.status(status).json({ message });
});

module.exports = app;
