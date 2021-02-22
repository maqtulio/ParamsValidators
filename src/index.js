import { IParams } from "./IParams.js";
import { registeredParamValidators } from './decorators.js';
export function validate(params, options) {
    const paramClassName = params.constructor.name;
    if (!(params instanceof IParams) || !Object.keys(registeredParamValidators).includes(paramClassName)) {
        throw new Error(`Please decorate your params and extend IParams => ${paramClassName}.`);
    }
    return registeredParamValidators[paramClassName].validate(params, options);
}
export { IParams } from "./IParams.js";
export { ParamsValidator, Controller, Method, Path } from './decorators.js';
