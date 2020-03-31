import Joi from "@hapi/joi";
const CustomJoi = Joi.extend(
{
    type: 'csvString',
    base: Joi.array(),
    coerce(value, helpers) {
        if(typeof value !== 'string') 
            return {value};
    
        //Split string into array and trim leading/trailing spaces.
        let data = value.replace(/^,+|,+$/mg, '').split(',');
        data = data.map(str => str.trim());
        return {value: data};
    }
});
export default CustomJoi;