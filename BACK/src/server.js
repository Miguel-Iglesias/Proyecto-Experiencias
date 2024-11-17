import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import routes from "./routes/index.js";

const server = express();

server.use(express.json());
server.use(cors());
server.use(fileUpload());

server.use(routes);

server.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

server.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

export default server;
