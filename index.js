require('dotenv').config()
const connection = require('./db');
const express = require('express');

const app = express()

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:3000')
})
connection();