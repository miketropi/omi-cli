const { PATH_AUTH_LOG } = require('../../config')();

module.exports = {
  name: 'logout',
  description: 'Authentication',
  run: async toolbox => {
    const {
      filesystem,
      print: { success, error }
    } = toolbox

    let path = PATH_AUTH_LOG;
		if (filesystem.exists(path)) {
			filesystem.remove(path);
			success('Logout successful.');
		} else {
			success('You are not logged in.');
		}
  },
};