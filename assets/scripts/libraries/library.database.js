/* .........................................................................................................
  database
......................................................................................................... */
DB = {

  'response': null,

  'remote': {
    
    store: function(url,data,callback) {
    
      $.ajax({
        url: url,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(status) {
          callback();
        },
        error: function(status) {
          callback();
        }
      })
      
    },

    retrieve: function(url,context,callback) {  
    
      $.ajax({
        url: url,
        type: 'POST',
        context: context,
        success: function(status) {
          callback();
        },
        error: function(status) {
          callback();
        }
      })
      
    },
  },

  'local': {
    
    store: function() {

    },

    retrieve: function(name) {
      var db = $('#database');
      return db.find('li[data-'+name+']').data(name);
    }
    
  },

  publish: function() {
    
  
    
  }

        
}