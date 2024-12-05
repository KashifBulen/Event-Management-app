import { randomBytes } from "crypto";
import express from "express";
import ROUTES from "../routes";
import makeApi from "../utils/make-api";
import fileUpload from 'express-fileupload'

const MAX_PAYLOAD_SIZE = "5mb";
const SERVER_PORT = 3001;

export const makeServer = () => {
  const api = makeApi("openapi.yaml", ROUTES);
  const app = express();
  app.use(express.json({ limit: MAX_PAYLOAD_SIZE }));


  // to upload files to s3
  app.use(fileUpload());

  app.all("*", (req, res, next) => {
    const requestId =
      req.headers["x-request-id"] ||
      req.headers["request-id"] ||
      randomBytes(4).toString("hex");

    //@ts-ignore
    req.requestId = requestId;
    return next(); // Call the next middleware or handler
  });

  app.use(async (req, res) => {
    const handler = await api;
    return await handler.handleRequest(req as any, req, res);
  });

  return {
    app,
    start: () => {
      return new Promise<() => void>((resolve, reject) => {
        const server = app.listen(SERVER_PORT, () => {
          console.log(`started server on port:${SERVER_PORT}`);
          resolve(() => server.close());
        });
        server.on("error", reject);
      });
    },
  };
};
