const fs = require("fs");
const path = require("path");

const files = [
  {
    source: path.join(__dirname, "dotenv", "docker.env"),
    target: path.resolve(__dirname, "..", "docker", ".env"),
  },
  {
    source: path.join(__dirname, "dotenv", "web.env"),
    target: path.resolve(__dirname, "..", "docker", "web", ".env"),
  },
  {
    source: path.join(__dirname, "dotenv", "public.env"),
    target: path.resolve(__dirname, "..", "packages", "public", ".env"),
  },
  {
    source: path.join(__dirname, "dotenv", "server.env"),
    target: path.resolve(__dirname, "..", "packages", "server", ".env"),
  },
];

Promise.all(
  files.map(({source, target}) => fs.promises.copyFile(source, target)),
).then();
