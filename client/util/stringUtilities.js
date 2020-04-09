export default class StringUtilities {
    static getArrayFromCsvString(input){
        //Split string into array and trim leading/trailing spaces.
        let data = input.replace(/^,+|,+$/mg, '').split(',');
        data = data.map(str => str.trim());
        return data;
    }

    static getCsvStringFromArray(input){
        return input.toString();
    }
}