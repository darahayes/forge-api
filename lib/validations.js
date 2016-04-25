const Joi = require('joi');
const Moment = require('moment');

module.exports = {
	workouts: Joi.array()
    .items(
      Joi.object().keys({
        date: Joi.date().format('MM-DD-YYYY').default(Moment().format('MM-DD-YYYY')),
        exercises: Joi.array().items(
          Joi.object().keys({
            _id: Joi.string(),
            created_by: Joi.any().optional(),
            equipment: Joi.string(),
            name: Joi.string().required(),
            main_target: Joi.string().required(),
            tags: Joi.array().items(Joi.string()),
            sets: Joi.array()
              .items(
                Joi.object().keys({
                  weight: Joi.number().precision(3).default(0),
                  reps: Joi.number().integer().min(1).default(0),
                  unit: Joi.string().valid('lbs', 'kg').required()
                }))
              .required().min(1)
          })
        )
      }))
    .required().min(1)
}