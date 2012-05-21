// Add a Mocha engine
Skeleton.addModule('Mocha', function (batches) {
  // Loop through each batch and recurse each topic
  var i = 0,
      len = batches.length,
      batch;
  for (; i < len; i++) {
    batch = batches[i];
    parseBatch(batch);
  }

  function parseBatch(batch) {
    // Mocha does not use batches
    var description;

    // Iterate the keys of the batch
    for (description in batch) {
      if (batch.hasOwnProperty(description)) {
        (function (description) {
          var context = batch[description];

          // If the context is an object, describe it
          if (typeof context === 'object') {
            describe(description, function () {
              parseContext(context, []);
            });
          }
        }(description));
      }
    }
  }

  function parseContext(context, topicChain) {
    // Fallback topicChain
    topicChain = topicChain || [];

    // If the context has a topic, grab it
    var topicFn = context.topic,
        topic;
    if (topicFn !== undefined) {
      // If the item is not async, invoke the function and callback immediately
      if (topicFn.SKELETON_ASYNC !== true) {
        // Invoke the topic function
        topic = topicFn.apply({}, topicChain);

        callback(topic);
      } else {
      // Otherwise, execute the topicFn in an async fashion
        // Set up a callback for the item
        var callback = function (topic) {
          // Append the topic to the chain
          topicChain.unshift(topic);

          // Run the next function
          next();
        };
        topicFn.apply({'callback': callback}, topicChain);
      }
    } else {
    // Otherwise, move on to the next parts
      next();
    }

    // Loop through the descriptions (skipping topic)
    function next() {
      var description,
          firstTopic = topicChain[0];
      for (description in context) {
        if (description !== 'topic' && context.hasOwnProperty(description)) {
          (function (description) {
            var item = context[description],
                itemType = typeof item;

            // If the description is beforeEach, execute it as such
            if (description === 'beforeEach') {
              return beforeEach(item);
            } else if (description === 'afterEach') {
              return afterEach(item);
            }

            // If the item is an object, it is a sub-context
            if (itemType === 'object') {
              // Describe and recurse the sub-context
              describe(description, function () {
                parseContext(item, topicChain);
              });
            } else if (itemType === 'function') {
            // Otherwise, if it is a function, it is a vow
              // If the item is async, handle it as such
              if (item.SKELETON_ASYNC === true) {
                it(description, function (done) {
                  item.call({'callback': done}, firstTopic);
                });
              } else {
              // Otherwise, evaluate it normally
                it(description, function () {
                  item(firstTopic);
                });
              }
            }
            // Otherwise, it is a promise
              // Mocha does not support promises
          }(description));
        }
      }
    }
  }
});