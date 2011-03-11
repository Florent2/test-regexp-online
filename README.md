Test your Javascript regular expressions online
===================================

A small project I made to learn a bit more about JavaScript and jQuery.

[Demo page](http://florent2.github.com/test-regexp-online/)

Features
--------
* test the regexp as you type
* highlight matched results
* display captured groups
* allow to fill in counter examples also
* provides a permalink for a given set of regexp, examples and counter examples, thus you can easily share this illustrated regexp
* warn when regexp is invalid
* for now does NOT support the `g` and `m` flags

TODO
----

* simplify the references by making a single list without sections (like https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)
* add permalink examples in the references

* add the possibility to use a URL shortener for the permalink?

* manual tests with IE

* add tests (with http://pivotal.github.com/jasmine/, http://code.google.com/p/js-test-driver/wiki/GettingStarted ?)

* more work needed to support the `g` flag to correctly highlight all matched strings
* to support the `m` flag I would need the user to be able to enter characters like \n, ie use textarea?