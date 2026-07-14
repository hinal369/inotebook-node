require('dotenv').config()
const connection = require('./db');
const express = require('express');
const cors = require('cors');
const app = express()

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
connection();