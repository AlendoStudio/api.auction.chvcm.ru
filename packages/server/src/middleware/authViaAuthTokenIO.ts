import * as io from "socket.io";

import {Jwt} from "../utils";

export async function authViaAuthTokenIO(
  socket: io.Socket,
  next: (error?: Error) => void,
): Promise<void> {
  try {
    await Jwt.verifyUser(socket.handshake.query.token);
  } catch (error) {
    return next(error);
  }
  next();
}
