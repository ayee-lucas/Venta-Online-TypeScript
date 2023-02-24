export default class Utils {
  /**
   * deleteEntryBooleanArg
   */
  public static deleteEntryBooleanArg(arg: Boolean, data: any, prop: string) {
    if (arg) {
      return data;
    } else {
      delete data[prop];
      return data;
    }
  }
}
