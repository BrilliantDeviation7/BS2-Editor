https://developer.chrome.com/docs/capabilities/serial

https://developer.mozilla.org/en-US/docs/Web/API/Streams_API

https://forum.arduino.cc/t/incoming-serial-messages-get-split-into-multiple/701769/6

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

# 9/18/2024

new Buffer() in bs2-programmer library needs to be updated.

learned about `events` and `re-emitter` packages

Old and new class syntax: https://javascript.info/class

can use function User() or class User {

}

My testing program

```
'{$STAMP BS2}
'{$PBASIC 2.5}

DEBUG "hello", CR
END
```

Used [my website tool](https://www.kevinzhu.dev/apps/stringify) to turn into a string

# 9/19/2024

studying output of compile.js in Desktop/LHS/robotics folder

This code is from the `bs2-serial` library!!

thigns to look up:

- EEPROM
  - https://learn.sparkfun.com/tutorials/reading-and-writing-serial-eeproms/all
- PacketBuffer

internalCompile() in test.js

```
function internalCompile(source) {
  var TModuleRec = bs2tokenizer.compile(source, false);

  var program = {
    data: TModuleRec.PacketBuffer.slice(0, TModuleRec.PacketCount * 18),
    name: TModuleRec.TargetModuleName,
    error: !TModuleRec.Succeeded ? TModuleRec.Error : null,
    raw: TModuleRec,
  };

  return program;
}
```

Looks like EEPROM property isn't used (actually i'm not sure because the whole object is included in raw property anyways)

Also found this PDF about how pbasic-tokenizer works:
https://www.npmjs.com/package/pbasic-tokenizer

https://forums.parallax.com/discussion/download/69828/Using%20the%20PBASIC%20Tokenizer%20Libr.pdf

Read from page 18 (according to table on page 6)

PacketCount
PacketBuffer

Use the example program on page 18 to test taht the JS is also working and produces the same PacketBuffer

I found https://npm.io/package/pbasic-tokenizer (npm.io), which just seems to be a faster version of npmjs.com

## My process

- start from parent repo
- look at which properties are used and which aren't

## next steps

Looks like that's all that the pbasic-tokenizer library does. Everything else in test.js in my robotics folder seems to come from `bs2-programmer`, so that's what I'll look at next.

https://www.rcuniverse.com/forum/rc-radios-transmitters-receivers-servos-gyros-157/996494-basic-stamp-eeprom-write-read.html

https://www.mouser.com/pdfDocs/28125-Getting-Started-from-Help-v25.pdf

https://hackaday.com/2015/08/27/before-arduino-there-was-basic-stamp-a-classic-teardown/

https://forums.parallax.com/discussion/131299/tutorial-retrieving-eeprom-data-from-basic-stamp-modules

http://mcmanis.com/chuck/Robotics/stamp-decode.html

# 9/21/2024

https://www.shadcn-svelte.com/docs/installation/vite

Added tailwind and shadcn:

- [svelte-add](https://github.com/svelte-add/svelte-add/)
- shadcn-svelte's [`Resizable` component](https://www.shadcn-svelte.com/docs/components/resizable)

Started off with Vite + Svelte, but I think to have the file system it is better to use sveltekit? I want to be able to use `<a>` tags in the code, so I think I will need SvelteKit.

Add prettier plugin, prettier, prettier-plugin-svelte

- https://github.com/sveltejs/prettier-plugin-svelte

When I switch to SvelteKit, I won't have to do this manually.

Encountered issue with flex items overflowing. Fixed by setting `min-height: 0` ([reddit comment's explanation](https://www.reddit.com/r/webdev/comments/alg8az/comment/effcldd/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button))

# 9/22/2024

10AM: worked on drafting a menubar with all the options, changed some very minor spacing

TODO:

- investigate which packages need to be converted to Web Serial API
- ~~how to get code editor syntax highlighting?~~

Should it be called "download" or "upload" to board?
https://forum.arduino.cc/t/upload-and-download-arduino/485335

# 9/23/2024

initial searches: https://stackoverflow.com/questions/32991932/codemirror-how-to-create-a-mode

read thru codemirror documentation

https://github.com/touchifyapp/svelte-codemirror-editor, https://github.com/plutoniumm/sveltemirror

- see "usage with vite" section

convert to ES6: https://www.reddit.com/r/sveltejs/comments/vc7cnw/require_is_not_defined/

Look at [vb.js](https://github.com/codemirror/legacy-modes/blob/57e2fc9515c16e1a403f4bbb52ecff89da84f6f1/mode/vb.js#L155) in `codemirror/legacy-modes` on how to convert old PBASIC language mode for latest Codemirror version (V6).

V5 stuff, but I didn't really need this:

- https://codemirror.net/5/demo/simplemode.html
- https://codemirror.net/5/doc/manual.html#modeapi
- https://snyk.io/advisor/npm-package/codemirror/functions/codemirror.defineMode

disappeared v4 docs:

- https://github.com/brackets-cont/brackets/wiki/CodeMirror-v4-Integration

https://discuss.codemirror.net/t/example-of-using-searchcursor-regexpcursor/3785/2

IMPORTANT: https://discuss.codemirror.net/t/codemirror-6-stream-syntax-with-custom-tags/2578/5

https://discuss.codemirror.net/t/legacy-theme-highlighting/5101
https://discuss.codemirror.net/t/how-to-use-legacy-modes-in-codemirror6/5987/3
https://discuss.codemirror.net/t/instructions-for-migrating-a-mode-from-cm5-cm6/6907/10
https://discuss.codemirror.net/t/styling-and-theming-design-discussion/2958/2
https://lezer.codemirror.net/docs/ref/#highlight.classHighlighter
https://lezer.codemirror.net/docs/ref/#highlight.Tag
https://lezer.codemirror.net/docs/ref/#highlight.classHighlightStyle
https://lezer.codemirror.net/docs/ref/#highlight.tagHighlighter
https://codemirror.net/docs/ref/#language.StreamParser

https://codemirror.net/examples/styling/

Some extension issues:

- https://github.com/codemirror/dev/issues/608
- https://discuss.codemirror.net/t/uncaught-error-unrecognized-extension-value-in-extension-set-object-object-this-sometimes-happens-because-multiple-instances-of-codemirror-state-are-loaded-breaking-instanceof-checks/7898
- https://discuss.codemirror.net/t/yet-another-unrecognized-extension-value-in-extension-set-object-object/7371
- https://discuss.codemirror.net/t/codemirror-plugin-crashed-typeerror-tags-is-undefined/4672/3
- https://github.com/codemirror/dev/issues/666
- https://discuss.codemirror.net/t/highlighting-that-seems-ignored-in-cm6/4320/5
- https://github.com/codemirror/lang-liquid/issues/3
-

Look at `pbasic.js` in `parallaxinc/Parallax-IDE/src/lib/pbasic.js` for original.

TODO:

- ~~use tab for indentation: https://codemirror.net/examples/tab/~~

# 9/24/2024

messing around with themeing

changed to dark mode with class="dark" in html

changed default background, popover colors in app.css to match VScode's default dark modern theme

Cursor and selection background colors are still an issue.

# 9/25/2024

Fixed the text selection color and fixed cursor invisible.

Tested out how to get the value of teh written script from the code editor:

`editor.state.doc.toString()` getst the value, but you can't just wrap this in {} to expect Svelte to react to it.

Ok so getting teh doc into a string works. Next, I need to put this aside and learn how PWAs work. Then, I will test some form of IndexDB (look at the reddit post with svelte suggestions to use with IndexedDB). This will allow me to build a simple file system. Offer the user to actually DOWNLOAD the files also. Then we should be ready to launch.

- https://discuss.codemirror.net/t/javascript-syntax-highlighting-not-working/7489/3
- https://discuss.codemirror.net/t/line-background-color-and-selection-layering/5413
- https://codemirror.net/examples/styling/

TODO:
storing files:

- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
- https://codemirror.net/docs/migration/#getting-the-document-and-selection
- https://stackoverflow.com/questions/10285301/how-to-get-the-value-of-codemirror-textarea
- https://github.com/MacFJA/svelte-persistent-store
- https://www.reddit.com/r/sveltejs/comments/10locp6/sveltekit_use_local_database_in_the_browser/

# 9/26/2024

TODO:

- In menubar, add link to documentation
