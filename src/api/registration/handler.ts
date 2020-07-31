import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import {OAuth2Client} from 'google-auth-library';
import KeyValueConfig from '../../config/keyvalueConfig';
/*import MakeskillsectorNew from '../../config/makeskillsectorNew';
import UploadData from '../../config/uploadData';
import CityConfig from '../../config/cityConfig';
import Makeskillsector from '../../config/makeskillsector';
import Verifycountry from '../../config/verifycountry';
import Verifyenjson from '../../config/verifyenjson';*/

import EXTERNALIZED_STRING from '../../assets/string-constants';
import Utils from '../../helper/utils';

const PUBSUB_VERIFICATION_TOKEN = Utils.getEnvVariable('PUBSUB_VERIFICATION_TOKEN', true);
const STRING = EXTERNALIZED_STRING.registration;
const authClient = new OAuth2Client();

export default class Handler {

    public static keyValue = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            return KeyValueConfig.keyvalue;
           // return CityConfig.getCityArray1();
            // return Makeskillsector.getSector();
           // return Makeskillsector.getSkillSector();
            //  return Makeskillsector.getSkill();
            //  return Verifycountry.verifyUniqueDistrict();
            //  return Verifyenjson.verifyEn('hi');
           // return MakeskillsectorNew.makeSkillSector();
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

  /*  public static addskill = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            /!*await UploadData.verifySkill();
            return 'ok';*!/
          /!*  const res: any = await UploadData.verifyEmployee();*!/
            const res: any = await UploadData.changeAdmin();
            return res;
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };*/

    public static messaging = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            Logger.info('messaging request start');
            if (request.query.token !== PUBSUB_VERIFICATION_TOKEN) {
                Logger.info('messaging request end with error1');
                return Boom.badData('Invalid request');
            }
            Logger.info(`${JSON.stringify(request.payload)}`);
            Logger.info(`${JSON.stringify(request.headers)}`);
            try {
                const bearer = request.headers.authorization;
                const [, token] = bearer.match(/Bearer (.*)/);
                const ticket = await authClient.verifyIdToken({
                    idToken: token,
                    audience: 'mosahaya.com'
                });
            } catch (e) {
                Logger.info('messaging request end with error2');
                Logger.error(`${e}`);
                return Boom.badData('Invalid token');
            }
            const payload: any = request.payload;
            const message = Buffer.from(payload.message.data, 'base64').toString(
                'utf-8'
            );

            return 'ok';
        } catch (error) {
            Logger.info('messaging request end with error3');
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public static create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const modal: Model<any> = connection.model('registration');
            const payload: any = request.payload;
            payload.generalData.dob = new Date(payload.generalData.dob).setHours(0, 0, 0, 0);
            const newModal: any = new modal(payload);
            const data: any = await newModal.save();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CRAETING);
            }
            return {message: EXTERNALIZED_STRING.global.CREATED_SUCCESSFULLY, data};
        } catch (error) {
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public static viewForm = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const modal: Model<any> = connection.model('registration');
            const query: any = request.query;
            query.dob = new Date(query.dob).setHours(0, 0, 0, 0);
            const data: any = await modal.findOne({_id: request.params.id, 'generalData.dob': query.dob}).exec();
            if (!data) {
                return Boom.badData(STRING.INVALID_ID_DOB);
            }
            return {message: EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            if (error.name === 'CastError') {
                return Boom.badData(STRING.INVALID_ID_DOB);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
