import http from "http";
import app from "./app";
import ConnectDb from "./config/db";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT, () => {
  ConnectDb();
  console.log("compiler service is listning on port :", PORT);
});
