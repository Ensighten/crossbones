(function () {
function noop() {}

/**
 * Splat: Super-simple flat testing framework
 */
var alert = window.alert || noop,
    console = window.console || { 'log': noop, 'error': function (msg) { alert(msg); } },
    Splat = {
      'isNotMuted': true,
      'mute': function () {
        Splat.isNotMuted = false;
      },
      'unmute': function () {
        Splat.isNotMuted = true;
      },
      'log': function () {
        var args = [].slice.call(arguments),
            msg = args.join('');
        if (Splat.isNotMuted) {
          console.log(msg);
        }
      },
      'error': function () {
        var args = [].slice.call(arguments),
            msg = args.join('');
        if (Splat.isNotMuted) {
          console.error(msg);
        }
      },
      'test': function (name, fn) {
        try {
          fn();
        } catch (e) {
          Splat.error('TEST FAILED: ', name);
          throw e;
        }
        Splat.log('TEST PASSED: ', name);
      },
      'testAsync': function (name, fn, callback) {
        var errTimeout = setTimeout(function () {
              Splat.error('TEST TIMED OUT: ', name);
              throw new Error('Test timed out: ' + name);
            }, 2000),
            asyncThis = {
              'callback': function () {
                clearTimeout(errTimeout);
                Splat.log('TEST PASSED: ', name);
                callback();
              }
            };

        try {
          fn.call(asyncThis);
        } catch (e) {
          Splat.error('TEST FAILED: ', name);
          throw e;
        }
      },
      'assert': function (bool) {
        if (bool !== true) {
          throw new Error('Assert expected: true, received: ' + bool);
        }
      }
    },
    test = Splat.test,
    assert = Splat.assert;

// Mute splat for the purposes of testing
Splat.mute();

/*** TESTING TEST (Part I) ***/

// Passing test for test
var testWasRun = false;
test('Testing test', function () {
  testWasRun = true;
});

// If the test did not work, report so
if (testWasRun !== true) {
  console.error('Test was not run');
  throw new Error('Test function is broken');
}

/*** TESTING TEST (Part II) ***/

// Testing out the test function
var testWorked = true;
try {
  test('Testing test', function () {
    throw new Error('pass');
  });
  testWorked = false;
} catch (e) {
}

// If the test did not work, report so
if (testWorked !== true) {
  console.error('Test does not capture errors');
  throw new Error('Test function is broken');
}

/*** TESTING ASSERT ***/

try {
  assert(true);
} catch (e) {
  console.error('Assert threw an error for true');
  throw e;
}

var testPassed = false;
try {
  assert(false);
} catch (e) {
  testPassed = true;
}
if (testPassed !== true) {
  console.error('Assert did not throw an error for false');
  throw new Error('Assert did not throw an error for false');
}

/*** TESTING ASYNC ***/
var asyncTimeout = setTimeout(function () {
  console.error('Async callback was not called');
  throw new Error('Async callback was not called');
}, 1000);
Splat.testAsync('Async test', function () {
  var callback = this.callback;
  setTimeout(callback, 100);
}, function () {
  clearTimeout(asyncTimeout);
});

/*** END OF TESTING ***/
// Log the end of Splat tests
console.log('Splat successfully tested');

// Unmute Splat
Splat.unmute();

// Expose Splat to the window scope
window.Splat = Splat;
}());