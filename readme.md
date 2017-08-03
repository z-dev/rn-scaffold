## Getting started

First run: `npm install`

Then run:

* Run `npm run start` to run the app
* Run `npm run start:debug` to debug the app in chrome debugger

### Debugging

Run `npm run start:debug` and then open the link provided to you to debug.

If your process doesn't run for long (It's not a web server or something). Then the debugger won't attach before the program finishes!

`npm run start:debug -- --debug-brk` <- pauses the program on the first line so you can attach with plenty of time.

At this point you'll notice your files aren't in the debugger, so you still can't debug.

You can fix this using `debugger;` in your code:

Add a `debugger;` line in your code somewhere.

Now debug again. When you press play, you'll go to that `debugger` line you set. Everything works fine from there.
