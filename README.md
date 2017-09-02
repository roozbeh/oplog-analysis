# oplog-analysis
==============

Installation of required packages:
------------------
```$ brew install npm
$ npm install mongodb
```

Run tail to get some analysis from Mongo:
-----------------
```
$ node oplog_tail.js > operations.js
```

Analyze the output and sort based on byte size:
----------------
```
$ python analyze.py | sort -nr
```

