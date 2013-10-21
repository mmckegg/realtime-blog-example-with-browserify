var marked = require('marked')

var options = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true
}

module.exports = {
  markdown: function(input, templateContext){
    var wrapper = document.createElement('div')
    wrapper.innerHTML = marked(input, options)
    return wrapper
  }
}