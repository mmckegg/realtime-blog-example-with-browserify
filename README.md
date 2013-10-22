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

## My node journey. 

Came for websockets and shared code, but it was node modules that got me hooked. 

```
var thing = require('./thing')
// IT'S SO COOL
```

No more silly file <-> module mapping and global variables. No more faux-private underscore functions! 

I can build tiny machines that all feed into each other. 

When every part can stand alone, no longer have to keep the entire project in my head. Just remember the inputs and outputs of each part. 

I want this in the browser!

I tried a couple of projects before I came across Browserify. But it was browserify that stuck. 

Writing apps with browserify is exactly the same as writing server. You have require and you have NPM. Also most of the node apis are included with browserify so most NPM packages just work. Almost every node.js API now has an equivalent browser API. The browser even has a FileSystem API now. 


## Modules Used in Presentation

- [**browserify**](https://github.com/substack/node-browserify) bundles Node code up for the browser
- [**context-server**](https://github.com/mmckegg/context-server) streams changes between server and browser
- [**brfs**](https://github.com/substack/brfs) transforms `fs.readFileSync` to inline
- [**become**](https://github.com/mmckegg/become) provides partial page updates
- [**dom-behavior**](https://github.com/mmckegg/dom-behavior) allows us to hook DOM events
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

Since we can now run any of our server code in the browser, we could use the same code we used to render our page initially (/views/index.js) but in the browser.

```js
// browser.js
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

And to finish things off, we made the site editable.

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