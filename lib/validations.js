var Joi = require('joi');

module.exports = {

	//This is horrible looking but it works perfectly
	//must attempt to reformat...
	exercise: Joi.array().items(Joi.object().keys({
                id: Joi.string().required(),
                name: Joi.string().required(),
                category: Joi.string().valid('Resistance').required(),
                sets: Joi.array().items(Joi.object().keys({
                  weight: Joi.number().precision(3).default(0),
                  reps: Joi.number().integer().min(1).required(),
                  unit: Joi.string().valid('lbs', 'kgs').required()
                })).required().min(1)
              }), Joi.object().keys({
                id: Joi.string().required(),
                name: Joi.string().required(),
                category: Joi.string().valid('Cardio').required(),
                distance: Joi.number().positive().required(),
                time_ms: Joi.number().positive().min(1).required(),
                unit: Joi.string().valid('mi', 'm', 'km').required()
              })).required().min(1)
}