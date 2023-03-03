import { Request, Response } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";

const ping = async (req: Request, res: Response) => {
  return ServerStatus.customStatus(
    res,
    parseInt(`${req.statusCode}`),
    "Category Route",
    "Successfull"
  );
};

const create = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Creating Category", err);
  }
};

export default { ping, create };
