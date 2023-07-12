const timeago = require('timeago.js');

const noteEditQuestions = () => {
  return [
    { 
      type: 'input', 
      name: 'id', 
      message: 'Enter note ID edit?:' 
    },
    {
      type: 'radio',
      name: 'editField',
      message: 'Select field edit?',
      choices: ['name', 'content'],
      default: 'content'
    },
    { 
      type: 'input', 
      name: 'value', 
      message: 'Enter text or path file:' 
    },
  ]
}

module.exports = {
  name: 'note',
  description: 'Note API',
  run: async toolbox => {
    const {
      noteAPI,
      isAuth,
      parameters,
      filesystem,
      prompt,
      print: { success, error, table, info }
    } = toolbox

    const auth = await isAuth();
    if(!auth) {
      error(`Please login.`);
      return;
    }
    
    const { user } = auth;
    const action = parameters.first;
    const { NOTE_ADD, NOTE_PUBLIC, NOTE_LIST, NOTE_SHOW, NOTE_EDIT, NOTE_DELETE } = noteAPI;
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
        {
          const questions = noteEditQuestions();
          const { id, editField, value } = await prompt.ask(questions);

          const noteID = await NOTE_EDIT({
            id,
            [editField]: value,
            lastUpdated: user,
          });

          await NOTE_PUBLIC({ id: noteID });
          success(`Updated Note successfully! ID: ${ noteID }`);
        }
        break;

      case 'delete':
        {
          const id = parameters.second;
          const noteID = await NOTE_DELETE({ id });
          success(`Deleted Note successfully! ID: ${ noteID }`);
        }
        break;

      case 'show':
        {
          const id = parameters.second;
          const noteData = await NOTE_SHOW({ id });
          success(noteData);
        }
        break;

      case 'list':
        {
          const { s } = parameters.options;
          const { notes, total } = await NOTE_LIST({
            search: s ?? ''
          });

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

          success(`Had found ${ total } Note(s)${ s ? ` with keyworks: "${ s }"` : '' }\n`);
          table(
            tablePrint,
            { format: 'markdown' },
          )
        }
        break;
      default:
        success('... not found action')
        break;
    }
  },
};