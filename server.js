const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.port || 3333
const routes = require('./src/routes/routes');

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
