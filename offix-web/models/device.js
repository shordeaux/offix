var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var errors = require('../utils/errors');

deviceSchema = new mongoose.Schema({
    mac: {type: String, unique: true, required: true},
    lastSeen: Date
    // we're not currently collecting historical data, and we're not associating
    // last seen times with specific MAC addresses
});

deviceSchema.statics.seen = function (address) {
    var conditions = {mac: address};

    this.findOrCreate(conditions, {lastSeen: new Date()}, function (err, device, created) {
        if (!created) {
            device.lastSeen = new Date();
            device.save(function (err) {
                if (err) {
                    console.log('err: ' + err);
                }
            });
        }
    });
};


deviceSchema.plugin(findOrCreate);
Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
