import Joi from "@hapi/joi";
const CustomJoi = Joi.extend(
{
    type: 'csvString',
    base: Joi.array(),
    coerce(value, helpers) {
        if(typeof value !== 'string') 
            return {value};
    
        return {value: value.replace(/^,+|,+$/mg, '').split(',')};
    },
    validate(value, helpers){
        console.log("Post-Base validation");
    }
});
export default CustomJoi;