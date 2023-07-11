const request = require('request');
const { AUTH_URL, PATH_AUTH_LOG } = require('../../config')();

module.exports = {
  name: 'auth',
  description: 'Authentication',
  run: async toolbox => {
    const {
      parameters,
      isAuth,
      filesystem,
      print: { success, error }
    } = toolbox

    let isLoggedin = await isAuth();
    
    if(isLoggedin != false) {
      success(`You are logged in with "${ isLoggedin.user }", logout and try again!`);
      return;
    }

    const { first, second } = parameters;

    if (!first || !second) {
			error('Please provide username and password');
			success('Usage: omi auth <username> <password>');
			return false;
		}

    request.post({
			url: AUTH_URL,
			form: {
				user: first,
				pass: second,
			}
		}, (err, res, body) => {
			if(res.statusCode === 200 && body === 'Auth successful!!!') {
				success('Auth successful.');
				const authBody = JSON.stringify({
					user: first,
					pass: second,
				});

				filesystem.write(PATH_AUTH_LOG, authBody);
			} else {
				error('Auth failed!!!');
			}
		});
  },
};