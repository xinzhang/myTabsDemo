
angular.module('app')
.factory('AccountService', function ($q) {

    var ref = new Firebase("https://xzexpenses.firebaseio.com/");

    var loginUser = function (name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        ref.child(name).child('password').once('value', function (ret) {
            var password = ret.val();

            if (password == null) {
                deferred.reject('Wrong credentials.');                
            }
            else {
                var hashpw = CryptoJS.SHA1(pw).toString();
                if (hashpw == password) {
                    deferred.resolve('Welcome ' + name + '!');
                }
                else {
                    deferred.reject('Wrong credentials.');
                }
            }

        }, function (err) {
            deferred.reject('Wrong credentials.');
        });

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }

        return promise;
    }

    var register = function (name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var hashpw = CryptoJS.SHA1(pw).toString();

        ref.child(name).once('value', function (ret) {
            var user = ret.val();
            if (user != null) {
                deferred.reject('user has existed');
            }
            else {
                //register user
                ref.child(name).set({
                    username: name,
                    password: hashpw,
                });

                deferred.resolve('Welcome ' + name + '!');
            }

        }, function (err) {
            deferred.reject('Wrong credentials.');
        });

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    }

    return {
        loginUser: loginUser,
        register: register
    }
})

