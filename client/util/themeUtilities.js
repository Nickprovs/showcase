const darkModeKey = "darkModeOn";
import { parseCookies, setCookie } from "nookies";

export default class ThemeUtilities {
  static getSavedDarkModeOnStatus(optionalServerCtx) {
    let cookies = parseCookies(optionalServerCtx);
    if (cookies && cookies[darkModeKey]) {
      return JSON.parse(cookies[darkModeKey]);
    } else {
      console.log("No theme data in browser local storage");
      return false;
    }
  }

  static saveDarkModeOnStatus(darkModeOn) {
    let nowPlusOneMonth = new Date();
    nowPlusOneMonth.setMonth(nowPlusOneMonth.getMonth() + 1);

    setCookie(null, darkModeKey, darkModeOn, {
      maxAge: nowPlusOneMonth,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }
}
