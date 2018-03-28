'use strict';

module.exports = function(router) {
  const map = require('../controllers/mapController');

  router.route('/polygons')
    .get(map.list_all_polygons)


  router.route('/polygons/:address')
    .get(map.read_a_polygon)

  return router;
};
