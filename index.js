var restify   = require('restify');
var mongoose  = require('mongoose');

var uriString =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/wedding';

var port = process.env.PORT || 5000;

var Reservation;

mongoose.connect(uriString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo Connection error:'));

db.once('open', function (callback) {
  var Schema    = mongoose.Schema;
  var ReservationSchema = new Schema({
    name:   { type: String, index: { unique: true }},
    date:   Date,
    guests: Array
  });

  Reservation = mongoose.model('Reservation', ReservationSchema);

  var server = restify.createServer({
    serverName:   'Wedding',
    accept:       ['application/json', 'text/plain']
  });

  server.use(restify.fullResponse())
        .use(restify.bodyParser());

  server.post('/reservations', createReservation);
  server.get('/reservations', listReservations);
  server.get('/reservations/:name', getReservation);
  server.put('/reservations/:name', updateReservation);

  server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
  })
});

var createReservation = function(req, res, next) {
  // We first check to see if there's no other reservation under that name
  console.log(req.body);
  var reservationModel = new Reservation(req.body);
  reservationModel.save(function(error, reservation) {
    if(error) {
      if(error.code == 11000) {
        res.status(409);
        res.json({
          type: false,
          data: error
        });
      }
      else {
        res.status(500);
        res.json({
          type: false,
          data: 'Error: ' + error
        })
      }
    }
    else {
      res.status(201);
      res.json({
        type: true,
        data: reservation
      })
    }
  });

  next();
};

var getReservation = function(req, res, next) {
  Reservation.findOne({ name: req.params.name }, function(error, reservation) {
    if(error) {
      res.status(500);
      res.json({
        type: false,
        data: 'Error: ' + error
      })
    }
    else {
      if(reservation) {
        res.status(200);
        res.json({
          type: true,
          data: reservation
        })
      }
      else {
        res.status(404);
        res.json({
          type: false,
          data: 'Reservation with name ' + req.params.name + ' not found'
        });
      }
    }
  });

  next();
};

var listReservations = function(req, res, next) {
  Reservation.find(req.body, function(error, reservations) {
    if(error) {
      res.json({
        type: false,
        data: 'Error: ' + error
      })
    }
    else {
      if(reservations && reservations.length > 0) {
        res.status(200);
        res.json({
          type: true,
          data: reservations
        })
      }
      else {
        res.status(404);
        res.json({
          type: false,
          data: 'there are no reservations.'
        });
      }
    }
  });

  next();
};

var updateReservation = function(req, res, next) {
  var reservationModel = new Reservation(req.body);
  reservationModel.findOneAndUpdate({ name: req.params.name }, function(error, reservation) {
    if(error) {
      res.status(500);
      res.json({
        type: false,
        data: 'Error: ' + error
      })
    }
    else {
      if(response) {
        res.json({
          type: true,
          data: reservation
        })
      }
      else {
        res.status(404);
        res.json({
          type: false,
          data: 'Reservation with name ' + req.params.name + ' not found'
        });
      }
    }
  });
  next();
};