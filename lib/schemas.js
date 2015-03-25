var Schemas = {};

// default: all specified fields/arrays/etc are mandatory!

Schemas.Hero = new SimpleSchema({
  createdAt: {

  },
  createdFrom: {

  },
  updatedAt: {

  },
  updatedFrom: {

  },
  status: {

  },
  "hero": {

  },
  "hero.name": {

  },
  "hero.surname": {

  },
  "hero.type": {

  },
  "hero.growthstats": {

  },
  "hero.growthstats.str": {

  },
  "hero.growthstats.int": {

  },
  "hero.growthstats.agi": {

  },
  "hero.badges": {
    // type array
  },
  "hero.badges.$": {       // or how else define array-element?

  },
  "hero.attributes": {       // or how else define array-element?

  },
  "hero.attributes.$": {       // or how else define array-element?

  },
  "hero.lineupOrder": {

  },

  /* ---- SKILLS ---- */

  "hero.skills": {
    // array
  },
  "hero.skills.$": {
    // object
  },
  "hero.skills.$.order": {

  },
  "hero.skills.$.name": {

  },
  "hero.skills.$.desc": {

  },
  "hero.skills.$.types": {
    // array
  },
  "hero.skills.$.types.$": {
    // string
  },
  "hero.skills.$.stats": {
    // array
  },
  "hero.skills.$.stats.$": {
    // object
  },
  "hero.skills.$.stats.$.type": {

  },
  "hero.skills.$.stats.$.lvl1": {

  },
  "hero.skills.$.stats.$.perLvl": {

  },
  "hero.ratings": {
    //object
  },

  /* ---- ARENA ---- */

  "hero.ratings.arena": {
    // object
  },
  "hero.ratings.arena.upvoteCountDaily": {
    // object
  },
  "hero.ratings.arena.upvoteCountMonthly": {
    // object
  },
  "hero.ratings.arena.upvoteCountAlltime": {
    // object
  },
  "hero.ratings.arena.upvotersDailyRegistered": {
    // array
  },
  "hero.ratings.arena.upvotersDailyRegistered.$": {
    // userId
  },
  "hero.ratings.arena.upvotersDailyUnregistered": {
    // array
  },
  "hero.ratings.arena.upvotersDailyUnregistered.$": {
    // string
  },
  "hero.ratings.arena.downvoteCountDaily": {
    // object
  },
  "hero.ratings.arena.downvoteCountMonthly": {
    // object
  },
  "hero.ratings.arena.downvoteCountAlltime": {
    // object
  },
  "hero.ratings.arena.downvotersDailyRegistered": {
    // array
  },
  "hero.ratings.arena.downvotersDailyRegistered.$": {
    // userId
  },
  "hero.ratings.arena.downvotersDailyUnregistered": {
    // array
  },
  "hero.ratings.arena.downvotersDailyUnregistered.$": {
    // string
  },

  /* ---- CRUSADE ---- */

  "hero.ratings.crusade": {
    // object
  },
  "hero.ratings.crusade.upvoteCountDaily": {
    // object
  },
  "hero.ratings.crusade.upvoteCountMonthly": {
    // object
  },
  "hero.ratings.crusade.upvoteCountAlltime": {
    // object
  },
  "hero.ratings.crusade.upvotersDailyRegistered": {
    // array
  },
  "hero.ratings.crusade.upvotersDailyRegistered.$": {
    // userId
  },
  "hero.ratings.crusade.upvotersDailyUnregistered": {
    // array
  },
  "hero.ratings.crusade.upvotersDailyUnregistered.$": {
    // string
  },
  "hero.ratings.crusade.downvoteCountDaily": {
    // object
  },
  "hero.ratings.crusade.downvoteCountMonthly": {
    // object
  },
  "hero.ratings.crusade.downvoteCountAlltime": {
    // object
  },
  "hero.ratings.crusade.downvotersDailyRegistered": {
    // array
  },
  "hero.ratings.crusade.downvotersDailyRegistered.$": {
    // userId
  },
  "hero.ratings.crusade.downvotersDailyUnregistered": {
    // array
  },
  "hero.ratings.crusade.downvotersDailyUnregistered.$": {
    // string
  },

  /* ---- PVEFARMING ---- */

  "hero.ratings.pvefarming": {
    // object
  },
  "hero.ratings.pvefarming.upvoteCountDaily": {
    // object
  },
  "hero.ratings.pvefarming.upvoteCountMonthly": {
    // object
  },
  "hero.ratings.pvefarming.upvoteCountAlltime": {
    // object
  },
  "hero.ratings.pvefarming.upvotersDailyRegistered": {
    // array
  },
  "hero.ratings.pvefarming.upvotersDailyRegistered.$": {
    // userId
  },
  "hero.ratings.pvefarming.upvotersDailyUnregistered": {
    // array
  },
  "hero.ratings.pvefarming.upvotersDailyUnregistered.$": {
    // string
  },
  "hero.ratings.pvefarming.downvoteCountDaily": {
    // object
  },
  "hero.ratings.pvefarming.downvoteCountMonthly": {
    // object
  },
  "hero.ratings.pvefarming.downvoteCountAlltime": {
    // object
  },
  "hero.ratings.pvefarming.downvotersDailyRegistered": {
    // array
  },
  "hero.ratings.pvefarming.downvotersDailyRegistered.$": {
    // userId
  },
  "hero.ratings.pvefarming.downvotersDailyUnregistered": {
    // array
  },
  "hero.ratings.pvefarming.downvotersDailyUnregistered.$": {
    // string
  },

  /* SYNERGIES */

  "hero.synergies": {
    // array
  },
  "hero.synergies.$.createdAt": {

  },
  "hero.synergies.$.createdBy": {

  },
  "hero.synergies.$.name": {

  },
  "hero.synergies.$.status": {

  },
  "hero.synergies.$.voters": {
    // array
  },
  "hero.synergies.$.voters.$": {
    // userIds
  },
  "hero.synergies.$.votes": {

  },
  "hero.synergies.$.deleteRequests": {

  }
});
