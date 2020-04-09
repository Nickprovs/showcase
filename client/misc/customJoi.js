import StringUtilities from "../util/stringUtilities";

import Joi from "@hapi/joi";
const CustomJoi = Joi.extend(
{
    type: 'csvString',
    base: Joi.array(),
    coerce(value, helpers) {
        if(typeof value !== 'string') 
            return {value};
    
        let data = StringUtilities.getArrayFromCsvString(value);
        return {value: data};
    }
});
export default CustomJoi;