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
    self.findOne(conditions, function(err, result) {
            if(result) {
                self.update(conditions, {lastSeen: new Date()}, function (err, count) {
                    debug('A device has been updated: ' + conditions.mac);
                    //callback(err, result, true);
                });
            }else{
                if(err){
                    debug(err);
                }else{
                    var obj = new Device(conditions);
                    obj.save(function(err) {
                        debug('A device has been created: ' + conditions.mac);
                        //callback(err, obj, true);
                    });
                }
        }
    });
};


deviceSchema.plugin(findOrCreate);
Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
