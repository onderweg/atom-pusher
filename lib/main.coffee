{CompositeDisposable} = require 'atom'
ipc = require("ipc")
Pusher = require './pusher.js'

module.exports = AtomPusher =

  config:
    pusherKey:
      type: 'string'
      description: 'Your Pusher application key'
      default: 'my-key'
    pusherChannel:
      type: 'string'
      description: 'Channel to push to'
      default: 'my-channel'

  activate: (state) ->

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register commands
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-pusher:show-test-message': => @notify()
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-pusher:replay-last-message': => @replay()
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-pusher:reconnect': => @reconnect()

    # Create Pusher client
    @pusher = new Pusher(
      atom.config.get('atom-pusher.pusherKey'),
      atom.config.get('atom-pusher.pusherChannel')
    );

    # Start listening to events; in timeout to reduce startup time
    setTimeout ( =>
      @pusher.listen()
    ), 0

  deactivate: ->
    @pusher.dispose()
    @subscriptions.dispose()

  replay: ->
    @pusher.replay()

  reconnect: ->
    @pusher.reconnect()

  notify: ->

    @pusher.push({
        title: 'Test message from Atom Pusher',
        detail: 'Message detail',
        description: 'Message description'
        link: 'https://www.atom.io'
    });

    console.info('Message pushed');
