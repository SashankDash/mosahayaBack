import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import {sign} from 'jsonwebtoken';
import Logger from '../../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
import Utils from '../../../helper/utils';
const STRING: any = EXTERNALIZED_STRING.business.businessUser;
const JWT_PRIVATE_KEY: string = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);
const NODE_ENV: string = Utils.getEnvVariable('NODE_ENV', true);

class Handler {
    public checkEmailExist = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            if (NODE_ENV !== 'development') {
                const captchaResponse: any = request.pre.captcha;
                if (!(captchaResponse.action === 'business_signup' && captchaResponse.score >= 0.4)) {
                    return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
                }
            }
            const {email}: any =  request.query;
            let emailExist: boolean = false;
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findOne({email}).select('_id').exec();
            if(data){
                emailExist = true;
            }
            return {emailExist};
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.PHONE_NUMBER_EXIST);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public signup = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            if (NODE_ENV !== 'development') {
                const captchaResponse: any = request.pre.captcha;
                if (!(captchaResponse.action === 'business_signup' && captchaResponse.score >= 0.4)) {
                    return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
                }
            }
            const payload: any =  request.payload;
            const modal: Model<any> = connection.model('businessuser');
            payload.password = Utils.encrypt(payload.password);
            payload.password_changed_at = new Date();
            payload.emailVerified = true;
            const newModal: any = new modal(payload);
            const data: any = await newModal.save();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
            }
            const tokenData: any = {
                email: data.email,
                scope: data.scope,
                id: data._id,
                password_changed_at: data.password_changed_at
            };
            return {message: STRING.success.SIGNUP_SUCCESSFUL, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    phoneNumber: data.phoneNumber,
                    name: data.name
                }};
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.error.EMAIL_ALREADY_TAKEN);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public signin = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            if (NODE_ENV !== 'development') {
                const captchaResponse: any = request.pre.captcha;
                if (!(captchaResponse.action === 'business_signin' && captchaResponse.score >= 0.4)) {
                    return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
                }
            }
            const payload: any = request.payload;
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findOne({email:payload.email}).select('password name email emailVerified active scope password_changed_at').exec();
            if(!(data && Utils.comparePassword(payload.password, data.password))){
                return Boom.badData(STRING.error.INVALID_LOGIN);
            }
            if(!data.emailVerified){
                return Boom.badData(STRING.error.EMAIL_NOT_VERIFIED);
            }
            if(!data.active){
                return Boom.badData(STRING.error.INACTIVE_USER);
            }
            const tokenData: any = {
                email: data.email,
                scope: data.scope,
                id: data._id,
                password_changed_at: data.password_changed_at
            };
            return {message: STRING.success.SIGNIN_SUCCESSFUL, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    email: data.email,
                    name: data.name,
                    isAdmin: data.scope.includes('admin')
                }};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public verifyToken = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const credentials: any = request.auth.credentials;
            return { validToken:true, profileFilled: credentials.profileFilled};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public changePassword = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const payload: any = request.payload;
            if (payload.currentPassword === payload.newPassword) {
                return Boom.notAcceptable(STRING.error.SAME_PASSWORD);
            }
            const credentials: any = request.auth.credentials;
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findById(credentials.id).select('password name email emailVerified active scope password_changed_at').exec();
            if(!(data && Utils.comparePassword(payload.currentPassword, data.password))){
                return Boom.badData(STRING.error.PASSWORD_NOT_MATCHED);
            }
            data.password = Utils.encrypt(payload.newPassword);
            data.password_changed_at = new Date();
            const result: any = await data.save();
            if (!result) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
            }
            const tokenData: any = {
                email: result.email,
                scope: result.scope,
                id: result._id,
                password_changed_at: result.password_changed_at
            };
            return {message: STRING.success.PASSWORD_CHANGE_SUCCESSFUL, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    email: result.email,
                    name: result.name,
                    isAdmin: result.scope.includes('admin')
                }};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}

export default new Handler();
