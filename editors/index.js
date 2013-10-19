var View = require('rincewind')
var fs = require('fs')
var Editor = require('former')

var views = {
  'comment': View(fs.readFileSync(__dirname + '/comment-editor.html', 'utf8')),
  'post': View(fs.readFileSync(__dirname + '/post-editor.html', 'utf8'))
}

module.exports = function(editorName, object, cb){

  var queryHandler = function(query, templateContext){
    return window.context.get(query, templateContext.source, templateContext)
  }

  var element = views[editorName](queryHandler, {source: object})[0]
  console.log(element.className)
  return Editor(element, object, cb)
}