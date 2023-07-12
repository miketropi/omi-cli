const fetch = require('node-fetch');
const { ENDPOINT, TOKEN } = require('../../../config')();

const _Request = async (query, variables = {}, method = 'POST') => {
  const result = await fetch(ENDPOINT, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  
  return await result.json();
}

module.exports = () => {
  return {
    NOTE_ADD: async (variables) => {
      const Q = `mutation createNote($name:String!, $content:String,$createDate:DateTime, $lastUpdated:String) {
        createNote(data: {name: $name, content: $content, createDate: $createDate, lastUpdated: $lastUpdated}) {
          id
        }
      }`;

      try {
        const result = await _Request(Q, variables);
        return result.data.createNote.id;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    NOTE_LIST: async (variables) => {
      let _variables = {
        search: '',
        ...variables
      }
      const Q = `query Notes($search: String) {
        notesConnection(orderBy: createdAt_DESC, first: 500, skip: 0, where: {_search: $search}) {
          edges {
            node {
              id
              name
              lastUpdated
              createDate
            }
          }
          aggregate {
            count
          }
        }
      }`;

      try {
        const result = await _Request(Q, _variables);

        return {
          notes: result.data.notesConnection.edges,
          total: result.data.notesConnection.aggregate.count
        };
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    NOTE_SHOW: async (variables) => {
      const Q = `query Note($id: ID) {
        note(where: {id: $id}) {
          id
          name
          createDate
          content
          lastUpdated
        }
      }`;

      try {
        const result = await _Request(Q, variables);
        return result.data.note;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    NOTE_EDIT: async function(variables) {
      let Q = () => {
        let { id, ...args } = variables;
        let v = Object.keys(args).map(_k => `$${ _k }:String`).join(', ');
        let d =  Object.keys(args).map(_k => `${ _k }: $${ _k }`).join(', ');
        return `mutation NoteUpdate(${ v }, $id:ID) {
          updateNote(
            data: {${ d }}, 
            where: {id: $id}
          ) {
            id
          }
        }`
      }

      try {
        const result = await _Request(Q(), variables);
        return result.data.updateNote.id;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    NOTE_DELETE: async function(variables) {
      const Q = `mutation NoteDelete($id:ID) {
        deleteNote(where: {id: $id}) {
          id
        }
      }`;

      try {
        const result = await _Request(Q, variables);
        return result.data.deleteNote.id;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    NOTE_PUBLIC: async (variables) => {
      const Q = `mutation NotePublish($id:ID) {
        publishNote(where: {id: $id}) {
          id
        }
      }`;

      try {
        const result = await _Request(Q, variables);
        return result.data.publishNote.id;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}