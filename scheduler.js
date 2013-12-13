var moment       = require('moment')
,   _            = require('underscore')
,   uuid         = require('node-uuid')
,   http         = require('http')
,   querystring  = require('querystring')
,   mbc          = require('mbc-common')
,   Sketch       = require('mbc-common/models/Sketch')
,   collections  = mbc.config.Common.Collections
,   logger       = mbc.logger().addLogger('webvfx_scheduler')
,   conf         = mbc.config.Webvfx
,   eventManager = require('./EventManager')
;

function scheduler() {
}

scheduler.prototype.initScheduler = function() {
    logger.info("Starting Scheduler");
    var self = this;
    var db = mbc.db();
    self.schedules = db.collection(collections.SketchSchedules);
    self.sketchs = db.collection(collections.Sketchs);
    self.loadedSchedules = [];
    self.checkSchedules();
};

scheduler.prototype.checkSchedules = function() {
    var self = this;
    logger.debug("Checking schedules...");
    logger.debug("Loaded schedules:", self.loadedSchedules);
    var now = moment().valueOf();
    var currentScheds = [];
    var query = {};
    query.date = { $lte: now };
    self.schedules.findItems(query, function(err, scheds) {
        if (err) {
            logger.error("Error obtaining schedules: ", err);
            return;
        }
        if (scheds) {
            logger.debug("Processing sched list:", scheds);
            scheds.forEach(function(sched) {
                logger.debug("Processing sched:", sched);
                if (sched.length) {
                    logger.debug("Checking sched length:", sched.length);
                    var end = sched.date + sched.length;
                    if (end > now) {
                        if (_.findWhere(self.loadedSchedules, {_id: sched._id}) === undefined)
                            self.addSched(sched);
                        currentScheds.push(sched);
                    } else {
                        //TODO: Delete schedule from db...
                        self.removeSched(sched);
                    }
                } else {
                    logger.debug('Infinite sched');
                    if (_.findWhere(self.loadedSchedules, {_id: sched._id}) === undefined)
                        self.addSched(sched);
                    currentScheds.push(sched);
                }
            });
        }
        _.each(self.loadedSchedules, function(sched) {
            logger.debug('Checking current scheds');
            if (_.findWhere(currentScheds, {_id: sched._id}) === undefined) {
                logger.debug('Found sched to remove:', sched);
                self.removeSched(sched);
            }
        });
        setTimeout(self.checkSchedules.bind(self), 1000);
    });
};

scheduler.prototype.addSched = function(sched) {
    logger.info("Adding sched:", sched);
    var self = this;
    self.sketchs.findById(sched.sketch_id, function(err, sketch) {
        _.each(sketch.data, function(s) {
            logger.debug("Adding object:", s);
            var element = {};
            //TODO: UGLY HACK FOR NOT REPEATING IDS
            element.id = sched._id + "---" + s.id;
            if (s.type === 'image') {
                if (s.top)
                    element.top = s.top + 'px';
                if (s.left)
                    element.left = s.left + 'px';
                if (s.height)
                    element.height = s.height + 'px';
                if (s.width)
                    element.width = s.width + 'px';
                element.type = 'image';
                element.src = (conf.server || 'http://localhost:3100') + '/uploads/' + s.name;
                eventManager.addImage(element);
            } else {
                element.type = 'widget';
                s.id = element.id;
                element.options = JSON.stringify(s);
                eventManager.addWidget(element);
            }
        });
        self.loadedSchedules.push(sched);
    });
};

scheduler.prototype.removeSched = function(sched) {
    logger.info("Removing sched:", sched);
    var self = this;
    self.sketchs.findById(sched.sketch_id, function(err, sketch) {
        _.each(sketch.data, function(s) {
            logger.debug("Removing object", s);
            //TODO: UGLY HACK FOR NOT REPEATING IDS
            var id = sched._id + "---" + s.id;
            eventManager.removeElement(id);
        });
        self.loadedSchedules = _.reject(self.loadedSchedules, function(s) {
            return s._id === sched._id;
        });
    });
};

exports = module.exports = function(conf) {
    var sched = new scheduler();
    return sched;
};
