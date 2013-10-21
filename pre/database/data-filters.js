var strftime = require('strftime')

module.exports = {
  url: function(input, params){
    if (input && input.type == 'post'){
      return '/posts/' + input.id
    }
  },

  date: function(input, params){
    if (input){

      // normalize
      if (input.date){
        input = input.date
      }

      if (typeof input == 'string' || typeof input == 'number'){
        input = new Date(input)
      }

      return strftime('%d %B %Y at %l:%M%P', input)
    }
  },

  query: function(input, params){
    if (input && input.type == 'comment'){
      return 'comments[id=' + input.id + ']'
    }
  }
}