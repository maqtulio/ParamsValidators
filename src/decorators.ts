import Joi from "joi";
import "reflect-metadata";
import { IParams } from "./IParams.js";

export const registeredParamValidators: { [key: string]: Joi.Schema } = {}

/**
 * @name validationSchema ParamsClass used on the route to be decorated. 
 */
export const ParamsValidator = (validationSchema: Joi.Schema) => {
    return function (target: any) {
        if (Object.getPrototypeOf(target.prototype).constructor.name !== IParams.name) {
            throw new Error(`Decorated paramClass ${target.name} must extend IParams`)
        };
        registeredParamValidators[target.name] = validationSchema;
    };
};