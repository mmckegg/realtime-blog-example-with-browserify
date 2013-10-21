var View = require('rincewind')
var fs = require('fs')

var formatters = require('./formatters')

var master = View(fs.readFileSync(__dirname + '/master.html', 'utf8'), 'master')
var views = {
  'index': View(fs.readFileSync(__dirname + '/index.html', 'utf8'), {
    name: 'index',
    master: master
  }),

  'post': View(fs.readFileSync(__dirname + '/post.html', 'utf8'), {
    name: 'post',
    master: master
  }),

  'post-editor': View(fs.readFileSync(__dirname + '/post-editor.html', 'utf8')),
  'comment-editor': View(fs.readFileSync(__dirname + '/comment-editor.html', 'utf8'))
}

module.exports = function(datasource, view){

  var getter = function(query, templateContext){
    return datasource.get(query, templateContext.source, templateContext)
  }

  var result = views[view || datasource.data.view](getter, {formatters: formatters})
  return result
}

