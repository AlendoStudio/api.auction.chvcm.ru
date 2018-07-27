const dgram = require("dgram");

const Message = require("dns-protocol").default;

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
  const request = Message.parse(msg.buffer);
  console.log(request);

  request.type = 1;
  request.recursionAvailable = true;

  request.questions.forEach((question) => {
    request.addCNAME(question.questionName, 20680, process.env.LOOP);
  });

  const answer = request.encode();
  server.send(Buffer.from(answer.buffer), rinfo.port, rinfo.address);
});

server.on("listening", () => {
  const address = server.address();
  console.log(`dns-mailoop listening ${address.address}:${address.port}`)
});

server.bind(parseInt(process.env.PORT, 10), process.env.HOST);
