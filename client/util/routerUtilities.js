import Router from "next/router";
import AsyncUtilities from "../util/asyncUtilities";

export default class RouterUtilities {
  static async routeInternalWithDelayAsync(url, milliseconds) {
    await AsyncUtilities.setTimeoutAsync(milliseconds);
    Router.push(url);
  }

  static async routeExternalWithDelayAsync(url, target = "_blank", milliseconds) {
    await AsyncUtilities.setTimeoutAsync(milliseconds);
    window.open(url, target);
  }
}
