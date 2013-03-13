/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('Module');

  test('DECADE_CITY module defined', function () {
    strictEqual(typeof window.DECADE_CITY, 'object', 'module defined.');
  });

  test('Register runs immediately when initialised', function () {
    window.DECADE_CITY.register(function() { window._register_test = 'registered'; });
    equal(window._register_test, 'registered', 'Function immediately invoked');
  });

  test('Register runs immediately when loaded', function () {
    window.DECADE_CITY.registerLoad(function() { window._register_load_test = 'registered'; });
    equal(window._register_load_test, 'registered', 'Function immediately invoked');
  });


  test('Resize function runs when resisze triggered', function () {
    window._register_resize_test = 'unregistered';
    window.DECADE_CITY.registerResize(function() { window._register_resize_test = 'registered'; });
    $(window).trigger('resize');
    equal(window._register_resize_test, 'unregistered', 'Function not immediately invoked');
    window.setTimeout(function() {
      //equal(window._register_resize_test, 'registered', 'Function invoked after delay');
    }, 500);
  });

}(window.jQuery));
