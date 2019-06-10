import {debug} from "src";

process.on("uncaughtException", (error) => {
  debug(error);
});

process.on("unhandledRejection", (error) => {
  debug(error);
});
