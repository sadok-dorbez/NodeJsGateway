const mongoose = require("mongoose");
const verifyDoc = (Model, id) => {
  return async (req, res, nxt) => {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(req.params[id]);
      if (!isValid) return res.status(400).json({ error: "invalid params" });
      let document = await Model.findById(req.params[id]).lean().exec();
      if (!document) return res.status(400).json("! invalid document");
      nxt();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
};

module.exports = { verifyDoc };
