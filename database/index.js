// database.js
var connect = require('level')
var ContextDB = require('contextdb')

var connection = connect(__dirname + '/~DB', {encoding: 'json'})

module.exports = ContextDB(connection, {
  matchers: {

    'posts': {
      item: 'posts[id={.id}]', collection: 'posts',
      match: { type: 'post' },
      allow: { change: true }
    },

    'post': {
      item: 'post',
      match: { type: 'post', id: {$query: 'postId'} },
      allow: { change: true }
    },

    'postComments': {
      item: 'comments[id={.id}]',
      collection: 'comments',
      match: { type: 'comment', postId: {$query: 'postId'} },
      allow: { change: true }
    }

  },

  dataFilters: require('./data-filters.js'),
  primaryKey: 'id'

})