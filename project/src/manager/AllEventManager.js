module.exports = function () {
    /**
     * 
     * @type Boolean
     */
    var DEBUG = false;
    /**
     * 
     * @type String
     */
    var VERSION = "0.1";
    /**
     * 
     * @type EventManager.contructor
     */
    var EventManager = (require("project/src/manager/EventManager.js"))();
    /**
     * 
     * @type EventManager
     */
    var _groups = {};
    /**
     * 
     * @type EventManager
     */
    var _defaultEventManager;

    /**
     * 
     * @returns {AllEventBus}
     */
    function AllEventBus() {
        /**
         * 
         * @param {object} context
         * @param {string} group
         * @returns {undefined}
         */
        this.register = function (context, group) {
            if(!group) {
                if(!_defaultEventManager) {
                    _defaultEventManager = new EventManager("Default");
                }
                
                _defaultEventManager.register(context);
            } else {
                if (typeof group === "string") {
                    if(!(group in _groups)) {
                        _groups[group] = new EventManager(group);
                    }
                    _groups[group].register(context);
                } else {
                    throw new Error("Illegal group " + group);
                }
            }
        };

        /**
         * 
         * @param {object} context
         * @param {string} group
         * @returns {undefined}
         */
        this.unregister = function (context, group) {
            if(!group) {
                if(_defaultEventManager) {
                    _defaultEventManager.unregister(context);
                    
                    if(!_defaultEventManager.hasMembers()) {
                        _defaultEventManager = null;
                    }
                }
            } else {
                if (typeof group === "string") {
                    if (group in _groups) {
                        _groups[group].unregister(context);

                        if (!_groups[group].hasMembers()) {
                            delete _groups[group];
                        }
                    }
                } else {
                    throw new Error("Illegal group " + group);
                }
            }
        };

        /**
         * 
         * @param {string} eventName
         * @param {object} data
         * @param {string} group The group name of which event group the event
         * should be dispatched, or null if to dispatch in all groups (global)
         * @returns {undefined}
         */
        this.dispatchEvent = function (eventName, data, group) {
            if(!group) {
                /*
                 * No group given, dispatching the event on global scope.
                 */
                if(_defaultEventManager) {
                    _defaultEventManager.dispatchEvent(eventName, data);
                }
            } else if(typeof group === "string") {
                /*
                 * Group is given.
                 */
                if (group === "*") {
                    /*
                     * Global group is given, dispatching event in all groups.
                     */
                    for (var groupName in _groups) {
                        if (_groups.hasOwnProperty(groupName)) {
                            _groups[groupName].dispatchEvent(eventName, data);
                        }
                    }
                } else {
                    /*
                     * Specific group is given, dispatching event in specified
                     * group.
                     */
                    if (group in _groups) {
                        _groups[group].dispatchEvent(eventName, data);
                    }
                }
            } else {
                /*
                 * 
                 * @returns {undefined}
                 */
                throw new Error("Illegal group " + group);
            }
        };

        /**
         * 
         * @returns {undefined}
         */
        this.clear = function () {
            _defaultEventManager = null;
            _groups = {};
        };
    }

    return new AllEventBus();
};