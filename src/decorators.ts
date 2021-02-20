import "reflect-metadata";
import { IParams } from "./IParams.js";

export const registeredParamValidators: { [key: string]: any } = {}

/**
 * @name paramsClass ParamsClass used on the route to be decorated. 
 */
export const ParmasValidator = (paramsClass: any) => {
    return function (target: any) {
        if (Object.getPrototypeOf(target.prototype).constructor.name !== IParams.name) {
            throw new Error(`Decorated paramClass ${target.name} must extend IParams`)
        };
        registeredParamValidators[paramsClass.name] = target;
    };
};