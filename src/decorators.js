import "reflect-metadata";
import { IParams } from "./IParams.js";
export const registeredParamValidators = {};
/**
 * @name validationSchema ParamsClass used on the route to be decorated.
 */
export const ParamsValidator = (validationSchema) => {
    return function (target) {
        if (Object.getPrototypeOf(target.prototype).constructor.name !== IParams.name) {
            throw new Error(`Decorated paramClass ${target.name} must extend IParams`);
        }
        ;
        registeredParamValidators[target.name] = validationSchema;
    };
};
export const Controller = (prefix = '') => {
    return (target) => {
        Reflect.defineMetadata('prefix', prefix, target);
        // Since routes are set by our methods this should 
        //almost never be true (except the controller has no methods)
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', {}, target);
        }
    };
};
export const Method = (requestMethod) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be
        // registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', {}, target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        routes[propertyKey] = {
            ...routes[propertyKey],
            requestMethod,
            methodName: propertyKey
        };
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
export const Path = (path) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be
        // registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', {}, target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        routes[propertyKey] = {
            ...routes[propertyKey],
            path,
            methodName: propertyKey
        };
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
