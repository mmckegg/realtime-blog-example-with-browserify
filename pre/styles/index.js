var $ = require('tree-query')
var microCss = require('micro-css')

module.exports = function(res, req){
  $(__dirname + '/*.mcss').readFile().collect(function(err, array){
    if (err) return cb(err)
    var result = microCss(array.join('\n'))
    req.writeHead(200, {'content-type': 'text/css'})
    req.end(result)
  })
}