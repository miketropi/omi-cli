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
      const Q = `query Notes {
        notesConnection(orderBy: createdAt_DESC, first: 500, skip: 0) {
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
        const result = await _Request(Q, variables);
        
        return {
          notes: result.data.notesConnection.edges,
          total: result.data.notesConnection.aggregate.count
        };
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