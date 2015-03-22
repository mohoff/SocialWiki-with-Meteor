/*
- missing- relevant?:
- INITIAL str,int,agi (vlg. http://en.dotarena.com/docs/hero/id/5)
- MAXED OUT str, int, agi (vlg. http://en.dotarena.com/docs/hero/id/5)

*/


// ************************************
// MODEL of Hero
// simple (without collection2 package)
// ************************************

var modelHero =
{
  "createdAt": ISODate("2015-03-16T00:53:33.190Z"),
  "createdFrom": "mosEXjjkQpeYe53KF",
  "updatedAt": ISODate("2015-03-16T00:53:33.190Z"),
  "udpatedFrom": "mosEXjjkQpeYe53KF",
  "hero": {
    "name": "Old Curse",			// unique
    "surname": "Pallathion",		// unique
    "type": "strength",			// highest of "growthstats"
    "growthstats": {
      "strength": 3.3,
      "agility": 4.1,
      "intellect": 2.2
    },
    "badges": [
      "Swordmanship",			// reference-table?
      "Archery",
      "Axe-Gang"
    ],
    "attributes": [
      "physical dmg",			// reference table?
      "magic dmg",
      "hard CC",
      "heavy AoE",
      "DoT",
      "Flying",
      "Heal/Sustain",
      "team aura",
      "mirrors"
    ],
    "lineupOrder": 500,			// unique
    "skills": [
      {
        "order": 1,
        "name": "Chilling Wave",
        "description": "Pallathion blasts out a wave of super-chilled air that freezes enemies before him.",
        "types": [
          "Frost"
        ],
        "stats": [
          {
            "type": "Damage",
            "lvl1": 22.5,
            "perLvl": 5
          },
          {
            "type": "Hitzone",
            "lvl1": "",
            "perLvl": "Increase"
          }
        ],
        "LevelOne": {
          "Damage": 50,
          "Life Steal": 20
        },
        "perLevel": {
          "Damage": 8.5,
          "Life Steal": 13,
          "otherEnhancements": [
            "Hitzone increased"
          ],
          /*
          "Healing": false,
          "AuraAttack": false,
          "AuraMagic": false,
          "AuraLifesteal: false,
          "AuraMagicRes": false,
          "AuraArmor": false,
          "AuraAttackspeed": false,
          "AuraMovement": false,
          "AuraArmorPen": false,
          "AuraMagicPen": false
          */
        }
      },{
        "order": 2,
        "name": "Thermal Shock",
        "description": "A blast of ice and fire .....",
        "types": [
          "Frost",
          "Fire"
        ],
        "LevelOne": {
          "Damage": 50,
          "Life Steal": 20
        },
        "perLevel": {
          "Damage": 8.5,
          "Life Steal": 13,
          "otherEnhancements": [
            "Hitzone increased"
          ]
        }
      }
    ],
    "ratings": {
      //"forDay": 20150301,	// yyyymmdd-integer, der bei jedem (registered) user-vote gecheckt wird.
      // Falls currentDate > forDay, reset upvoters und downvoters (+daily votes)unten.

      // draft für update:
      // Arrays werden jeden Tag gelöscht, Counts werden gelassen

      "pve": {
        "upvoteCount": 0,
        "upvoteCountDaily": 0,
        "upvoterRegistered": [user1id, user2id, user3id, ...],
        "upvoterUnregistered": [ IP1AsString bzw. Hash(IP,UserEquipment), IP2AsString, ...],
        "downvoteCount": 0,
        "downvoteCountDaily": 0,		// damit kann "trending"-sortierung realisiert werden
        "downvoterRegistered": [user1id, user2id, user3id, ...],
        "downvoterUnregistered": [ IP1AsString, IP2AsString, ...]
      },
      "arena": {
        "upvoteCount": 0,
        "upvoteCountDaily": 0,
        "upvoterRegistered": [user1id, user2id, user3id, ...],
        "upvoterUnregistered": [ IP1AsString bzw. Hash(IP,UserEquipment), IP2AsString, ...],
        "downvoteCount": 0,
        "downvoteCountDaily": 0,		// damit kann "trending"-sortierung realisiert werden
        "downvoterRegistered": [user1id, user2id, user3id, ...],
        "downvoterUnregistered": [ IP1AsString, IP2AsString, ...]
      },
      "pvefarming": {
        "upvoteCount": 0,
        "upvoteCountDaily": 0,
        "upvoterRegistered": [user1id, user2id, user3id, ...],
        "upvoterUnregistered": [ IP1AsString bzw. Hash(IP,UserEquipment), IP2AsString, ...],
        "downvoteCount": 0,
        "downvoteCountDaily": 0,		// damit kann "trending"-sortierung realisiert werden
        "downvoterRegistered": [user1id, user2id, user3id, ...],
        "downvoterUnregistered": [ IP1AsString, IP2AsString, ...]
      }
    },
    "synergies": [
      {
        "createdAt" : ISODate("2015-03-16T00:53:33.190Z"),
        "createdBy" : "mosEXjjkQpeYe53KF",
        "name" : "lkj",
        "status" : "Approved",			// Approved OR Pending
        "voters" : [
          "mosEXjjkQpeYe53KF",
          "asdf124jkloi"
        ],
        "votes" : 1,
        "deleteRequests": 0
      },
      {
        "createdAt" : ISODate("2015-03-16T00:53:33.190Z"),
        "createdBy" : "mosEXjjkQpeYe53KF",
        "name" : "lkj",
        "status" : "Approved",			// Approved OR Pending
        "voters" : [
          "mosEXjjkQpeYe53KF",
          "asdf124jkloi"
        ],
        "votes" : 1,
        "deleteRequests": 0
      }
    ]
  }
}
