// server.js /////////////////////////////////////
var Server = require('http').createServer
var Router = require('routes-router')
var ContextServer = require('context-server') // <-
var browserify = require('browserify')  // <-

var db = require('./database')
var respondCss = require('./styles'), render = require('./views')

var router = Router()
var server = Server(router)
var contextServer = ContextServer(server, {endpoint: '/contexts'}) // <-

function respond(res, matcherRefs, data){
  db.generate({data: data, matcherRefs: matcherRefs}, function(err, datasource){
    contextServer.add(datasource) // <-
    console.log(datasource.data)
    res.end(render(datasource).toHtml())
  })
}

router.addRoute('/', function(req, res){
  respond(res, ['posts'], { view: 'index' })
})

router.addRoute('/posts/:id', function(req, res, opts){
  respond(res, ['post', 'postComments'], { view: 'post', postId: opts.params.id })
})

router.addRoute('/bundle.js', function(req, res){                            //
  res.writeHead(200, {'content-type': 'application/javascript'})             // <-
  browserify('./browser').transform('brfs').bundle({debug: true}).pipe(res)  // <-
})                                                                           //

router.addRoute('/styles.css', respondCss)   

server.listen(9876)
console.log('Navigate to http://localhost:9876')