"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./src/routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
let server = http_1.default.createServer(app);
let swaggerDocument;
if (process.env.NODE_ENV === "production") {
    swaggerDocument = yamljs_1.default.load('./doc/production.yaml');
}
else {
    swaggerDocument = yamljs_1.default.load('./doc/development.yaml');
}
console.log("OK. Deployment mode set to ", process.env.PORT);
server.listen(process.env.PORT);
console.log("App running on this port ", process.env.PORT);
//startJobs();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", parameterLimit: 100000, extended: true }));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use('/v1', index_1.default);
app.get("*", function (req, res) {
    res.send("************* WALLET API V1.O.0 **************");
});
