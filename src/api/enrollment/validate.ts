import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../config/keyvalueConfig';
import CityConfig from '../../config/cityConfig';

export default {
    create: {
        payload: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
            generalData:Joi.object().keys({
                registerBy:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('registerBy')),
                name:Joi.string().required().trim().min(1).max(1000),
                age:Joi.number().required().integer().min(1).max(150),
                gender:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('gender')),
                mobileNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
                pinCode:Joi.string().required().trim().length(6).pattern(/^([1-9])([0-9]){5}$/),
                address:Joi.string().trim().min(1).max(100000)
            }).required(),
            skillData:Joi.object().keys({
                skills:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('skills'))),
                skillsOther:Joi.string().trim().min(1).max(10000),
                sectors:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('sectors'))),
                sectorsOther:Joi.string().trim().min(1).max(10000),
                experience: Joi.object().keys({
                    expYear:Joi.number().integer().min(0).max(150),
                    expMonth:Joi.number().integer().min(0).max(11)
                }),
                education:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('education')),
                preferredLocations:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...CityConfig.getCityArray())),
                preferredLocationsOther:Joi.string().trim().min(1).max(10000),
                otherInfo:Joi.string().trim().min(1).max(100000)
            }).required(),
            healthData:Joi.object().keys({
                currentCondition:Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('currentCondition'))),
                currentConditionOther:Joi.string().trim().min(1).max(10000),
                symptoms:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('symptoms'))),
                symptomsOther:Joi.string().trim().min(1).max(10000)
            })
        }).required()
    },
    findall: {
        query: Joi.object().keys({
            page: Joi.number().integer().min(0).max(500000).required(),
            limit: Joi.number().integer().positive().min(1).max(1000).required(),
            skills:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('skills'))).single(),
            skillsOther:Joi.array().min(0).max(1000).items(Joi.string().required()).single(),
            sectors:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('sectors'))).single(),
            sectorsOther:Joi.array().min(0).max(1000).items(Joi.string().required()).single(),
            preferredLocations:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...CityConfig.getCityArray())).single(),
            preferredLocationsOther:Joi.array().min(0).max(1000).items(Joi.string().required()).single(),
            expFrom:Joi.number().integer().min(0).max(150),
            expTo:Joi.number().integer().min(0).max(150),
            education:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('education'))).single(),
            registerBy:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('registerBy'))).single(),
            mobileNumber:Joi.array().min(0).max(1000).items(Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/)).single(),
            enrollmentID:Joi.array().min(0).max(1000).items(Joi.string().required().trim().length(16).pattern(/^[0-9]+$/)).single(),
            name:Joi.array().min(0).max(1000).items(Joi.string().required()).single(),
            gender:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('gender'))).single(),
            ageFrom:Joi.number().integer().min(0).max(150),
            ageTo:Joi.number().integer().min(0).max(150),
            pinCode:Joi.array().min(0).max(1000).items(Joi.string().required().trim().length(6).pattern(/^([1-9])([0-9]){5}$/)).single(),
            currentCondition:Joi.string().valid('yes','no'),
            symptoms:Joi.string().valid('yes','no'),
            createdAtFrom:Joi.date().iso().max('now'),
            createdAtTo:Joi.date().iso().max('now')
        }).required()
    },
    viewForm: {
        params: Joi.object({
            id: Joi.string().required().trim().length(16),
            grecaptcharesponse:Joi.string().required().trim().min(1).max(10000)
        }).required()
    }
};
