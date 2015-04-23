/*this.Pages = new Meteor.Pagination(Heroes, {
  perPage: 1,
	infinite: true,
	infiniteTrigger: .9,
	infiniteRateLimit: 1,
	//infiniteStep: 1,
	itemTemplate: "heroRankingsElement",
	dataMargin: 100
	//router: "iron-router"
	//homeRoute: '/test/'
  //sort: {
  //  "hero.name": 1
  //},
  //filters: {
  //  count: {
  //    $gt: 10
  //  }
  //}
});
*/



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
      //notFoundTemplate: 'notFoundHero',
      //template: 'hero_view_detail',   // we can specify other templates than the route name
      waitOn: function(){
        // waits for ready() method (return true/false) of that reactive data source
        var unnormed = unnormalizeString(this.params.heroname);
        return Meteor.subscribe('heroes', {
          "hero.name": unnormed
        });
        //Meteor.subscribe('heroes');
        // dont wait for entire set, just this one collection we want to have
      },
      data: function(){
        // this.params.<param> is exactly the string behind :<param>.
        //console.log(this.params.heroname);
        //return Heroes.findOne({_id : this.params.heroname});
        var unnormed = unnormalizeString(this.params.heroname);
        var hero = Heroes.findOne({"hero.name" : unnormed});
        console.log("returned hero: " + JSON.stringify(hero));

        return hero;
      }
    });

    this.route('heroRankings', {
      path: '/heroes/ranking/:category',
      data: function(){
        var cat = this.params.category;

					// mongodb on client-side (minimongo) doesn't support aggregation
					// we can only sort by one field, no $sum- or $subtract-aggregation
					/*	Can't use mongoDB sorts because we need javascript custom sort()
							See sortHeroesArray()
					*/

        if(this.ready()){
					/* 	this.ready() is necessary, so this data-function waits
							for the subscription too. Not only the template-rendering */

          //var sortObj = {};
          //sortObj['hero.ratings.' + cat + '.upvoteCountAlltime'] = -1; // -1 = DESC, 1 = ASC
          //sortObj['hero.name'] = 1;

					var heroesArray = [];
          var heroesCursor = Heroes.find().fetch();
					heroesCursor.forEach(function(hero){
            heroesArray.push(hero);
        	}); 
					//console.log("unsortedHeroesArray: " + JSON.stringify(heroesArray));
					heroesArray = sortHeroesArray(heroesArray, cat);
					//console.log("sortedHeroesArray: " + JSON.stringify(heroesArray));

          return heroesArray;
        }
      },
      waitOn: function() {
        // waits for ready() method (return true/false) of that reactive data source
        //console.log("waitOn READY");
        return Meteor.subscribe('heroes');
      }
    });

		this.route('lineupDetails', {
      path: '/lineups/view/:lineupname',
      waitOn: function(){
        // waits for ready() method (return true/false) of that reactive data source
        var unnormed = unnormalizeString(this.params.lineupname);
        return Meteor.subscribe('lineups', {
          "lineup.name": unnormed
        });
      },
      data: function(){
        var unnormed = unnormalizeString(this.params.heroname);
        var lineup = Lineups.findOne({"lineup.name" : unnormed});
        console.log("returned lineup: " + JSON.stringify(lineup));

        return lineup;
      }
    });

    this.route('lineupRankings', {
      path: '/lineups',
      waitOn: function(){
        return Meteor.subscribe('lineups');
      },
      data: function(){
        if(this.ready()){
          var lineups = Lineups.find();
          return lineups;
        }
      }
    });

    this.route('guides', {
      path: '/guides/:category',
      /*waitOn: function(){
        return Meteor.subscribe('guides', {
          "guide.category": this.params.category
        });
      },
      data: function(){
        if(this.ready()){
          return Guides.find({
            "guide.category" : this.params.category
          });
        }
      }*/
    });



// ADMIN PAGES
	// HEROES
    this.route('adminAddHero', {
      path: '/admin/addhero',
      template: 'adminAddOrEditHero',
      waitOn: function() {
        // waits for ready() method (return true/false) of that reactive data source
        //console.log("waitOn READY");
        return Meteor.subscribe('heroes');
      }
    });
    
    this.route('/admin/edit/:heroname', {
      template: 'adminAddOrEditHero',
      name: 'hero.edit',
      data: function() {
        //var heroNormalized = this.params.hero;
        //var heroName = heroNormalized.replace(/-/g, " ");
        console.log("we are in data: " + this.params.heroname);
        // this.params.<param> is exactly the string behind :<param>.
        //console.log(this.params.heroname);
        //return Heroes.findOne({_id : this.params.heroname});
        var unnormed = unnormalizeString(this.params.heroname);
        var hero = Heroes.findOne({"hero.name" : unnormed});
        console.log("returned hero: " + JSON.stringify(hero));

        return hero;
      },
      waitOn: function() {
        var unnormed = unnormalizeString(this.params.heroname);
        return Meteor.subscribe('heroes', {
          "hero.name": unnormed
        });
      }
    });

	// LINEUPS
		this.route('adminAddLineup', {
      path: '/admin/addlineup',
      template: 'adminAddOrEditLineup'/*,
      waitOn: function() {
				// also need Meteor.subscribe('heroes') ?
        return Meteor.subscribe('lineups');
      }*/
    });
  });






// general settnigs
  Router.onBeforeAction('loading');

  Router.onAfterAction(function() {
    var title = 'HeroesCharge.org';
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
    },
    //notFoundTemplate: 'notFoundHero'
  });

  Router.plugin('dataNotFound', {
    notFoundTemplate: 'notFoundHero',
    only: ['heroDetails', 'adminEditHero']
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
