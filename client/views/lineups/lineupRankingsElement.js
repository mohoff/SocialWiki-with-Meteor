Template.lineupRankingsElement.helpers({

	heroesAsObjs: function() {
    var heroesAsObjs = [];
		console.log("start for");
    for(var i=0; i<this.lineup.heroes.length; i++) {
				//heroesAsObjs[i] = {};
        //heroesAsObjs[i].index = i+1;
        //heroesAsObjs[i].hero = this.lineup.heroes[i];
				heroesAsObjs.push({index: i+1, hero: this.lineup.heroes[i]});
    }
		console.log("ende for: " + JSON.stringify(heroesAsObjs));
    return heroesAsObjs;
	},

	lineupNameObj: function(){
		var lineupName = this.lineup.name;
		var lineupNameNormed = UI._globalHelpers['normalizeString'](lineupName);
		//console.log("normed lineup name: " + normed);
		return {
			name: lineupName,
			namenormalized: lineupNameNormed
		};
	},

	heroNameObj: function(heroOrder){
		var heroName = this.lineup.heroes[heroOrder-1];	// heroOrder = {1...5}
		var heroNameNormed = UI._globalHelpers['normalizeString'](heroName);
		//console.log("normed lineup name: " + normed);
		return {
			name: heroName,
			namenormalized: heroNameNormed
		};
	},

	lineupNameObj: function(){
		var normed = UI._globalHelpers['normalizeString'](this.lineup.name);
		console.log("normed lineup name: " + normed);
		return {
			name: this.lineup.name,
			namenormalized: normed
		};
	},

	position: function(index) {
		return '<div class="position-bubble hidden-xs">' + index + '</div>';
	},

	ribbon: function(text){ // 2nd parameter: color ?
		var before30Days = new Date().getTime() - (30*24*60*60*1000);
		//console.log("before 30 days: " + before30Days + ", releasedAt: " + this.hero.releasedAt);
		if(this.hero && this.hero.releasedAt && (this.hero.releasedAt > before30Days)){
			return '<div class="corner-ribbon ribbon-shadow">' + text + '</div>';
		}
		return;
	},

  scoreDiff: function(){
    var userId, voteFor, voteSource, userIdentifier, votePower, upOrDownOrUnvote;
    userId = Meteor.userId();
    voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    if(userId){
      voteSource = 'R';
      userIdentifier = userId;
    } else {
      voteSource = 'Unr';
      userIdentifier = Session.get('clientIp');
    }
    // helper receives e.g. nested rating.crusade object, and checks if it contains the passed userIdentifier
    if(this.hero && this.hero.ratings && this.hero.ratings[voteFor]){
      upOrDownOrUnvote = UI._globalHelpers['upOrDownOrUnvote'](this.hero.ratings[voteFor], userIdentifier);
    } else {
      return; // don't show anything
    }

    if(Meteor.user() &&
        Meteor.user().userdata &&
        Meteor.user().userdata.voting &&
        Meteor.user().userdata.voting.currentVotePower){
      votePower = Meteor.user().userdata.voting.currentVotePower.toString();
    } else {
      votePower = "1";
    }
    var prefix;

    if(upOrDownOrUnvote == 'up'){
      prefix = '+';
    } else if(upOrDownOrUnvote == 'down'){
      prefix = '-';
    } // else if(upOrDownOrUnvote == 'unvote'){
      // do nothing
    //}
    console.log(prefix + votePower);
    return prefix + votePower;
  },

  scoreDiffStyle: function(){
    var userId, voteFor, voteSource, userIdentifier, votePower, upOrDownOrUnvote;
    userId = Meteor.userId();
    voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    if(userId){
      voteSource = 'R';
      userIdentifier = userId;
    } else {
      voteSource = 'Unr';
      userIdentifier = Session.get('clientIp');
    }
    // helper receives e.g. nested rating.crusade object, and checks if it contains the passed userIdentifier
    if(this.hero && this.hero.ratings && this.hero.ratings[voteFor] && userIdentifier){
      upOrDownOrUnvote = UI._globalHelpers['upOrDownOrUnvote'](this.hero.ratings[voteFor], userIdentifier);
    } else {
      upOrDownOrUnvote = 'unvote'; // so that it gets rendered to 'gone'
    }


    var classes;
    if(upOrDownOrUnvote == 'up'){
      classes = 'green';
    } else if(upOrDownOrUnvote == 'down'){
      classes = 'red';
    } else if(upOrDownOrUnvote == 'unvote'){
      classes = 'gone';
    }
    return classes;
  },

  /*srcPathAvatar: function(){
    var normalizedName = UI._globalHelpers['normalizeString'](this.hero.name);
    //var normalizedName = Meteor.call('normalizeString', this.hero.name);

    //console.log(normalizedName);
    var path = "/img_heroes/" + normalizedName + "/avatar.jpg";
    //console.log("PATHTOAVATAR: " + path);
    return path;
  },

  srcPathType: function(){
    return '/img_herotypes/' + this.hero.type + '.png';
  },*/

  votedSrc: function(upOrDown){
    var userId = Meteor.userId();
    var voteSource, userIdentifier;
    var voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    if(userId){
      voteSource = 'R';
      userIdentifier = userId;
    } else {
      voteSource = 'Unr';
      userIdentifier = Session.get('clientIp');
    }
    var storedVoters = [];
    if(this.hero && this.hero.ratings && this.hero.ratings[voteFor] &&
          this.hero.ratings[voteFor][upOrDown + "votersDaily"+voteSource+"egistered"]){
      storedVoters  = this.hero.ratings[voteFor][upOrDown + "votersDaily"+voteSource+"egistered"];
    }

    console.log("-UI- Invoked " + upOrDown + "vote from: " + userIdentifier);
    console.log("-UI- stored " + upOrDown + "voters: " + JSON.stringify(storedVoters));

    var hasAlreadyVoted = _.contains(storedVoters, userIdentifier);
    if(hasAlreadyVoted){
      console.log("-UI- userIdentifier has already voted (" + upOrDown + ")");
      if(upOrDown == 'up'){
        //Session.set(currentVote[this.hero._id] = 'up');
        return '/voted-up.png';
      } else if (upOrDown == 'down'){
        //Session.set(currentVote[this.hero._id] = 'down');
        console.log("jetzt wird auf down gesetzt: " + this.currentVote);
        return '/voted-down.png';
      }
    } else {
      console.log("-UI- userIdentifier has NOT voted, thus voteableGray");
      //Session.set(currentVote[this.hero._id] = null);
      if(upOrDown == 'up'){
        return '/voteable-up.png';
      } else if (upOrDown == 'down'){
        return '/voteable-down.png';
      }
    }
  },

  filteredSynergies: function(synergiesArray){
    var lengthCounter = 0;
    var lengthLimit = 100; // 75
    var filteredSynergies = [];

    if((synergiesArray.length) && (synergiesArray.length === 0)){
      return filteredSynergies; // empty array
    }

    synergiesArray.sort(function(a,b){
      if(a.votes && b.votes){
        return b.votes - a.votes;
      } else {
        return 0;
      }
    });

    for(var i=0; i<synergiesArray.length; i++){
      if((lengthCounter + synergiesArray[i].name.length) < lengthLimit){
        filteredSynergies.push(synergiesArray[i]);
        lengthCounter += (4 + synergiesArray[i].name.length);
      } else {
        filteredSynergies.push('...');
        break;
      }
    }

    return filteredSynergies;
  },

  isNoTeaser: function(synergyObj){
    if(synergyObj === '...'){
      return false;
    } else {
      return true;
    }
  }
});

Template.lineupRankingsElement.events({
  'click .downvote': function(event){
    event.preventDefault();
    //var voteFor = event.target.getAttribute('data-votefor');
    var voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    var currentUser = Meteor.user(); // does that always return currentUser? Maybe Meteor.user() is better?
    Meteor.call('vote', this, currentUser, voteFor, 'down'); // this = Hero (collection), voteFor = crusade,pve,etc..
  },

  'click .upvote': function(event){
    event.preventDefault();
    console.log("STATUS: " + JSON.stringify(Meteor.status()));
    var voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    var currentUser = Meteor.user(); // does that always return currentUser? Maybe Meteor.user() is better?
    Meteor.call('vote', this, currentUser, voteFor, 'up', function(err, data) {
      if(err){

      }
      console.log("DATA: " + data);

    });
  }
});
