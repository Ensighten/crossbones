# Crossbones

Framework for writing tests once and running them under any test engine.

Currently, we only support conversion from Vows to Mocha. However, support for more frameworks is planned in the future.

## Getting Started
Download [crossbones][crossbones].

[crossbones]: https://raw.github.com//crossbones/master/src/Skeleton.js

In your web page:

```html
<script src="crossbones.js"></script>
<script>
// Create a new test suite
var suite = new Skeleton('Sauron.js');

// Add in a test batch -- this is for a global mediator
suite.addBatch({
  'Sauron': {
    'can emit events': function () {
      Sauron.voice('hello');
    },
    'can set up functions to subscribe to events': function () {
      var works = false;
      Sauron.on('basicOn', function () {
        works = true;
      });
      Sauron.voice('basicOn');
      assert(works);
    },
    'can unsubscribe functions from events': function () {
      var count = 0;
      function basicOff() {
        count += 1;
      }

      Sauron.on('basicOff', basicOff);
      Sauron.voice('basicOff');
      Sauron.off('basicOff', basicOff);
      Sauron.voice('basicOff');
      assert(count === 1);
    }
  }
});

// Export the suite to mocha
suite.exportTo('Mocha');

// and run it
var runner = mocha.run();
</script>
```

## Documentation
Skeleton exposes a constructor function to the window scope.
```js
/**
 * Constructor for a Skeleton (test suite)
 * @param {String} name Name to call this test suite (may not apply to all BDD)
 */
```

Test suites have the methods of `addBatch`which is heavily based off of [vows][vows]
```js
/**
 * Method to add test batches to this test suite
 * @param {Object} batch Batch of tests to add to this test suite
 * @param {Object} batch.* Context containing a set of tests to run
 * @param {Function} batch.*.topic Topic function which takes the place of 'describe' in Mocha and 'topic' in Vows
 * @param {Function} batch.*.* Function that will run a test on the current topic
 * @param {String} batch.*.* Placeholder for a test that will be created later. These will be skipped for test suites that don't support them
 * @returns {this} Skeleton test suite that is being worked on
 */
```

[vows]: http://vowsjs.org/

and `exportTo`.
```js
/**
 * Run method for a test suite (currently only supporting Mocha)
 * @param {Function|String} engineName If a function, Skeleton will process via it. Otherwise, Skeleton will retrieve the engine from its modules.
 * @returns {Mixed} Returns result of engine
 */
```

New test engines can be added via `Skeleton.addModule(name, fn)`.

If a function is asynchronous, it must have an asynchronous flag set on it (`fn.SKELETON_ASYNC = true;`). `Skeleton.async` is a helper method that will set this flag for you:
```js
var myAsyncFn = Skeleton.async(function () {
  return 1;
});
myAsyncFn.SKELETON_ASYNC; // true
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code via [grunt](http://gruntjs.com/).

Testing is currently done manually. You must serve the files locally (I suggest `npm install -g serve && serve`). Then, you can [test Skeleton][skeletonTest] and [its module tests][moduleTests] respectively. Test results should be viewed via the console.

[skeletonTest]: http://localhost:3000/src-test/Skeleton.test.html
[moduleTests]: http://localhost:3000/src-test/Skeleton_module.test.html

## License
Copyright (c) 2013 Ensighten
Licensed under the MIT license.