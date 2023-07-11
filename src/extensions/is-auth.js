const { PATH_AUTH_LOG } = require('../../config')();

module.exports = (toolbox) => {
  const { filesystem, print: { success, error } } = toolbox;

  async function isAuth() {
    const _auth = await new Promise((resolve, reject) => {
      if (filesystem.exists(PATH_AUTH_LOG)) {
        const { user, pass } = filesystem.read(PATH_AUTH_LOG, 'json');
        resolve({ user, pass });
      } else {
        resolve(false)
      }
    });
    
    return _auth;
  }

  toolbox.isAuth = isAuth
};