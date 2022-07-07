import http from "http";
import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import Yaml from "yamljs";
import dotenv from "dotenv";
import routes from "./src/routes/index"
import startJobs from "./src/cron/index"

dotenv.config()

const app = express();

let server = http.createServer(app);

const swaggerDocument = Yaml.load('../doc/swagger.yaml');


console.log("OK. Deployment mode set to ", process.env.PORT);

server.listen(process.env.PORT);

console.log("App running on this port ", process.env.PORT);

startJobs();

app.use(cors());

app.use(bodyparser.json({ limit: "50mb" }));

app.use(bodyparser.urlencoded({ limit: "50mb", parameterLimit: 100000, extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/v1', routes);

app.get("*", function (req, res) {
    res.send("************* WALLET API V1.O.0 **************");
});


