
var testCase = {

    promiseClass: MyPromise,
    print: function (msg) {
        console.log(msg);
    },
    _getPromise: function (callback) {
        return new this.promiseClass(callback);
    },
    createPromise: function () {
        var p = this._getPromise(function () {});
        if (p) {
            this.print(`Promise Created Successfully`);
        } else {
            this.print(`Promise Creation failed`);
        }

        return p;
    },
    thenSuccess: function () {
        var p = this._getPromise(function (resolve, reject) {
            resolve("Resolved Successfully");
        });

        p.then((msg) => {
            this.print(`THEN SUCCESS :: ${msg}`);
        }, (msg) => {
            this.print(`THEN FAILURE :: ${msg}`);
        });
    },
    thenSuccess1: function () {
        var p = this._getPromise(function (resolve, reject) {
            resolve("Resolved Successfully");
            reject("Rejected Successfully");
        });

        p.then((msg) => {
            this.print(`THEN SUCCESS :: ${msg}`);
        }, (msg) => {
            this.print(`THEN FAILURE :: ${msg}`);
        });
    },
    thenFailure: function () {
        var p = this._getPromise(function (resolve, reject) {
            reject("Rejected Successfully");
        });

        p.then((msg) => {
            this.print(`THEN SUCCESS :: ${msg}`);
        }, (msg) => {
            this.print(`THEN FAILURE :: ${msg}`);
        });
    },
    catchWithThen: function () {
        var p = this._getPromise(function (resolve, reject) {
            throw "An exception was thrown";
            resolve("Resolved Successfully");
            reject("Rejected Successfully");
        });

        p.then((msg) => {
            this.print(`THEN SUCCESS :: ${msg}`);
        }, (msg) => {
            this.print(`THEN FAILURE :: ${msg}`);
        }).catch(error => {
            this.print(`EXCEPTION THROWN : ${error}`);
        });
    },
    catchWithoutThen: function () {
        var p = this._getPromise(function (resolve, reject) {
            throw "An exception was thrown";
            resolve("Resolved Successfully");
            reject("Rejected Successfully");
        });

        p.then((msg) => {
            this.print(`THEN SUCCESS :: ${msg}`);
        }).catch(error => {
            this.print(`EXCEPTION THROWN : ${error}`);
        });
    },
    promiseWithoutCatch: function () {
        var p = this._getPromise(function (resolve, reject) {
            throw "MY PROMISE HAS BUG";
            resolve("Resolved Successfully");
            reject("Rejected Successfully");
        });

    },
    multiThen: function () {
        var p = this._getPromise(function (resolve, reject) {
            resolve("Resolved Successfully");
        });

        p.then((msg) => {
            this.print(`THEN1 SUCCESS :: ${msg}`);
        }).then((msg) => {
            this.print(`THEN2 SUCCESS :: ${msg}`);
        }).catch(error => {
            this.print(`EXCEPTION THROWN : ${error}`);
        });
    },
    multiPromise: function () {
        var p = this._getPromise(function (resolve, reject) {
            resolve("FIRST RESOLVE");
        });

        p.then((msg) => {
            this.print(`THEN1 SUCCESS :: ${msg}`);
            return this._getPromise(function (resolve, reject) {
                resolve("SECOND RESOLVE");
            })
        }).then((msg) => {
            this.print(`THEN2 SUCCESS :: ${msg}`);
        });
    },
    multiPromiseWithReject: function () {
        var p = this._getPromise(function (resolve, reject) {
            resolve("FIRST RESOLVE");
        });

        p.then((msg) => {
            this.print(`THEN1 SUCCESS :: ${msg}`);
            return this._getPromise(function (resolve, reject) {
                reject("SECOND REJECTED");
            })
        }).then((msg) => {
            this.print(`THEN2 SUCCESS :: ${msg}`);
        },(msg) => {
            this.print(`THEN2 FAIL :: ${msg}`);
        }).then((msg) => {
            this.print(`THEN3 SUCCESS :: ${msg}`);
        },(msg) => {
            this.print(`THEN3 FAIL :: ${msg}`);
        }).catch(error => {
            this.print(`CATCH: ${error}`);
        });
    }
};