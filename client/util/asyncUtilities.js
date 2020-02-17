export default class AsyncUtilities {
  static async setTimeoutAsync(milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
}
