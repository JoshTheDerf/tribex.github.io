---
title: Jade and Ractive.js - A Match Made in Templating Heaven
author: Joshua Bemenderfer
date: 2015-6-20
tags:
    - JavaScript
    - Jade
    - Ractivejs
    - Tutorials & Tips
preview: How to combine the compile-time templating language [Jade](http://jade-lang.com) and simple two-way data-binding library [Ractive.js](http://www.ractivejs.org) together to create an easy-to-maintain, modular, dynamic web application.
---

### Contents
 * [Introduction](#introduction)
    * [What on Earth is Jade?](#jade-intro)
    * [What on Earth is Ractive.js](#ractive-intro)
 * [Example: Importing Ractive Templates at Compile Time](#importing-at-compile-time)
 * [Warnings](#warnings)
 * [Acknowledgements](#acknowledgements)
  

### <a name="introduction"></a> Introduction
Let's face it. HTML and even XML in general is clunky and easy to mess up. Its monolithic structure makes it hard to maintain the complex, multi-faceted web applications of today. To make matters worse, it requires excessive and complicated DOM manipulation to patch together anything that vaguely resembles a dynamic page.

Over the years people have come up with more than a few frameworks to try and mitigate these all-too-common problems, each with its own philosophies, design choices, and issues that come along as baggage.

While others might like more complete solutions such as [Angular](https://angular.io/) or even [React](http://facebook.github.io/react/), I personally prefer using lots of unopinionated, separate libraries, each trying to solve one problem and solve it well.

For the particular issues mentioned at the start of this article, I chose [Jade](http://jade-lang.com/) for a modular and easy-to-maintain page structure, built at compile-time, and [Ractive.js](http://www.ractivejs.org/) for simple (yet incredibly powerful) dynamic interaction capabilities during run-time.

---
#### <a name="jade-intro"></a> What on Earth is [Jade](http://jade-lang.com/)?
 * A terse, expressive, easy-to-understand language which compiles to HTML.
 * Based on indentation rather than tags.
 * Makes it easy to import files, extend them, or even modify blocks of markup in parent templates.
 * Embed JavaScript during build time.
 * Built-in expressions like if and for-each.
 * Specify ids and classes off-the-block with CSS-like syntax. Avoids excess attributes.
 * Takes far less time to learn that it would appear. It's just more natural.
 * And much, much more...
 
##### HTML Example:
```html
<!-- Insert 100-line head/layout HTML here -->
<div class="mainContent">
    <div id="myNewButton" class="btn btn-default">
        <span class="fa fa-plus"></span>
        <span>My Button</span>
    </div>
    <span class="content-link"><a href="/foo.html">Foo</a></span>
</div>
<!-- Insert 30-line footer HTML here -->
```
---
##### Jade Example:
```jade
// Layout is in another file.
extends ./layout.jade
// All this file changes from layout.jade is the content block, adding these tags to it.
block append content
    div#myNewButton.btn.btn-default
        span.fa.fa-plus
        span My Button
    span.content-link: a(href="/foo.html") Foo
```

---
#### <a name="ractive-intro"></a> What on Earth is [Ractive.js](http://www.ractivejs.org/)?
 * A simple (read unopinionated) way to bind data models (plain JavaScript objects) to templates. (HTML + Handlebars)
 * Uses two-way data binding, so any changes to the model update the view, and vice-versa.
 * Eliminates the need for a controller, in fact, for any other boilerplate code at all.
 * Fast, like, as fast as could be. Only rebuilds the parts of the DOM that are needed when the model changes.
 * Way, way easier to use than Angular. :P
 
##### Raw HTML Example:

Template:
```html
<div id="#outputElement">
  <p><span id="greeting"></span>, <span id="name"></span>!</p>
</div>
```

Controller:
```javascript
var updateGreeting = function(greeting) {
  document.getElementById("greeting").textContent = greeting;
}

var updateName = function(name) {
  document.getElementById("name").textContent = name;
}

// Now the above functions must be called whenever you want to change the name data.
var data = {
  greeting: "Hello",
  name: "World",
}

updateGreeting(data.greeting);
updateName(data.name);
```

Output:
```html
<div id="#outputElement">
  <p><span id="greeting">Hello</span>, <span id="name">World</span>!</p>
</div>
```
---
##### Ractive.js Example:

Template:
```html
<script type="text/ractive" id="templateElement">
    <p>{{greeting}}, {{name}}!</p>
</script>

<div id="#outputElement">
    <!-- Template gets rendered here -->
</div>
```
Controller:
```javascript
var controller = new Ractive({
  el: "#outputElement",
  template: "#templateElement",
  data: { greeting: 'Hello', name: 'Steve' } // Change the data object and the output will update immediately.
});
```

Output:
```html
<div id="#outputElement">
  <p>Hello, Steve!</p>
</div>
```

How's that for terse?

---
Now at first glance, it's hard to see how these two systems are capable of fitting together. (In fact, I've never heard of anyone combining the two before.) Turns out, despite the incredible differences between Jade and HTML syntaxes, Ractive templates still work excellently. In fact, Jade *compliments* Ractive by allowing ractive partials and templates to be imported from other files at compile time, removing the need for strange and unwieldy AJAX or script based loads. It's a win-win!

So, how can we use these together for maximum effectiveness and modularity? Let's take a look:

---
### <a name="importing-at-compile-time"></a> Importing Ractive Templates at Compile Time <span class="detail">[ - Demo](/out/demo/jade+ractive.js/index.html)</span>

Ractive templates normally need to be embedded into their host page, or loaded on-demand via AJAX. Both solutions are not particularly optimal. You either get a cluttered HTML file or lots of callback-hungry boilerplate. With Jade though, you can write the code in separate files and have it compiled into a single file when building. Thus we get the best of both worlds!

**Why it works:** Jade imports and DOM parsing still function under script tags.

**Note:** The examples below assume you already know the basics of compiling Jade. Compilation instructions are not provided and the following examples are guidelines, not to be copy-pasted blindly.

index.jade - compiles to out/index.html:
```jade
doctype html
  head
    meta(charset="utf-8" lang="en")
    title Jade+Ractive.js Imports Demo
    //- Pull in dependencies. (Ractive.js requires jQuery)
    script(src="./lib/jquery.js")
    script(src="./lib/ractive.js")
  body
    script#ractive-template-1(type="text/ractive")
      //- Load and parse ./template.jade here.
      include ./template.jade
    #ractive-output-1
    //- Ractive initialization script.
    script.
      var userDetails = new Ractive({
        el: "#ractive-output-1",
        template: "#ractive-template-1",
        data: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@fakemail.com"
        }
      });
```

template.jade:
```jade
p First Name:
  input(type="text" value="{{first_name}}")
p Last Name:
  input(type="text" value="{{last_name}}")
p Email:
  input(type="text" value="{{email}}")
```

After compiling, the resulting `out/index.html` file should look like this:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" lang="en"/>
    <title>Jade+Ractive.js Imports Demo</title>
    <script src="./vendor/jquery.js"></script>
    <script src="./vendor/ractive.js"></script>
  </head>
  <body>
    <script id="ractive-template-1" type="text/ractive">
      <p>First Name: <input type="text" value="{{first_name}}"/></p>
      <p>Last Name: <input type="text" value="{{last_name}}"/></p>
      <p>Email: <input type="text" value="{{email}}"/></p>
    </script>
    <div id="ractive-output-1"></div>
    <script>
      var userDetails = new Ractive({
        el: "#ractive-output-1",
        template: "#ractive-template-1",
        data: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@fakemail.com"
        }
      });
    </script>
  </body>
</html>
```
If you open the page in a browser, it should render as expected.

![Page Output](/out/assets/images/blog/jade+ractive.js/Import-Output-John.png)

Try changing the text in the `first_name` input element, then run `userDetails.get("first_name")` in the console. You'll notice that the value in the data object changed as well. This is an example of two-way data binding. Changes in the model or the view will affect both the model and the view, greatly speeding up the development of applications heavily-reliant on user interaction.

![Page Output Changed](/out/assets/images/blog/jade+ractive.js/Import-Output-Steve.png)

### <a name="warnings"></a> Warnings
 * Jade relies on indentation, so blocks inside Ractive mustaches cannot be indented in farther than Jade expects. This so far is the only limitation I've come across.
 
    Invalid Jade:
    ```jade
    p Test
    {{each testObject}}
      p {{name}}
    {{/each}}
    ```
    Valid Jade: (May throw indentation warnings.)
    ```jade
    p Test
    {{each testObject}}
    p {{name}}
    {{/each}}
    ```
 * Structure your files carefully! A bunch of poorly organized files is just as bad, if not worse, than a single cluttered one.

That's all there is too it! Feel free to share some of the crazy conglomerations you come up with mixing Jade and Ractive.js, I'd love to see them.

---
### <a name="acknowledgements"></a> Acknowledgements
 * Big thanks to [Mr. Forbes Lindesay](http://www.forbeslindesay.co.uk/) for coming up with Jade. Template building has never been so enjoyable.
 * An equally large thanks is directed towards [Mr. Rich Harris](http://rich-harris.co.uk/) for creating Ractive.js. A nice, small library that handles two-way data binding exceptionally is quite the breath of fresh air.
