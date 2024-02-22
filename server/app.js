const express = require("express");
const cors = require("cors");
const app = express();
require( "./config/db" );
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const routers = require("./routes/taskRoute");
const port = 5000;

//middlewares
app.use("*", cors());
app.use(express.json());
app.use("/api/v1", routers);

app.listen(port, () => {
  console.log(`server is listening on http://localhost: ${port}`);
});
