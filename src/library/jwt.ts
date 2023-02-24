import jwt from "jsonwebtoken";
import Logging from "./loggin";

export default class JWT {
  /**
   * createToken
   */
  public static createToken(user: any) {
    try {
      const payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 + 120),
      };
      return jwt.sign(payload, `${process.env.SECRET_KEY}`);
    } catch (err) {
      err = new Error(`Error creating token in JWT ${err}`);
      Logging.error(err);
      return err;
    }
  }
}
