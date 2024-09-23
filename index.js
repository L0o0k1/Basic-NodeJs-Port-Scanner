const net = require("net");
const readline = require("readline");
const colors = require("colors");
const TIMEOUT = 3000; // 3 Seconds
const reLi = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//==========================================
function scanning(host, startPort, endPort) {
  console.log(
    `Scanning ${startPort} to ${endPort} host/s, please wait...`.cyan
  );

  for (let port = startPort; port <= endPort; port++) {
    const sock = new net.Socket();
    sock.setTimeout(TIMEOUT);

    // When Connection is SUCC...
    sock.once("connect", () => {
      console.log(`Port ${port} is open`.green);
      sock.end();
    });
    // When Connection is !SUCC ...
    sock.once("error", (err) => {
      if (err.code === "ECONNREFUSED") {
        console.log(`Port ${port} is closed`.red);
      } else {
        console.error(
          `Error connecting to port ${port}: ${err.message}`.bold.red
        );
      }
      sock.destroy();
    });
    // Handleing the Time Out ..
    sock.once("timeout", () => {
      console.log(`Port ${port} did not respond (timeout)`.yellow);
      sock.destroy(); // Destroy the socket when a timeout occurs
    });

    sock.connect(port, host);
  }
}
//==================================================
reLi.question("Enter the target host: ".yellow, (host) => {
  reLi.question("Enter the starting port: ".yellow, (startPort) => {
    reLi.question("Enter the ending port: ".yellow, (endPort) => {
      scanning(host, parseInt(startPort, 10), parseInt(endPort, 10));
      reLi.close();
    });
  });
});
