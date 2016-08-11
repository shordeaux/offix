var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var async = require('async');

var errors = require('../utils/errors');

deviceSchema = new mongoose.Schema({
  mac: {type: String, unique: true, required: true},
  lastSeen: Date,
  // we're not currently collecting historical data, and we're not associating
  // last seen times with specific MAC addresses
});

deviceSchema.statics.seen = function(address, callback) {
  // there really shouldn't be more than one, but if there is, just update all
  // of them
  var now = new Date();
  this.find({mac: address}, function(err, devices) {
    async.map(devices, function(device, callback) {
      devices.lastSeen = now;
      devices.save(callback);
    }, callback);
  });
};

Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
