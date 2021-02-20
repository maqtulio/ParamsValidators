import { IParams } from "./IParams.js"
import { registeredParamValidators } from './decorators.js';


export function validate(paramClass: any, params: any, options: any) {

    if (!(params instanceof IParams) || !Object.keys(registeredParamValidators).includes(params.constructor.name)) {
        throw new Error(`Please decorate your params and extend IParams => ${params.constructor.name}.`)
    }

    return registeredParamValidators[paramClass.name].validate(params,options);
}

export { IParams } from "./IParams.js"
export { registeredParamValidators } from './decorators.js';