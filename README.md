Teste
=====
*a JavaScript (node.js) testing framework*

Intro
-----
Teste is a JavaScript testing framework built on node.js. It's meant to keep things simple, and make the barrier for writing tests as thin as possible.

Features
--------

  * **Shared environments** : a suite has an 'env' object which you can write to and that data will be available for any test in that suite.

    suites.push({
        name: "test suite",
        desc: "example",
        setup: function(env) {
            env.foo = 'bar';
        },
        tests: [
            {
                desc: "we should have the foo property",
                run: function(env) {
                    env.foo;  // bar
                }
            }
        ]
    });

  * **Support for mocks/stubs** technically they are mocks, since they have info about whether they've been called, and how many times, but can be used as stubs as well.

    var mock = new this.Stub(function(p1, p2) {
        console.log('hello world');
    });

    mock.called;  // false
    
    mock.numCalled;  // 0

    
    mock();  // hello world

    mock.called;  // true
    
    mock.numCalled;  // 1


Status
------
[![Build Status](https://secure.travis-ci.org/silverbucket/teste.png)](http://travis-ci.org/silverbucket/teste)
Teste is not feature complete, is still very much a research project and should be considered in alpha state.


