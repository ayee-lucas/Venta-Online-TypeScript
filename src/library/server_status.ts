import { Response } from "express-serve-static-core";

export default class ServerStatus {
  public static customStatus = (
    res: Response,
    httpStatus: number,
    message: String,
    obj: any
  ) => {
    let responseReturn = res
      .status(httpStatus)
      .send({ message: message, obj: obj });
    return responseReturn;
  };

  public static internal200OK = (res: Response, message: String, obj: any) => {
    let responseReturn = res
      .status(200)
      .send({ message: `SERVER 200 OK [${message}]`, obj: obj });
    return responseReturn;
  };

  public static internal201CREATED = (
    res: Response,
    message: String,
    obj: any
  ) => {
    let responseReturn = res
      .status(201)
      .send({ message: `SERVER 201 CREATED [${message}]`, obj: obj });
    return responseReturn;
  };

  public static internal202DELETED = (
    res: Response,
    message: String,
    obj: any
  ) => {
    let responseReturn = res
      .status(202)
      .send({ message: `SERVER 202 DELETED [${message}]`, obj: obj });
    return responseReturn;
  };

  public static internal500ERROR = (
    res: Response,
    message: String,
    obj: any
  ) => {
    let responseReturn = res.status(500).send({
      message: `SERVER 500 INTERNAL SERVER ERROR [${message}]`,
      obj: obj,
    });
    return responseReturn;
  };

  public static internal400BADREQ = (
    res: Response,
    message: String,
    obj: any
  ) => {
    let responseReturn = res
      .status(400)
      .send({ message: `SERVER 400 BAD REQUEST [${message}]`, obj: obj });
    return responseReturn;
  };

  public static internal404NOTFOUND = (
    res: Response,
    message: String,
    obj: any
  ) => {
    let responseReturn = res
      .status(404)
      .send({ message: `SERVER 404 NOT FOUND [${message}]`, obj: obj });
    return responseReturn;
  };

  public static internal403FORBIDDEN = (
    res: Response,
    message: String,
    obj: any
  ) => {
    let responseReturn = res
      .status(403)
      .send({ message: `SERVER 403 NOT FOUND [${message}]`, obj: obj });
    return responseReturn;
  };
}
