"use strict";

var shell = require('shell');
var PusherClient = require('pusher-client');

module.exports = class Pusher {

  constructor(key, channel) {
    this.pusherKey = key;
    this.channelName = channel;
    this.history = [];
  }

  listen() {
    var socket = new PusherClient(this.pusherKey);

    // Bind socket events
    socket.connection.bind('disconnected', function() {
      var text = "Pusher socket disconnected";
      console.warn(text);
      atom.notifications.addWarning(text);
    });
    socket.connection.bind('error', function(err) {
      var text = "Pusher socket error: " + err.error;
      console.error(err);
      atom.notifications.addError(text);
    });

    // Subscribe
    var my_channel = socket.subscribe(this.channelName);
    var self = this;
    socket.bind_all(function(event, data) {
        // Debug
        console.info('🚀 Message received from Pusher %o', data);
        // Sanitize data
        var message = Object.assign({
          title: "[Your message title]",
          detail: null,
          description: null,
          link: null
        }, data);

        // Show notification
        self.push(message);
      }
    );
    console.info('Listening to Pusher socket...');
  }

  replay() {
    var message = this.history.pop();
    if (message !== undefined) {
      this.push(message);
    }
  }

  push(message) {
    var options = {};
    if (message.detail) {
      options.detail = message.detail;
    }
    if (message.description) {
      options.description = message.description;
    }

    if (message.link) {
      options.buttons = [{
        text: 'Open',
        className: 'btn-one',
        onDidClick: function() {
          shell.openExternal(message.link)
        }
      }]
    }
    atom.notifications.addInfo(message.title, options);

    this.history.push(message);
  }


}
