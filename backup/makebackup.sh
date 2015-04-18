#!/bin/bash

DB="meteor"
MONGO_HOST="127.0.0.1"
MONGO_PORT="3001" # MongoDB-default 27017 (without meteor..)

TIMESTAMP=$(date +"%F_%H-%M-%S")
MONGODUMP_PATH="/usr/bin/mongodump"
BACKUPS_DIR="/home/moo/Desktop/meteor-hoc/backup/backup_$TIMESTAMP"

$MONGODUMP_PATH -h $MONGO_HOST --port $MONGO_PORT -d $DB -o $BACKUPS_DIR

 
#mkdir -p $BACKUPS_DIR
#mv dump $BACKUP_NAME
#tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
#rm -rf $BACKUP_NAME
