var MongoDB = require('mongodb');

// To track the oplog we need the oplog URL
// oplogurl = 'mongodb://<user>:<password>@candidate.11.mongolayer.com:10240,candidate.0.mongolayer.com:10240/local?authSource=wiktory'

// oplogurl = 'mongodb://qa-mongo3-public.aws.toppsapps.com:27017/local?authSource=kick'
oplogurl = 'mongodb://localhost:28017/local?authSource=kick'


// Open the connection to the database
MongoDB.MongoClient.connect(oplogurl, function(err, db) {  
  // Get to oplog collection
  db.collection("oplog.rs", function(err, oplog) {
    // Find the highest timestamp
    oplog.find({}, {
      ts: 1
    }).sort({
      $natural: -1
    }).limit(1).toArray(function(err, data) {
      lastOplogTime = data[0].ts;
      // If there isn't one found, get one from the local clock
      if (lastOplogTime) {
        queryForTime = {
          $gt: lastOplogTime
        };
      } else {
        tstamp = new MongoDB.Timestamp(0, Math.floor(new Date().getTime() / 1000))
        queryForTime = {
          $gt: tstamp
        };
      }
      // Create a cursor for tailing and set it to await data
      cursor = oplog.find({
        ts: queryForTime
      }, {
        tailable: true,
        awaitdata: true,
        oplogReplay: true,
        numberOfRetries: -1
      });
      // Wrap that cursor in a Node Stream
      stream = cursor.stream();

      // And when data arrives at that stream, print it out
      stream.on('data', function(oplogdoc) {
        var jsonO = JSON.stringify(oplogdoc.o);
        console.log(oplogdoc.op + "," + oplogdoc.ns + "," + jsonO.length)
      });
    });
  });
});
