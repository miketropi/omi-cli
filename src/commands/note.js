const { PATH_AUTH_LOG } = require('../../config')();

module.exports = {
  name: 'note',
  description: 'Note API',
  run: async toolbox => {
    const {
      noteAPI,
      isAuth,
      parameters,
      print: { success, error }
    } = toolbox
    const auth = await isAuth();
    if(!auth) {
      error(`Please login.`);
      return;
    }
    
    const { user } = auth;

    console.log(user, parameters);
  },
};