const noteAPI = require('../helpers/api/note')();

module.exports = (toolbox) => {
  const { filesystem, print: { success, error } } = toolbox;
  toolbox.noteAPI = noteAPI;
};