// browser.js
var getContext = require('context-server/connect')
var become = require('become')

var render = require('./views')
var dataFilters = require('./database/data-filters')

var bindingElement = document.getElementById('context')
var token = bindingElement.getAttribute('data-token')
var view = bindingElement.getAttribute('data-view')


window.context = getContext(token, {endpoint: '/contexts', dataFilters: dataFilters})

// re-render page clientside when there is a change
window.context.on('change', function(){
  become(document, render(window.context))
})

window.h = require('rincewind/node_modules/hyperscript')