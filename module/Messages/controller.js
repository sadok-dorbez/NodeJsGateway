"use strict";
const MessageService = require("./service");

module.exports = {

  create: async (req, res) => {
    try {
      const msg = await MessageService.save(req.body);
      res.send(msg);
      res.status(200);
    } catch (e) {
      throw e;
    }
  },
  get: async (req, res) => {
    try {
      const msgs = await MessageService.get(req.params.id);
      res.send(msgs);
      res.status(200);
    } catch (e) { 
      console.log(e);
    }
  

    
  },

};
