/**
 * RUM data collection.
 */
define(function(require) {
  "use strict";

  var config = require('config'),
      module = require('module'),
      cookies = require('cookies'),
      sessionStorage = require('sessionStorage');

  var submodule = {};
  var vars = {},
      url = config.beacon_url,
      timing = !!(typeof window.performance !== "undefined" && typeof window.performance.timing !== "undefined");

  /**
   * Adds a variable to the internal register.
   *
   * @param name {String} Name of variable to add.
   * @param value {String} Value of variable.
   */
  submodule.addVar = function (name, value) {
    if (typeof name === "string") {
      vars[name] = value;
    }
    else if (typeof name === "object") {
      var data = name,
          key;
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          vars[key] = data[key];
        }
      }
    }
  };

  // Add some information we know at this stage.
  submodule.addVar({
    'noscript': 0,
    'r': document.referrer,
    'u': window.location.href
  });

  submodule.addVar({
    'b_height': window.document.documentElement['clientHeight'],
    'b_width': window.document.documentElement['clientWidth']
  });

  /**
   * Sends the tracking data.
   */
  var sendBeacon = function () {
    var params = [],
        seperator = '?',
        key, img;
    if (vars && url) {
      if (url.search(/\?/) > -1) {
        // There's already a '?' in the URL so we need to add params.
        seperator = '&';
      }
      for (key in vars) {
        if (vars.hasOwnProperty(key)) {
          params.push(key + '=' + encodeURIComponent(vars[key]));
        }
      }
      img = new Image();
      img.src = url + seperator + params.join('&');
    }
  };

  /**
   * Initialise submodule and set vars known at DOMReady.
   */
  var init = function () {
    var t_done;
    if (true) { //TODO - fix debug.
      // If we're in debug mode then we expose the vars for testing.
      submodule.getVars = function () {
        return vars;
      };
    }
    if (!timing) {
      // Need to use storage to get the navigation start time.
      window.addEventListener('beforeunload', function () {
        if (sessionStorage.supported) {
          sessionStorage.setItem('t_navigation_start', new Date().getTime());
        } else {
          cookies.setItem('t_navigation_start', new Date().getTime(), false, '/');
        }
      });
    }
    if (timing) {
      // Override any in-page timer.
      window.t_pagestart = window.performance.timing.responseEnd;
    }
    if (!window.t_domready) {
      if (timing) {
        window.t_domready = window.performance.timing.domInteractive;
      } else {
        window.t_domready = new Date().getTime(); // Hit and hope.
      }
    }
  };

  /**
   * Final timing values and send beacon.
   */
  var main = function() {
    var t_onload = window.t_onload || new Date().getTime(), // Should have been set but if not then hit and hope.
        t_navigation_start,
        t_done,
        onload;

    // Collect the remaining timing data.
    if (timing) {
      t_onload = window.performance.timing.loadEventStart;
      t_done = window.performance.timing.responseEnd - window.performance.timing.navigationStart;
      onload = t_onload - window.t_pagestart;
    } else {
      // Pull the navigation start from storage if we have it.
      if (sessionStorage.supported) {
        t_navigation_start = sessionStorage.getItem('t_navigation_start');
      } else {
        t_navigation_start = cookies.getItem('t_navigation_start');
      }
      // Collect data if available.
      if (t_navigation_start && window.t_pagestart) {
        t_done = window.t_pagestart - t_navigation_start;
        onload = t_onload - window.t_pagestart;
      }
    }

    // Now we have the data we set the variables.
    if (window.t_pagestart && window.t_domready) {
      submodule.addVar('t_domready', window.t_domready - window.t_pagestart);
      if (window.t_headend) {
        submodule.addVar('t_head', window.t_headend - window.t_pagestart);
        if (window.t_bodyend) {
          submodule.addVar('t_body', window.t_bodyend - window.t_headend);
        }
      }
    }
    if (t_done) {
      submodule.addVar('t_done', t_done);
    }
    if (onload) {
      submodule.addVar('t_onload', onload);
    }
    if (window.t_jsstart && window.t_jsend) {
      submodule.addVar('t_js', window.t_jsend - window.t_jsstart);
    }
    if (window.t_cssstart && window.t_cssend) {
      submodule.addVar('t_css', window.t_cssend - window.t_cssstart);
    }

    // Finally, send the data after a delay.
    window.setTimeout(sendBeacon, 500);
  };

  submodule.timing = timing;
  submodule.ready = init;
  submodule.load = function() {
    // Need onload to have had a chance to finish to get timings.
    window.t_onload = new Date();
    window.setTimeout(main, 500);
  };

  return submodule;

});
