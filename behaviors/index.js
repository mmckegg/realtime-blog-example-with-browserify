var behave = require('dom-behavior')
var morph = require('dom-morph')

var Editor = require('../editors')

var behaviors = {
  'post/edit': function(element){
    element.onclick = function(){
      var postElement = document.querySelector('.Post')
      var object = window.context.get('post')
      console.log('>>>', object)
      var editor = Editor('post', object, function(action, updatedObject){
        if (action == 'save') window.context.pushChange(updatedObject)
        unmorph()
      })
      var unmorph = morph(postElement, editor)
      return false
    }
  },
  'comment/edit': function(element){
    element.onclick = function(){
      var commentElement = element.parentElement.parentElement.parentElement
      var object = window.context.get(element.getAttribute('data-query'))
      var editor = Editor('comment', object, function(action, updatedObject){
        if (action == 'save') window.context.pushChange(updatedObject)
        unmorph()
      })
      var unmorph = morph(commentElement, editor)
      return false
    }
  },
  'post/new': function(element){
    element.onclick = function(){
      return false
    }
  },
  'comment/new': function(element){
    element.onclick = function(){
      return false
    }
  }
}

module.exports = function(rootElement){
  return behave(behaviors, rootElement)
}