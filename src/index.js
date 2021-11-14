const logger = require("./logger");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();
const port = process.env.PORT || app.get("port");

const server = app.listen(port);

process.on("unhandledRejection", (reason, p) =>
  logger.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () =>
  logger.info(
    "Feathers application started on http://%s:%d",
    app.get("host"),
    port
  )
);
