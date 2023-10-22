const Company = require("../models/model.company");
const User = require("../models/model.user");
const verifyOwners = (verifierId, Model) => {
  return async (req, res, next) => {
    try {
      const owner = req.id;
      if (!owner) return res.status(400).json("you must Login first");
      const isValid = mongoose.Types.ObjectId.isValid(req.params[verifierId]);
      if (!isValid)
        return res.status(400).json({ error: "invalid params(owner)" });
      let document = await Model.findById(req.params[verifierId])
        .select({ owner: 1 })
        .lean()
        .exec();
      if (!document) return res.status(400).json("! invalid document (owner)");
      if (document.owner.toString() !== owner._id.toString())
        return res.status(401).json("you are not the owner");
      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
};

module.exports = { verifyOwners };
