import bcrypt from "bcrypt";
import Logging from "./loggin";

const encrypt = async (password: any) => {
  try {
    return bcrypt.hashSync(password, 10);
  } catch (err) {
    Logging.error(err);
    return err;
  }
};

export default encrypt;
