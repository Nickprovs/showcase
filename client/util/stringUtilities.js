export default class StringUtilities {
  static getArrayFromCsvString(input) {
    //Split string into array and trim leading/trailing spaces.
    let data = input.replace(/^,+|,+$/gm, "").split(",");
    data = data.map((str) => str.trim());
    return data;
  }

  static getCsvStringFromArray(input) {
    return input.toString();
  }

  static capitalizeFirstLetterIfPossible(input) {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  static toEachWordCapitalized(input) {
    return input
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
