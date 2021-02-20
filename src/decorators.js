import "reflect-metadata";
import { IParams } from "./IParams.js";
export const registeredParamValidators = {};
/**
 * @name paramsClass ParamsClass used on the route to be decorated.
 */
export const ParmasValidator = (paramsClass) => {
    return function (target) {
        if (Object.getPrototypeOf(target.prototype).constructor.name !== IParams.name) {
            throw new Error(`Decorated paramClass ${target.name} must extend IParams`);
        }
        ;
        registeredParamValidators[paramsClass.name] = target;
    };
};
