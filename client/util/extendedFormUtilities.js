export default class ExtendedFormUtilities {
  static getAddressableHighlightArrayAndFormatObj(data) {
    let addressableHighlights = [];

    //Push highlight 1
    if (data.addressableHighlightLabel1 && data.addressableHighlightAddress1)
      addressableHighlights.push({
        label: data.addressableHighlightLabel1,
        address: data.addressableHighlightAddress1,
      });
    delete data.addressableHighlightLabel1;
    delete data.addressableHighlightAddress1;

    //Push highlight 2
    if (data.addressableHighlightLabel2 && data.addressableHighlightAddress2)
      addressableHighlights.push({
        label: data.addressableHighlightLabel2,
        address: data.addressableHighlightAddress2,
      });
    delete data.addressableHighlightLabel2;
    delete data.addressableHighlightAddress2;

    //Push highlight 3
    if (data.addressableHighlightLabel3 && data.addressableHighlightAddress3)
      addressableHighlights.push({
        label: data.addressableHighlightLabel3,
        address: data.addressableHighlightAddress3,
      });
    delete data.addressableHighlightLabel3;
    delete data.addressableHighlightAddress3;

    return addressableHighlights;
  }

  static getAddressableHighlightPropertiesObjFromArray(addressableHighlights) {
    return {
      addressableHighlightLabel1: addressableHighlights ? (addressableHighlights[0] ? addressableHighlights[0].label : "") : "",
      addressableHighlightAddress1: addressableHighlights ? (addressableHighlights[0] ? addressableHighlights[0].address : "") : "",
      addressableHighlightLabel2: addressableHighlights ? (addressableHighlights[1] ? addressableHighlights[1].label : "") : "",
      addressableHighlightAddress2: addressableHighlights ? (addressableHighlights[1] ? addressableHighlights[1].address : "") : "",
      addressableHighlightLabel3: addressableHighlights ? (addressableHighlights[2] ? addressableHighlights[2].label : "") : "",
      addressableHighlightAddress3: addressableHighlights ? (addressableHighlights[2] ? addressableHighlights[2].address : "") : "",
    };
  }
}
