(function () {
function autoCallback(fn) {
  fn();
}

// Localize the splat test functions
var test = Splat.test,
    testAsync = Splat.testAsync,
    assert = Splat.assert;

// Create a function to test modules
function testModule(moduleName, runner, finalCallback) {
  // Fallback test runner
  runner = runner || autoCallback;

  test(moduleName + ' can run a single batch', function () {
    var hasRun = false,
        suite = new Skeleton;

    // Generate a simple batch
    suite.addBatch({
      'single batch': {
        'runs': function () {
          hasRun = true;
        }
      }
    });

    // Export and run the test
    suite.exportTo(moduleName);
    runner(function () {
      // Make sure the test ran the batch
      assert(hasRun);
    });
  });

  test(moduleName + ' supports multiple batches', function () {
    var hasRun1 = false,
        hasRun2 = false,
        suite = new Skeleton;

    suite.addBatch({
      'batch1': {
        'runs': function () {
          hasRun1 = true;
        }
      }
    });

    suite.addBatch({
      'batch2': {
        'runs': function () {
          hasRun2 = true;
        }
      }
    });

    suite.exportTo(moduleName);
    runner(function () {
      assert(hasRun1);
      assert(hasRun2);
    });
  });

  test(moduleName + ' supports beforeEach', function () {
    var beforeBool = true,
        runCount = 0,
        suite = new Skeleton;

    suite.addBatch({
      'eachTest': {
        'beforeEach': function () {
          if (beforeBool || runCount > 0) {
            runCount += 1;
          }
        },
        'test1': function () {
          beforeBool = false;
          var a = 1 + 1;
        },
        'test2': function () {
          beforeBool = false;
          var b = 1 + 1;
        }
      }
    });

    suite.exportTo(moduleName);
    runner(function () {
      assert(runCount === 2);
    });
  });

  test(moduleName + ' supports afterEach', function () {
    var afterBool = false,
        runCount = 0,
        suite = new Skeleton;

    suite.addBatch({
      'eachTest': {
        'afterEach': function () {
          if (afterBool) {
            runCount += 1;
          }
        },
        'test1': function () {
          var a = 1 + 1;
          afterBool = true;
        },
        'test2': function () {
          var b = 1 + 1;
          afterBool = true;
        }
      }
    });

    suite.exportTo(moduleName);
    runner(function () {
      setTimeout(function () {
        assert(runCount === 2);
      }, 20);
    });
  });


  // TODO: Get this working
  // test(moduleName + ' supports async topics', function () {
    // var called = false,
        // suite = new Skeleton;

    // suite.addBatch({
      // 'async': {
        // topic: Skeleton.async(function () {
          // var callback = this.callback;
          // setTimeout(function () {
            // called = true;
            // callback();
          // }, 100);
        // }),
        // 'test1': function () {
          // assert(called);
        // }
      // }
    // });

    // suite.exportTo(moduleName);
    // runner(function () {
      // assert(called);
    // });
  // });

  // TODO: Handle .async .beforeEach and .afterEach in helper method

  testAsync(moduleName + ' supports async tests', function () {
    var called1 = false,
        called2 = false,
        suite = new Skeleton;

    suite.addBatch({
      'async': {
        // Once the asynchronous test has run, assert via a second test
        'afterEach': function () {
          if (called1 === true) {
            called2 = true;
          }
        },
        'test1': Skeleton.async(function () {
          var callback = this.callback;
          assert(typeof callback === 'function');

          setTimeout(function () {
            called1 = true;
            callback();
          }, 100);
        })
      }
    });

    // Export the two suites
    suite.exportTo(moduleName);

    // Assert that the tests are run in order (even when async)
    var callback = this.callback;
    runner(function () {
      // Make sure that after sync has not been called in 10ms
      setTimeout(function () {
        assert(called2 === false);
      }, 10);

      // But after the async test, everything is good
      setTimeout(function () {
        assert(called1);
        assert(called2);
        
        // Callback now that we are done
        callback();
      }, 300);
    });
  }, next);
  
  function next() {
    // Callback now that we are done
    finalCallback();
  }
}

// Expose testModule to the window scope
window.testModule = testModule;
}());