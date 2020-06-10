const darkModeKey = "darkModeOn";

export default class ThemeUtilities {
  static getSavedDarkModeOnStatus() {
    let darkModeOn = localStorage.getItem(darkModeKey);
    if (darkModeOn === null) {
      console.log("No theme data in browser local storage");
      //This app looks best with dark mode on.
      return true;
    } else {
      darkModeOn = JSON.parse(darkModeOn);
    }

    return darkModeOn;
  }

  static saveDarkModeOnStatus(darkModeOn) {
    localStorage.setItem(darkModeKey, darkModeOn);
  }
}
