# Atom Pusher

This is an experimental package that shows notifications sent via [Pusher](http://pusher.com) in Atom.
Feel free to fork and improve.

![Screenshot](https://raw.githubusercontent.com/onderweg/atom-pusher/master/resources/screenshot.png)

Atom Pusher listens to the Pusher channel defined in the config, and shows
a notification whenever a message is received. Messages should have the
following format:

```json
{
  "id": "optional id",
  "title": "message title",
  "detail": "detail text",
  "description": "description text"
}
```
