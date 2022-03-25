// Example of launching the wallet for mainnet.

var bccLauncher = require("bccLauncher");

var launcher = new bccLauncher.Launcher({
  networkName: "mainnet",
  stateDir: "/tmp/state-launcher",
  nodeConfig: {
    kind: "sophie"
  }
});

launcher.start().then(function(api) {
  console.log("*** bcc-wallet backend is ready, base URL is " + api.baseUrl);
  return launcher.stop();
}).then(function() {
  console.log("*** the bcc-wallet backend has finished");
}).catch(function(exitStatus) {
  console.log("*** there was an error starting bcc-wallet backend:\n" +
              bccLauncher.exitStatusMessage(exitStatus));
});
