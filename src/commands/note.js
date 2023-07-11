const { PATH_AUTH_LOG } = require('../../config')();

module.exports = {
  name: 'note',
  description: 'Note API',
  run: async toolbox => {
    const {
      noteAPI,
      isAuth,
      print: { success, error }
    } = toolbox
    const auth = await isAuth();

    
  },
};