Node.js in the Browser
===

(code from **October 2013 Node.js Wellington Meetup**)

---

To run the code you'll need the latest version of [Node (and NPM)](http://nodejs.org)

Then:

```bash
$ git clone https://github.com/mmckegg/realtime-blog-example-with-browserify.git
$ cd realtime-blog-example-with-browserify
$ npm install # install all the deps and set up default data
```

And activate:

```bash
$ npm start
```

Navigate to https://localhost:9876

## Modules Used in Presentation

- [**browserify**](https://github.com/substack/node-browserify) bundles Node code up for the browser
- [**context-server**](https://github.com/mmckegg/context-server) streams changes between server and browser
- [**brfs**](https://github.com/substack/brfs) transforms `fs.readFileSync` to inline
- [**become**](https://github.com/mmckegg/become) provides partial page updates
- [**dom-behavior**](https://github.com/mmckegg/dom-beavior) allows us to hook DOM events
- [**former**](https://github.com/mmckegg/former) populates form elements and gets changes
- [**dom-morph**](https://github.com/mmckegg/dom-morph) animates between two DOM elements

## More Modules

- [**supervisor**](https://github.com/isaacs/node-supervisor) automatically reloads Node app when code changes
- [**level**](https://github.com/Level/level) runs LevelDB inside your Node process
- [**contextdb**](https://github.com/mmckegg/contextdb) indexing and view creation from LevelDB
- [**routes-router**](https://github.com/Colingo/routes-router) match incoming requests and route to functions
- [**rincewind**](https://github.com/mmckegg/rincewind) pure html based templating engine

## Code from Demo

The starting code from the talk is located inside [/pre](./pre).

First thing we did was add [browserify](https://github.com/substack/node-browserify) to server.js

```js
var browserify = require('browserify')
```

And a browser.js file. 

Then we added a route so that the bundle would be served direct from our Node project:

```js
router.addRoute('/bundle.js', function(req, res) {
	res.writeHead(200, {'content-type': 'application/javascript'})
	browserify('./browser').transform('brfs').bundle().pipe(res)
})
```

We include the brfs transform so that files referenced in our views will be embedded in the final bundle.

Set up some socket stuff for streaming changes around:

```js
var ContextServer = require('context-server')
```

```js
// var server = http.createServer(router)
var contextServer = ContextServer(server)
```

Then hook the respond() function:

```js
// function respond(res, matcherRefs, data){
//  db.generate({data: data, matcherRefs: matcherRefs}, function(err, datasource){
      contextServer.add(datasource) // <-
//    res.end(render(datasource).toHtml())
//  })
// }
```

Let's get the token to the user:

```html
<!--/views/master.html-->
<body t:bind:data-token='token'>
	...
 </body>
```

Now in our browser.js:

```js
var getContext = require('context-server/connect')
var token = document.body.getAttribute('data-token')

window.context = getContext(token, {
  endpoint: '/database',   
  dataFilters: require('./database/data-filters.js')
})

var render = require('./views')
var become = require('become')


window.context.on('change', function(object){
  become(document, render(window.context))
})
```

And we'll add an edit button on posts:

```html
<!--/views/post.html-->
<menu type='list'>
	<button data-behavior='posts/editor'>Edit</button>
</menu>
```

Behavior in browser.js to match:

```js
var behave = require('dom-behavior')
var former = require('former')
var morph = require('dom-morph')

behave({
  'posts/editor': function(element){
    element.onclick = function(){
      var editor = render(window.context, 'post-editor')[0]
      var el = element.parentNode.parentNode.parentNode

      former(editor, window.context.get('post'), function(action, newObject){
        if (action == 'save'){
          window.context.pushChange(newObject)
        }
        unmorph()

      })

      var unmorph = morph(el, editor)
    }
  }
})
```