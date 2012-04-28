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
    // TODO: Handle before, after
    var topicFn = context.topic,
        topic;
    if (topicFn !== undefined) {
      // TODO: Handle async portion for 'this' (e.g. this.callback)
      topic = topicFn.apply({}, topicChain);
      topicChain.unshift(topic);
    }

    // Loop through the descriptions (skipping topic)
    var description,
        firstTopic = topicChain[0];
    for (description in context) {
      if (description !== 'topic' && context.hasOwnProperty(description)) {
        (function (description) {
          var item = context[description],
              itemType = typeof item;

          // If the item is an object, it is a sub-context
          if (itemType === 'object') {
            // Describe and recurse the sub-context
            describe(description, function () {
              parseContext(item, topicChain);
            });
          } else if (itemType === 'function') {
          // Otherwise, if it is a function, it is a vow
            // Run the vow as an 'it'
            it(description, function () {
              item(firstTopic);
            });
          }
          // Otherwise, it is a promise
            // Mocha does not support promises
        }(description));
      }
    }
  }
});