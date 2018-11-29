/**
 * @author Deepak
 * @file Implementing promise with javascript.
 */

var MyPromise = (function () {

    let NOOP = () => {},
        STATE = {
            FULLFILED: 0,
            REJECTED: 1,
            PENDING: 2
        };

    function MyPromise(fn) {
        this.__init();
        this.__asyncFunctionCall(fn);
    }

    MyPromise.prototype = {
        constructor: MyPromise,
        __init: function () {
            this._currentState = STATE.PENDING;
            this._value = undefined;
            this._fullfiledStateHandler = null;
            this._rejectedStateHandler = null;
            this._chainedPromise = null;
        },
        __asyncFunctionCall: function (fn) {
            var context = this;
            setTimeout(function () {
                try {
                    fn(function (resolvedValue) {
                        context.__promiseComplete(STATE.FULLFILED, resolvedValue);
                    }, function (rejectedValue) {
                        context.__promiseComplete(STATE.REJECTED, rejectedValue);
                    });
                } catch (error) {
                    context.__promiseComplete(STATE.REJECTED, error);
                }
            }, 0);
        },
        __promiseComplete: function (state, value) {
            if (this._currentState === STATE.PENDING) {
                let _chainedPromise = this._chainedPromise;
                this._currentState = state;
                this._value = value;

                //Execute handlers if any configured.
                var returnValue, failureCaught;
                if (state === STATE.FULLFILED && this._fullfiledStateHandler instanceof Function) {
                    returnValue = this._fullfiledStateHandler(value);
                } else if (state === STATE.REJECTED && this._rejectedStateHandler instanceof Function) {
                    returnValue = this._rejectedStateHandler(value);
                    failureCaught = true;
                }

                //Complete chained promises.
                //If handler returns a promise the value need to be propagated to chained promise.
                if (returnValue instanceof this.constructor) {
                    returnValue.then(function (resolvedValue) {
                        _chainedPromise.__promiseComplete(STATE.FULLFILED, resolvedValue);
                    }, function (rejectedValue) {
                        _chainedPromise.__promiseComplete(STATE.REJECTED, rejectedValue);
                    });
                }
                //Else resolve the default promise.
                else {
                    if (_chainedPromise) {
                        //If failure is caught then it should not propogated along the promise chain so resolve it as undefined.
                        if (failureCaught) {
                            _chainedPromise.__promiseComplete(STATE.FULLFILED, undefined);
                        } else {
                            _chainedPromise.__promiseComplete(state, (returnValue ? returnValue : value));
                        }
                    } 
                    //Promise function throws an error and it is not caught. Throw it back so that it is not suppressed.
                    else if (state === STATE.REJECTED && !failureCaught) {
                        throw value;
                    }
                }
            }
        },
        then: function (successCallback, failureCallback) {
            this._fullfiledStateHandler = successCallback;
            this._rejectedStateHandler = failureCallback;
            this._chainedPromise = new this.constructor(NOOP);
            return this._chainedPromise;
        },
        catch: function (errorCallback) {
            /*if (!this._rejectedStateHandler) {
                this._rejectedStateHandler = errorCallback;
            }*/
            return this.then(null, errorCallback);
        }
    };

    return MyPromise;
})();