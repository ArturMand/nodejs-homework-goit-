const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateUser = (req, res, next) => {
  const userSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(3).max(20).required(),
  });
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
  }
  next();
};
const validateUpdateUser = (req, res, next) => {
  const userSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  }).min(1);
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
  }
  next();
};
const validateContact = (req, res, next) => {
  const userSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(5).max(30).required(),
    phone: Joi.string().min(3).max(20).required(),
  });
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
  }
  next();
};
const validateUpdateContact = (req, res, next) => {
  const userSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
  }
  next();
};

const validateObjectId = (req, res, next) => {
  const objectIdSchema = Joi.object({
    id: Joi.objectId(),
  });
  const result = objectIdSchema.validate(req.params);
  if (result.error) {
    res.status(400).send(result.error);
  }
  next();
};

module.exports = {
  validateUser,
  validateUpdateUser,
  validateContact,
  validateUpdateContact,
  validateObjectId,
};
