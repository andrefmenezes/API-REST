const express = require('express');
const app = express();
const cors = require('cors');

const routes = require('./src/routes/routes');

app.use(cors());
app.use(express.json());
app.use(routes);
//app.setTimeout(50000);
app.listen(3333, () => console.log(`servidor ok `));
