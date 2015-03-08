Meteor.startup(function() {

  if(Meteor.isClient){
    Meteor.call('getIP', function(error, result){
      console.log("clientIp: " + result);
      //clientIp = result;
      Session.set('clientIp', result);
    });
  }


  Router.map(function(){
    this.route('welcome', {
      path: '/',
    });

    this.route('hero_view_detail', {
      path: '/heroes/view/:heroname',
      //template: 'hero_view_detail',   // we can specify other templates than the route name
      notFoundTemplate: 'data_not_found',
      waitOn: function(){
        // waits for ready() method (return true/false) of that reactive data source
        return Meteor.subscribe('heroes', this.params.heroname);  // dont wait for entire set, just this one collection we want to have
      },
      data: function(){
        // this.params.<param> is exactly the string behind :<param>.
        console.log(this.params.heroname);
        return Heroes.findOne({'hero.name' : this.params.heroname});
      }
    });

    this.route('heroes_ranking', {
      path: '/heroes/ranking/:category',
      data: function(){
        var cat = this.params.category;
        var sortObj = {};
        sortObj['hero.ratings.' + cat + '.upvoteCountAlltime'] = 1;
        // fields fehlen noch
        var heroes = Heroes.find({
        },{
          sort: sortObj,
          limit: 10
        });
        //console.log("HEROES: " + JSON.stringify(heroes));
        return heroes;
      },
      waitOn: function() {
        // waits for ready() method (return true/false) of that reactive data source
        return Meteor.subscribe('heroes');
      }
    });
    this.route('heroes_crusade', {path: '/heroes/list/crusade'} );
    this.route('heroes_pvefarming', {path: '/heroes/list/pvefarming'} );

    this.route('lineups', {path: '/heroes/lineups'} );

    this.route('guides', {path: '/guides'} );
    this.route('guides_outlandportal', {path: '/guides/outland_portal'} );
    this.route('guides_crusade', {path: '/guides/crusade'} );
    this.route('guides_farming', {path: '/guides/farming'} );

  });

  Router.onBeforeAction('loading');

  Router.configure({
    // attributes are applied for every route/template/site rendered
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
    yieldTemplates: {
      'nav': {to: 'nav'},
      'footer': {to: 'footer'}
    },
  });




  /*
  // Link Out
  Router.route('/out', {
    name: 'out',
    where: 'server',
    action: function(){
      var query = this.request.query;
      if(query.url){ // for some reason, query.url doesn't need to be decoded
        var post = Posts.findOne({url: query.url});
        if (post) {
          var ip = this.request.connection.remoteAddress;
          increasePostClicks(post._id, ip);
          this.response.writeHead(302, {'Location': query.url});
        } else {
          // don't redirect if we can't find a post for that link
          this.response.write('Invalid URL');
        }
        this.response.end();
      }
    }
  });
  */
});
