const express = require('express');
var cors=require('cors');
const {connectDB}=require('./repo/dbconnection');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

connectDB();

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });