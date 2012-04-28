// TODO: Step back from vows and review perspective (i.e. what is the golden BDD engine?)
// TODO: async() will set an async flag on functions themselves and pass through a this.callback handler
(function () {
/**
 * Constructor for a Skeleton (test suite)
 * @param {String} name Name to call this test suite (may not apply to all BDD)
 */
function Skeleton(name) {
  // Fallback name
  name = name || '';
  this.name = name;
  this.batches = [];
}

// Static methods for Skeleton
Skeleton.modules = {};

/**
 * Static module handler for test engines
 * @param {String} name Name of module to add
 * @param {Function} fn Function that will process batches
 */
Skeleton.addModule = function (name, fn) {
  Skeleton.modules[name] = fn;
};

// Prototypal setup for Skeleton
Skeleton.prototype = {
  /**
   * Method to add test batches to this test suite
   * @param {Object} batch Batch of tests to add to this test suite
   * @param {Object} batch.* Context containing a set of tests to run
   * @param {Function} batch.*.topic Topic function which takes the place of 'describe' in Mocha and 'topic' in Vows
   * @param {Function} batch.*.* Function that will run a test on the current topic
   * @param {String} batch.*.* Placeholder for a test that will be created later. These will be skipped for test suites that don't support them
   * @returns {this} Skeleton test suite that is being worked on
   */
  'addBatch': function (batch) {
    this.batches.push(batch);
    return this;
  },
  /**
   * Run method for a test suite (currently only supporting Mocha)
   * @param {Function|String} engineName If a function, Skeleton will process via it. Otherwise, Skeleton will retrieve the engine from its modules.
   * @returns {Mixed} Returns result of engine
   */
  'exportTo': function (engineName) {
    var engine = engineName;

    // If the engine is not a function, retrieve it from the modules
    if (typeof engine !== 'function') {
      engine = Skeleton.modules[engineName];
    }

    // If the engine is not a function, throw an error
    if (typeof engine !== 'function') {
      throw new Error('Test engine was not found: ' + engineName);
    }

    // Run and return the engine in the context of this with batches as the first parameter
    return engine.call(this, this.batches);
   }
};

// Export to global scope
// TODO: Prepare for node, requirejs, etc
window.Skeleton = Skeleton;
}());