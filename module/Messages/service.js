"use strict";
const Messages = require("./model");


module.exports = {
  
  save: async (data) => {
    const messageUser = new Messages(data);
    messageUser
      .save()
      .then(() => {
        console.log("message saved!");
      })
      .catch((error) => {
        console.error("Error saving message:", error);
      });
  },
  get: async (query) => {
    try {
      let messages = await Messages.find({ $or: [{ sender: query }, { receiver: query }] }).populate('sender');      return messages;
    } catch (e) {
      console.log("no messages found ", e);
      
    }
  }
};
