/* FantasyMaps chart-room map bootstrap.
 * Lazy-loads MapLibre GL JS (script + CSS) from a CDN once the chart-room
 * map enters the viewport, then hands off to MapLibre against the configured
 * style URL. Sets a data-state on the container so the CSS can render the
 * "CHARTING…" or "Live map unavailable" plates without needing JS to draw.
 */

(function () {
  'use strict';

  var MAPLIBRE_JS  = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js';
  var MAPLIBRE_CSS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css';

  function loadCss(href) {
    if (document.querySelector('link[data-mlg]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.setAttribute('data-mlg', '');
    document.head.appendChild(l);
  }

  var jsPromise = null;
  function loadJs(src) {
    if (jsPromise) return jsPromise;
    jsPromise = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return jsPromise;
  }

  function readConfig(el) {
    var key = el.dataset.config;
    var styleUrl = el.dataset.style;
    var lng = parseFloat(el.dataset.lng);
    var lat = parseFloat(el.dataset.lat);
    var zoom = parseFloat(el.dataset.zoom);
    if (key) {
      var sel = '[data-chart-config="' + key.replace(/"/g, '\\"') + '"]';
      var node = document.querySelector(sel);
      if (node) {
        try {
          var c = JSON.parse(node.textContent);
          if (c.style) styleUrl = c.style;
          if (c.lng != null) lng = parseFloat(c.lng);
          if (c.lat != null) lat = parseFloat(c.lat);
          if (c.zoom != null) zoom = parseFloat(c.zoom);
        } catch (e) { /* fall through to data-* */ }
      }
    }
    return { styleUrl: styleUrl, lng: lng, lat: lat, zoom: zoom };
  }

  function initOne(el) {
    if (el.dataset.bootstrapped) return;
    el.dataset.bootstrapped = '1';

    var cfg = readConfig(el);
    var styleUrl = cfg.styleUrl;
    var lng = cfg.lng, lat = cfg.lat, zoom = cfg.zoom;

    if (!styleUrl) {
      el.dataset.state = 'error';
      return;
    }

    el.dataset.state = 'loading';

    loadCss(MAPLIBRE_CSS);
    loadJs(MAPLIBRE_JS).then(function () {
      try {
        var map = new window.maplibregl.Map({
          container: el,
          style: styleUrl,
          center: [
            isFinite(lng) ? lng : 0,
            isFinite(lat) ? lat : 0
          ],
          zoom: isFinite(zoom) ? zoom : 2,
          attributionControl: false,
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false
        });

        map.on('load', function () { el.dataset.state = 'ready'; });
        map.on('error', function () { el.dataset.state = 'error'; });

        map.addControl(new window.maplibregl.NavigationControl({
          showCompass: false, showZoom: true, visualizePitch: false
        }), 'bottom-right');
      } catch (err) {
        el.dataset.state = 'error';
      }
    }).catch(function () {
      el.dataset.state = 'error';
    });
  }

  function start() {
    var nodes = document.querySelectorAll('[data-chart-map]');
    if (!nodes.length) return;

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(initOne);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          initOne(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    nodes.forEach(function (n) { io.observe(n); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
