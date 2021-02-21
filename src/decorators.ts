import Joi from "joi";
import "reflect-metadata";
import { RouteDefinition } from './RouteDefinition.js';
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

export const Controller = (prefix: string = ''): ClassDecorator => {
    return (target: any) => {
      Reflect.defineMetadata('prefix', prefix, target);
  
      // Since routes are set by our methods this should 
      //almost never be true (except the controller has no methods)
      if (! Reflect.hasMetadata('routes', target)) {
        Reflect.defineMetadata('routes', [], target);
      }
    };
  };

  export const Method = (path: string, requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put' | "patch"): MethodDecorator => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey: any): void => {
        // In case this is the first route to be
        // registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod,
            path,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};