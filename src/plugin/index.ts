import * as Hapi from '@hapi/hapi';
import goodWinston from 'hapi-good-winston';
import Config from '../config/config';
import Logger from '../helper/logger';
import Utils from '../helper/utils';

const NODE_ENV = Utils.getEnvVariable('NODE_ENV', true);
const LOG_LEVEL = Utils.getEnvVariable('LOG_LEVEL', false);

export default class Plugins {

    public static async registerAll(server: Hapi.Server): Promise<Error | any> {
        try {
            await Plugins.inert(server);
            if (NODE_ENV === 'development') {
                await Plugins.vision(server);
                await Plugins.swagger(server);
                Logger.info(`Visit: ${server.info.uri}/documentation for Swagger docs`);
            }
            await Plugins.good(server);
            if (LOG_LEVEL === 'debug') {
                server.ext({
                    type: 'onRequest',
                    method (request: Hapi.Request, h: Hapi.ResponseToolkit) {
                        if (request.url.pathname.substring(1, 10) === 'swaggerui' || request.url.pathname === '/documentation' || request.url.pathname === '/health' || request.url.pathname === '/swagger.json') {
                            return h.continue;
                        }
                        Logger.debug('***** Request start *****');
                        Logger.debug(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.pathname);
                        Logger.debug('Request header:', request.headers);
                        Logger.debug('Request payload:', request.payload);
                        Logger.debug('Request params:', request.params);
                        Logger.debug('***** Request end *****');
                        return h.continue;
                    }
                });
                server.events.on('response', (request: Hapi.Request) => {
                    if (request.url.pathname.substring(1, 10) === 'swaggerui' || request.url.pathname === '/documentation' || request.url.pathname === '/health' || request.url.pathname === '/swagger.json') {
                        return;
                    }
                    Logger.debug('***** Response start *****');
                    // @ts-ignore
                    Logger.debug(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.pathname + ' --> ' + (request.response && request.response.statusCode ? request.response.statusCode : ''));
                    // @ts-ignore
                    Logger.debug('Response payload:', (request.response && request.response.source) ? request.response.source : '');
                    Logger.debug('***** Response end *****');
                });
            }
        } catch (error) {
            Logger.error(`Error in registering plugins: ${error}`);
            throw error;
        }

    }
    private static async vision(server: Hapi.Server): Promise<Error | any> {
        try {
            Logger.info('Plugins - Registering vision');
            await Plugins.register(server, [
                require('@hapi/vision')
            ]);
        } catch (error) {
            Logger.error(`Plugins - Ups, something went wrong when registering vision plugin: ${error}`);
            throw error;
        }
    }
    private static async inert(server: Hapi.Server): Promise<Error | any> {
        try {
            Logger.info('Plugins - Registering inert');
            await Plugins.register(server, [
                require('@hapi/inert')
            ]);
        } catch (error) {
            Logger.error(`Plugins - Ups, something went wrong when registering inert plugin: ${error}`);
            throw error;
        }
    }

    private static async swagger(server: Hapi.Server): Promise<Error | any> {
        try {
            Logger.info('Plugins - Registering hapi-swagger');
            await Plugins.register(server, [
                {
                    options: Config.swagger.options,
                    plugin: require('hapi-swagger')
                }
            ]);
        } catch (error) {
            Logger.error(`Plugins - Ups, something went wrong when registering hapi-swagger plugin: ${error}`);
            throw error;
        }
    }

    private static async good(server: Hapi.Server): Promise<Error | any> {
        try {
            Logger.info('Plugins - Registering good');

            const goodWinstonOptions: object = {
                levels: {
                    request: 'debug',
                    response: 'debug',
                    error: 'error'
                }
            };
            const options: object = {
                ops: false,
                includes: {
                    request: ['headers', 'payload'],
                    response: ['headers', 'payload']
                },
                reporters: {
                    winstonWithLogLevels: [
                        {
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{error: '*'}]
                        },
                        /*  {
                              module: 'good-squeeze',
                              name: 'SafeJson'
                          },
                          {
                              module: 'good-console'
                          },
                          'stdout'*/
                        goodWinston(Logger, goodWinstonOptions)
                    ]
                }
            };
            await Plugins.register(server, [{
                plugin: require('good'),
                options
            }]);
        } catch (error) {
            Logger.error(`Plugins - Ups, something went wrong when registering good: ${error}`);
            throw error;
        }
    }

    private static async register(server: Hapi.Server, plugin: any): Promise<Error | any> {
        return new Promise(async (resolve, reject) => {
            try {
                await server.register(plugin);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}
