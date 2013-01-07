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