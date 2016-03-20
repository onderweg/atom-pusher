"use strict";

var shell = require('shell');
var PusherClient = require('pusher-client');

module.exports = class Pusher {

  constructor(key, channel) {
    this.pusherKey = key;
    this.channelName = channel;
    this.history = [];
    this.socket = null;
  }

  listen() {
    var socket = this.socket = new PusherClient(this.pusherKey);

    // Bind socket events
    socket.connection.bind('disconnected', function() {
      console.warn("Pusher socket disconnected");
    });
    socket.connection.bind('error', function(err) {
      var text = "Pusher socket error: " + err.error;
      console.error(err);
      atom.notifications.addError(text);
    });
    socket.connection.on('connected', function() {
      atom.notifications.addSuccess('Connected to Pusher');
      console.debug('Connected to Pusher');
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
        if (message.title == null) {
          message.title = ""; // can't be null
        }

        // Show notification
        self.push(message);
      }
    );
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

  reconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  dispose() {
    this.disconnect();
  }

}
