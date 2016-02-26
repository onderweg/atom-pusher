{CompositeDisposable} = require 'atom'
Pusher = require './pusher.js'

module.exports = AtomPusher =

  config:
    pusherKey:
      type: 'string'
      description: 'Pusher key'
      default: 'my-key'
    pusherChannel:
      type: 'string'
      description: 'Channel to push to'
      default: 'my-channel'

  activate: (state) ->

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-pusher:show-test-message': => @notify()
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-pusher:replay-last-message': => @replay()

    # Create Pusher client
    @pusher = new Pusher(
      atom.config.get('atom-pusher.pusherKey'),
      atom.config.get('atom-pusher.pusherChannel')
    );

    # Start listening to events
    @pusher.listen()

  deactivate: ->
    @subscriptions.dispose()

  replay: ->

    @pusher.replay()

  notify: ->

    @pusher.push({
        title: 'Test message from Atom Pusher'
    });

    console.info('Message pushed');
