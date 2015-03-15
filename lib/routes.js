Meteor.startup(function() {

  /*if(Meteor.isClient){
    Meteor.call('getIP', function(error, result){
      console.log("clientIp: " + result);
      //clientIp = result;
      Session.set('clientIp', result);
    });

    Meteor.autorun(function(){
      if(this.route && this.route.name){
        console.log("ROUTENAME: " + this.route.name);
      }
    });
  }*/


  Router.map(function(){
    this.route('welcome', {
      path: '/'
    });

    this.route('heroDetails', {
      path: '/heroes/view/:heroname',
      //template: 'hero_view_detail',   // we can specify other templates than the route name
      notFoundTemplate: 'data_not_found',
      waitOn: function(){
        // waits for ready() method (return true/false) of that reactive data source
        return Meteor.subscribe('heroes', this.params.heroname);  // dont wait for entire set, just this one collection we want to have
      },
      data: function(){
        // this.params.<param> is exactly the string behind :<param>.
        //console.log(this.params.heroname);
        return Heroes.findOne({_id : this.params.heroname});
      }
    });

/*
    Router.route('/', function(){
      this.render('Hero');
    },{
      name: 'Hero'
    });
*/


    this.route('heroRankings', {
      path: '/heroes/ranking/:category',
      data: function(){
        var cat = this.params.category;

         // mongodb on client-side (minimongo) doesn't support aggregation
         // we can only sort by one field, no $sum- or $subtract-aggregation

        //var substract = { $subtract: ['hero.ratings.' + cat + '.upvoteCountAlltime', 'hero.ratings.' + cat + '.downvoteCountAlltime']};
        //var sortObj = {};
        //sortObj[substract] = -1;
        ////sortObj['hero.name'] = 1;
        //console.log("SORTOBJ: " + JSON.stringify(sortObj));

        if(this.ready()){ // this.ready() is necessary, so this data-function waits for the subscription too. Not only the template-rendering
          var sortObj = {};
          sortObj['hero.ratings.' + cat + '.upvoteCountAlltime'] = -1; // -1 = DESC, 1 = ASC
          sortObj['hero.name'] = 1;

          var heroes = Heroes.find();
          //console.log("heroes: " + JSON.stringify(heroes));
          var heroesArray = heroes.fetch();
          //console.log("HEROESArray: " + JSON.stringify(heroesArray));
          // sort heroes by their score (score = upvotes-downvotes)
          heroesArray.sort(function(a,b){
            var scoreA = a.hero.ratings[cat].upvoteCountAlltime - a.hero.ratings[cat].downvoteCountAlltime;
            var scoreB = b.hero.ratings[cat].upvoteCountAlltime - b.hero.ratings[cat].downvoteCountAlltime;
            return scoreB - scoreA;
          });
          //console.log("HEROESArraySorted: " + JSON.stringify(heroesArray));

          var upvotes = heroesArray[0].hero.ratings[cat].upvoteCountAlltime;
          var downvotes = heroesArray[0].hero.ratings[cat].downvoteCountAlltime;
          var score = upvotes - downvotes;
          //console.log("HIGHSCORE: " + score);
          sessionRecord = {};
          sessionRecord[cat + 'RankingHighscore'] = score;
          Session.set(sessionRecord);

          return heroesArray;
        }
      },
      waitOn: function() {
        // waits for ready() method (return true/false) of that reactive data source
        //console.log("waitOn READY");
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

  /*
  setTitle = function() {
    var titleSuffix = titlesMap[this.route.name];
    var title = titleSuffix? 'HoC Kings : ' + titleSuffix : 'HoC Kings';
    document.title = title;
  };
  */

  /*
  var titlesMap = {
    welcome: 'Home',
    heroRankings: 'Hero Rankings',
    heroDetails: 'Hero Details'
  };*/

  Router.onAfterAction(function() {
    var title = 'HoC Kings';
    console.log("routename: " + this.route.getName());
    //if(this.route){
    //  title += ' :: ' + this.route.getName();
    //  /*if(this.params.category){
    //    title += ' ' + this.params.category
    //  }*/
    //}
    document.title = title;
  });

  Router.configure({
    // attributes are applied for every route/template/site rendered
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
    yieldTemplates: {
      'nav': {to: 'nav'},
      'sidebar': {to: 'sidebar'},
      'footer': {to: 'footer'}
    }
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
