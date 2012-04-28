{
  'Skeleton': {
    'is a constructor': function () {
      assert(typeof Skeleton === 'function');
      var suite = new Skeleton();
      assert(typeof suite === 'object');
    }
  },
  'A Skeleton': {
    'can accept new test batches': function () {
      var suite = new Skeleton();
      suite.addBatch({
        'my test': {
          'woot': function () {}
        }
      })
    }
  },
  'A Skeleton2': {
    'with test batches': {
      'can export them to an engine (function)': function () {
        var suite = new Skeleton(),
            testBatch1 = {
              'my test': {
                'woot': function () {}
              }
            },
            testBatch2 = {
              'my test2': {
                'woot2': function () {}
              }
            },
            exportIsRun = false;

        suite.addBatch(testBatch1);
        suite.addBatch(testBatch2);

        suite.exportTo(function (batches) {
          assert(batches.length === 2);
          assert(batches[0] === testBatch1);
          assert(batches[1] === testBatch2);
          exportIsRun = true;
        });

        assert(exportIsRun);
      }
    }
  }
  'Skeleton can save modules': {
    'and re-use them for export':  function () {
      var usedMyTestEngine = false,
          myTestEngine = function () {
            usedMyTestEngine = true;
          },
          suite = new Skeleton();

      // Add the test engine to Skeleton
      Skeleton.addModule('myTestEngine', myTestEngine);

      // Export to my test engine
      suite.exportTo('myTestEngine');

      // Assert that the test engine was used
      assert(usedMyTestEngine);
    }
  }
}

// TODO: Sugar methods for Skeleton.async, beforeEach, afterEach