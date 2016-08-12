(function() {

  Twilio.Sync.CreateClient = function(tokenUrl) {
    var accessManager, syncClient;

    return new Promise(function(resolve, reject) {
      fetchAccessToken(initializeSync, resolve, reject);
    });

    function fetchAccessToken(successFn, resolve, reject) {
      $.getJSON(tokenUrl || '/token', function (tokenResponse) {
        successFn(tokenResponse.token, resolve);
      }).fail(reject);
    }

    function initializeSync(token, resolve) {
      accessManager = new Twilio.AccessManager(token);
      syncClient = new Twilio.Sync.Client(accessManager);
      syncClient.on('tokenExpired', refreshToken);
      resolve(syncClient);
    }

    function refreshToken() {
      fetchAccessToken(setNewToken, null, function() {
        window.console.error('Could not refresh expired Sync token.');
      });
    }
    
    function setNewToken(token) {
      accessManager.updateToken(token);
    }

  };

})();