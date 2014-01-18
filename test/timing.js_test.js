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

  module('Timing');

  test('TIMING submodule defined', function () {
    strictEqual(typeof window.DECADE_CITY.TIMING, 'object', 'submodule defined.');
  });

  // This needs to be run in a browser - won't work with Phantom.
  $(window).on('load', function () {
    window.setTimeout(function () {
      asyncTest('Timing functionality', function () {
        var vars = window.DECADE_CITY.TIMING.getVars();
        ok(vars.hasOwnProperty('b_height'), '`b_height` set.');
        ok(vars.hasOwnProperty('b_width'), '`b_width` set.');
        ok(vars.hasOwnProperty('noscript'), '`noscript` set.');
        ok(vars.hasOwnProperty('r'), '`r` set.');
        ok(vars.hasOwnProperty('t_body'), '`t_body` set.');
        ok(vars.hasOwnProperty('t_css'), '`t_css` set.');
        ok(vars.hasOwnProperty('t_domready'), '`t_domready` set.');
        ok(vars.hasOwnProperty('t_done'), '`t_done` set.');
        ok(vars.hasOwnProperty('t_head'), '`t_head` set.');
        ok(vars.hasOwnProperty('t_js'), '`t_js` set.');
        ok(vars.hasOwnProperty('t_onload'), '`t_onload` set.');
        ok(vars.hasOwnProperty('u'), '`u` set.');
        start();
      });
    }, 200);
  });

}(window.jQuery));
