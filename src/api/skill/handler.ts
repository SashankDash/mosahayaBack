import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../assets/string-constants';

export default class Handler {

    public static findall = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const captchaResponse: any = request.pre.captcha;
            if (!(captchaResponse.action === 'skill_findall' && captchaResponse.score >= 0)) {
                return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
            }
            const modal: Model<any> = connection.model('skill');
            const data: any[] = await modal.find().select('name');
            return {message: 'Skill ' + EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}