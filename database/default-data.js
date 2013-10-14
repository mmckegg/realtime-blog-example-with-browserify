var db = require('./')

db.applyChanges([

  { 
    id: 'post-1',
    type: 'post',
    title: 'Browserify!', 
    date: 1381650899379,
    body: "I write a lot of browser JavaScript. 2 years ago I started writing server JavaScript. Initially I was excited about this because sharing code between the browser and sever could now be possible. But then I discovered something far far greater than that. That was the Node module system. \n\nModular apps. Lots of little machines that are standalone. Keep the interfaces as simple as possible. \n\nModular means you don't have to keep the entire app in your head. Just remember the inputs and output s. \n\nIn the early days, I tried a few browser package management/require tools before I discovered browserify. The interesting thing about it is that it just uses NPM. In fact it almost seamlessly makes browser programming identical to node programming. \n\nWhy NPM? So many NPM modules are already browser compatible. We want to use these in the browser anyway. The browser and Node are both V8 (or very similar if not Chrome or Opera). \n\nAlmost every node API now has a browser equivalent or can be shimmed without great difficulty. What I find interesting is a new flow back the other way. Shimming browser only APIs back into node. \n\nNode is basically just a headless browser - or you could say that the browser is a VM that uses Node for scripting and HTML+CSS for display."
  },

  {
    id: 'post-2',
    type: 'post', 
    title: 'Another Post',
    date: 1381540899379, 
    body: 'Some important Node.js info'
  },

  {
    id: 'comment-1',
    type: 'comment', postId: 'post-1', 
    name: 'Bobby Young', 
    date: 1381651126038,
    body: 'Nothing here makes sense!?', 
  },

  {
    id: 'comment-2',
    type: 'comment', postId: 'post-1', 
    name: 'Billy Oldman', 
    date: 1381651126038,
    body: 'Keep trying yo', 
  }

])
