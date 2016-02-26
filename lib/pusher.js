"use strict";

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
        console.info('Message received from Pusher %o', data);
        // Sanatize data
        var message = Object.assign({
          title: "[Your message title]",
          detail: "[Your message text]"
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
    atom.notifications.addInfo(message.title, {
      detail: message.detail
    });

    this.history.push(message);
  }


}
