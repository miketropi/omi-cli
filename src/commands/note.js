const timeago = require('timeago.js');

module.exports = {
  name: 'note',
  description: 'Note API',
  run: async toolbox => {
    const {
      noteAPI,
      isAuth,
      parameters,
      filesystem,
      print: { success, error, table, info }
    } = toolbox

    const auth = await isAuth();
    if(!auth) {
      error(`Please login.`);
      return;
    }
    
    const { user } = auth;
    const action = parameters.first;
    const { NOTE_ADD, NOTE_PUBLIC, NOTE_LIST } = noteAPI;
    const readFile = (path) => {
      return filesystem.read(path);
    }

    switch(action) {
      case 'add':
        /**
         * n: Name
         * p: path
         * m: message
         */
        const { n, p, m } = parameters.options;
        const noteID = await NOTE_ADD({
          "name": n,
          "content": m ?? readFile(p),
          "lastUpdated": user,
          "createDate": new Date(),
        });

        await NOTE_PUBLIC({ id: noteID });
        success(`Added Note successfully! ID: ${ noteID }`);
        break;

      case 'edit':
        break;

      case 'delete':
        break;

      case 'show':
        break;

      case 'list':
        const { notes, total } = await NOTE_LIST();
        if(!notes || notes.length == 0) {
          success(`No item.`);
          return;
        }

        let tablePrint = [];

        // label
        tablePrint.push(Object.keys(notes[0].node).map( l => l.toUpperCase() ));
        
        // items
        notes.map(_n => {
          _n.node.createDate = timeago.format(_n.node.createDate);
          tablePrint.push(Object.values(_n.node));
        })

        info('---------------------------------');
        success(`****** Had found ${ total } Note(s) ******`);
        info('---------------------------------');
        table(
          tablePrint,
          { format: 'markdown' },
        )
        break;

      case 'search':
        break;
    }
  },
};