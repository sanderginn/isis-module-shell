app.controller('LoginController',
  ['$rootScope', '$state', 'AuthService', 'AppConfig', 'PreferencesService',
    function ($rootScope, $state, AuthService, AppConfig, PreferencesService) {

      var ctrl = this;

      ctrl.preferences = PreferencesService.preferences;
      ctrl.credentials = {
        username: null,
        password: null
      };

      ctrl.login =
        function (data) {
          var username = ctrl.credentials.username;
          var password = ctrl.credentials.password;

          AuthService.login(username, password).then(
            function (authenticated) {
              ctrl.credentials.username = null;
              ctrl.credentials.password = null;
              ctrl.error = undefined;
              $state.go('base.noOutput', {}, {reload: true});
            }, function (err) {
              ctrl.credentials.username = null;
              ctrl.credentials.password = null;
              ctrl.error = "Incorrect username or password";
            });
        };

      // attempt to auto-login using previous credentials
      var previousTokenIfAny = AuthService.readUserCredentials();
      if (previousTokenIfAny) {
        var username = previousTokenIfAny.split('.')[0];
        var basicAuth = previousTokenIfAny.split('.')[1];

        AuthService.login(username, null, basicAuth).then(
          function (authenticated) {
            $state.go('base.noOutput', {}, {reload: true});
          }, function (err) {
            AuthService.deleteCachedUserCredentials();
          });
      }

      // put focus on username or password field
      var usernameElement = document.getElementById('clisis-username');
      var passwordElement = document.getElementById('clisis-password');
      if (usernameElement !== null) {
        usernameElement.focus();
        usernameElement.onblur = function () {
          setTimeout(function () {
            if (document.activeElement.id !== "clisis-password") {
              setTimeout(function () {
                usernameElement.focus();
              }, 0);
            }
          }, 1);
        };

        passwordElement.onblur = function () {
          setTimeout(function () {
            if (document.activeElement.id !== "clisis-username") {
              setTimeout(function () {
                passwordElement.focus();
              }, 0);
            }
          }, 1);
        }
      }

      function checkTabPress(e) {
        var element = document.activeElement;
        if (e.keyCode === 9 && element.id === 'clisis-username') {
          passwordElement.focus();
          e.preventDefault();
        } else if (e.keyCode === 9 && element.id === 'clisis-password') {
          usernameElement.focus();
          e.preventDefault();
        }
      }

      document.addEventListener('keydown', function (e) {
        checkTabPress(e);
      }, false);
    }]);