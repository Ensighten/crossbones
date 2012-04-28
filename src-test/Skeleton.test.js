(function () {
function noop() {}

var loudConsole = window.console || {'log': noop, 'error': function (msg) { alert(msg); }},
    quietConsole = {'log': noop, 'error': noop},
    console = loudConsole;

// Set up a test function for quicker evaluation
function test(name, fn) {
  try {
    fn();
  } catch (e) {
    console.error('TEST FAILED: ', name);
    throw e;
  }
  console.log('TEST PASSED: ', name);
}

/*** TESTING TEST (Part I) ***/

// Silence the console for the next run
console = quietConsole;

// Passing test for test
var testWasRun = false;
test('Testing test', function () {
  testWasRun = true;
});

// Unmute the console and report back if anything went awry
console = loudConsole;

// If the test did not work, report so
if (testWasRun !== true) {
  console.error('Test was not run');
  throw new Error('Test function is broken');
}

/*** TESTING TEST (Part II) ***/

// Silence the console for the next run
console = quietConsole;

// Testing out the test function
var testWorked = true;
try {
  test('Testing test', function () {
    throw new Error('pass');
  });
  testWorked = false;
} catch (e) {
}

// Unmute the console and report back if anything went awry
console = loudConsole;

// If the test did not work, report so
if (testWorked !== true) {
  console.error('Test does not capture errors');
  throw new Error('Test function is broken');
}

/*** TESTING ASSERT ***/

function assert(bool) {
  if (bool !== true) {
    throw new Error('Assert expected: true, received: ' + bool);
  }
}

try {
  assert(true);
} catch (e) {
  console.noop('Assert threw an error for true');
  throw e;
}

var testPassed = false;
try {
  assert(false);
} catch (e) {
  testPassed = true;
}
if (testPassed !== true) {
  console.noop('Assert did not throw an error for false');
  throw new Error('Assert did not throw an error for false');
}

// Begin testing Skeleton
console.log('BEGIN TESTING: Skeleton basics');

test('Skeleton is a constructor', function () {
  assert(typeof Skeleton === 'function');
  var suite = new Skeleton();
  assert(typeof suite === 'object');
});

test('A skeleton can accept new test batches', function () {
  var suite = new Skeleton();
  suite.addBatch({
    'my test': {
      'woot': function () {}
    }
  });
});

test('A skeleton with test batches can export them to an engine (function)', function () {
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

  // Add the batches to the suite
  suite.addBatch(testBatch1);
  suite.addBatch(testBatch2);

  // Export the batches to the suite
  suite.exportTo(function (batches) {
    assert(batches.length === 2);
    assert(batches[0] === testBatch1);
    assert(batches[1] === testBatch2);
    exportIsRun = true;
  });

  // Verify that the export method was actually run
  assert(exportIsRun);
});

test('Skeleton can save modules and re-use them for export', function () {
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
});

console.log('END TESTING: Skeleton basics');

// Final message
console.log('ALL TESTS COMPLETED AND PASSING');

}());
