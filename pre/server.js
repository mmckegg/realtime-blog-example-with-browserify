// server.js /////////////////////////////////////
var http = require('http')
var Router = require('routes-router')

var db = require('./database')

var respondCss = require('./styles'), render = require('./views')

var router = Router()
var server = http.createServer(router)

function respond(res, matcherRefs, data){
  db.generate({data: data, matcherRefs: matcherRefs}, function(err, datasource){
    res.end(render(datasource).toHtml())
  })
}

router.addRoute('/', function(req, res){
  respond(res, ['posts'], { view: 'index' })
})

router.addRoute('/posts/:id', function(req, res, opts){
  respond(res, ['post', 'postComments'], { view: 'post', postId: opts.params.id })
})

router.addRoute('/styles.css', respondCss)   

server.listen(9876)
console.log('Navigate to http://localhost:9876')