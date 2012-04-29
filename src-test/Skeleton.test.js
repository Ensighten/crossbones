(function () {
var test = Splat.test,
    assert = Splat.assert;

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
console.log('BEGIN TESTING: Skeleton helpers');


test('Skeleton can set an async flag on a function', function () {
  var myFn = function () {},
      myAsyncFn = Skeleton.async(myFn);
  assert(myAsyncFn.SKELETON_ASYNC);
  assert(myFn === myAsyncFn);
});

// TODO: Test these
  // 'can wrap a function with a before and after method': '',
  // 'can wrap a context with beforeEach and afterEach methods': ''
  // // TODO: beforeAll, afterAll methods -- beforeAll is good with topic, but afterAll has no location =/

console.log('END TESTING: Skeleton helpers');

// Final message
console.log('ALL TESTS COMPLETED AND PASSING');

}());
