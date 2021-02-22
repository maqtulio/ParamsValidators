import { Application, Request, Response } from "express";
import { IParams } from "./IParams.js"
import { registeredParamValidators } from './decorators.js';
import Joi from "joi";
import { RouteDefinition } from "./RouteDefinition.js";


export function validate(params: any, options: Joi.ValidationOptions | undefined): Joi.ValidationResult {

    const paramClassName = params.constructor.name;
    if (!(params instanceof IParams) || !Object.keys(registeredParamValidators).includes(paramClassName)) {
        throw new Error(`Please decorate your params and extend IParams => ${paramClassName}.`)
    }

    return registeredParamValidators[paramClassName].validate(params, options);
}

export function registerControllers(commonPath: string, server: Application, controllers: any[]): void {
    controllers.forEach(controller => {
        const instance: any = new controller();
        // The prefix saved to our controller
        const prefix = Reflect.getMetadata('prefix', controller);
        // Our `routes` array containing all our routes for this controller
        const routes: { [key: string]: RouteDefinition } = Reflect.getMetadata('routes', controller);

        // Iterate over all routes and register them to our express application 
        Object.keys(routes).forEach(methodName => {
            // It would be a good idea at this point to substitute the `app[route.requestMethod]` with a `switch/case` statement
            // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
            // this should be enough for now.
            const httpMethod = routes[methodName].requestMethod;
            const path = routes[methodName].path;

            server[httpMethod](commonPath + prefix + path, (req: Request, res: Response) => {
                // Execute our method for this path and pass our express request and response object.
                instance[methodName](req, res);
            });
        });
    })
}

export { IParams } from "./IParams.js"
export { ParamsValidator, Controller, Method, Path } from './decorators.js';