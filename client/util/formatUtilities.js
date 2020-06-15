import StringUtilities from "./stringUtilities";

export default class FormatUtilities {
  static getFormattedWebsiteTitle(pageTitle, siteTitle) {
    return `${StringUtilities.toEachWordCapitalized(pageTitle)} | ${StringUtilities.toEachWordCapitalized(siteTitle)}`;
  }
}
