// browser.js
var getContext = require('context-server/connect')
var become = require('become')

var render = require('./views')
var addBehaviors = require('./behaviors')

var dataFilters = require('./database/data-filters')

var bindingElement = document.getElementById('context')
var token = bindingElement.getAttribute('data-token')
var view = bindingElement.getAttribute('data-view')

// connect to server
window.context = getContext(token, {endpoint: '/contexts', dataFilters: dataFilters})

// add behaviors
var behave = addBehaviors(document)

// re-render page clientside when there is a change
window.context.on('change', function(object){
  console.log('changed!', object)
  become(document, render(window.context), {
    onChange: behave
  })
})