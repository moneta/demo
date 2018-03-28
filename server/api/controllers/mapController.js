'use strict';

const GOOGLE_API_KEY = 'AIzaSyAcYLFCr4zVtYoPvNiQyxtmUtdlXasabVY';

var googleMapsClient = require('@google/maps').createClient({
  key: GOOGLE_API_KEY
});

exports.list_all_polygons = function(req, res) {
  const polygon = {
    status: 'OK',
    data:[
      [
        { lat: 37.77668498313053, lng: -122.46339797973633 },
        { lat: 37.80476580072879, lng: -122.43232727050781 },
        { lat: 37.79323632157157, lng: -122.38460540771484 },
        { lat: 37.74262098278526, lng: -122.39044189453125 },
        { lat: 37.740992032124666, lng: -122.43833541870117 },
      ],
    ],
  };

  res.json(polygon);
};



exports.read_a_polygon = function(req, res) {
  var address = req.params.address;
  console.log('Here I go:', address);

  googleMapsClient.geocode({
    address,
  }, function(err, response) {
    console.log(response);
    if (!err) {
      res.send(response.json);
    }
  });
};
