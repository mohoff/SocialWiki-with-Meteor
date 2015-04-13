
Meteor.startup(function () {
  SyncedCron.start();
});


/* resetMonthlyHeroVotings */
SyncedCron.add({
	name: 'resetMonthlyHeroVotings',
	schedule: function(parser) {
	  // parser is a later.parse object
	  return parser.text('every 1 month');
	},
	job: function() {
		return Meteor.call('resetHeroVotings', 'Monthly');
	}
});

/* resetDailyHeroVotings */
SyncedCron.add({
	name: 'resetDailyHeroVotings',
	schedule: function(parser) {
	  return parser.text('every 1 day');
	},
	job: function() {
		return Meteor.call('resetHeroVotings', 'Daily');
	}
});

/* resetLoginStreaks (Monthly) */
SyncedCron.add({
	name: 'resetLoginStreaks',		// Monthly!
	schedule: function(parser) {
	  return parser.text('every 1 month');
	},
	job: function() {
		return Meteor.call('resetLoginStreaks');
	}
});

// TEST CRONJOB (executes every 2 minutes)
/*SyncedCron.add({
	name: 'test',
	schedule: function(parser) {
	  // parser is a later.parse object
		console.log("schedule: every 2 min");
	  return parser.text('every 2 mins');
	},
	job: function() {
	  //var numbersCrunched = CrushSomeNumbers();
	  //return numbersCrunched;
		console.log("job: resetHeroVotings");
		Meteor.call('resetHeroVotings', 'test');
	}
});*/



SyncedCron.config({
  // Log job run details to console
  log: true,
  // Use a custom logger function (defaults to Meteor's logging package)
  logger: null,
  // Name of collection to use for synchronisation and logging
  collectionName: 'cronHistory',
  // Default to using localTime
  utc: true,
  /*
    TTL in seconds for history records in collection to expire
    NOTE: Unset to remove expiry but ensure you remove the index from
    mongo by hand

    ALSO: SyncedCron can't use the `_ensureIndex` command to modify
    the TTL index. The best way to modify the default value of
    `collectionTTL` is to remove the index by hand (in the mongo shell
    run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
    project. SyncedCron will recreate the index with the updated TTL.
  */
  collectionTTL: 2592000 // 30 days
});

