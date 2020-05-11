import Config from '../config/config';
import Logger from '../helper/logger';
import {connection, connect, ConnectionOptions} from 'mongoose';
import registration from '../model/registration';
import Utils from '../helper/utils';

const NODE_ENV = Utils.getEnvVariable('NODE_ENV', false);

export default class Db {
    public static async connect() {
        try {
            connection.setMaxListeners(0);
            connection.on('error', (err) => {
                Logger.error('MongoDB event error: ${error}');
            });

            connection.on('connected', () => {
                Logger.info('MongoDB event connected');
            });

            connection.on('disconnected', () => {
                Logger.info('MongoDB event disconnected');
            });

            connection.on('reconnected', () => {
                Logger.info('MongoDB event reconnected');
            });

            connection.on('open', () => {
                Logger.info('Connection with database succeeded');
            });
            if (NODE_ENV === 'development') {
                await connect('mongodb://' + Config.database.username + ':' + Config.database.password + '@' + Config.database.host + ':' + Config.database.port + '/' + Config.database.name + '?authSource=admin',
                    Config.databaseOptions as ConnectionOptions
                );
            } else {
                await connect('mongodb://' + Config.database.username + ':' + Config.database.password + '@' + Config.database.host + ':' + Config.database.port + '/' + Config.database.name,
                    Config.databaseOptions as ConnectionOptions
                );
            }

        } catch (error) {
            Logger.error(`Error in connecting database: ${error}`);
            throw error;
        }

    };

    public static addModals = (): void => {
        Db.models.registration = registration;
    };

    public static models: any = {};
};
