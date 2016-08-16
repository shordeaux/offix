var _ = require('lodash');

var User = require('../models/user.js');
var Device = require('../models/device.js');

var ApiController = module.exports = {};

ApiController.users = function(req, res) {
  User.find({}, function(err, users) {
    var sorted = _.sortBy(users, function(user) {
      if (user.lastSeen) {
        return -user.lastSeen.getTime(); // negative to sort in descending order
      } else {
        return 0; // never
      }
    });
    var data = _.map(sorted, function(user) {
      return {
        username: user.username,
        realName: user.realName,
        lastSeen: user.lastSeen || null,
        // can use `new Date(lastSeen)` to turn this back into a date
        shouldBroadcast: user.shouldBroadcast,
      };
    });
    res.json(data);
  });
};

ApiController.devices = function(req, res) {
  var dateOffset = (24*60*60*1000) * 1; //1 day
  var yesterday = new Date();
  yesterday.setTime(yesterday.getTime() - dateOffset);
  Device.find({"lastSeen": {"$gte": yesterday}}, function(err, devices) {
    var sorted = _.sortBy(devices, function(device) {
      if (device.lastSeen) {
        return -device.lastSeen.getTime(); // negative to sort in descending order
      } else {
        return 0; // never
      }
    });
    var data = _.map(sorted, function(device) {
      return {
        mac: device.mac,
        lastSeen: device.lastSeen || null
      };
    });
    res.json(data);
  });
};
