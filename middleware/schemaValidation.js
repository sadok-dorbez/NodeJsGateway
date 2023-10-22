module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      const validbody = await schema.validate(req.body);
      req.body = schema.cast(validbody, { stripUnknown: true });
      return next();
    } catch (err) {
      res.status(400).json({ error: { path: err.path, msg: err.message } });
    }
  };
};
