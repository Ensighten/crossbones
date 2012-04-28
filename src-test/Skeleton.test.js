(function () {
var loudConsole = window.console || {'log': function (msg) { alert(msg); }},
    quietConsole = {'log': function () {}},
    console = loudConsole;

// Set up a test function for quicker evaluation
function test(name, fn) {
  try {
    fn();
  } catch (e) {
    console.log('TEST FAILED: ', name);
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
  console.log('Test was not run');
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
  console.log('Test does not capture errors');
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
  console.log('Assert threw an error for true');
  throw e;
}

var testPassed = false;
try {
  assert(false);
} catch (e) {
  testPassed = true;
}
if (testPassed !== true) {
  console.log('Assert did not throw an error for false');
  throw new Error('Assert did not throw an error for false');
}

// Begin testing Skeleton
test('Skeleton is a constructor', function () {
  assert(typeof Skeleton === 'function');
  var suite = new Skeleton();
  assert(typeof suite === 'object');
});

// Final message
console.log('ALL TESTS COMPLETED AND PASSING');

}());
