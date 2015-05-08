BUGCROWD Tagger App
===================

Reference Schema https://gist.github.com/codesoda/124a85330c10da6785d3

Running the tests
=================

```
$ npm install
$ npm test
```

Start the server
================

```
$ npm start
```

Or call index.js.

Thoughts and changes to schema
------------------------------

The route for creating and updating an entity's tags was moved from POST /tag to PUT /tags/:entityType/:entityId. This was done for two reason. Firstly /tag was renamed to /tags as we are operating on a collection rather than a single entity. Secondly I made an assumption that the entity id is not controlled by the tagger application since there appears to be external data related to an entity eg. Product information. 