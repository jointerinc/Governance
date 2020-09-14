/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

//var HDWalletProvider = require("@truffle/hdwallet-provider");

/*
const MNEMONIC = ["0x961309332f06b62acd4b950fc0cf77ab38723e8af47f88735764ed4b7d8c6924",
                  "0x1fb8b5f4f70f9d3c6ab130a53b56fb129f7bd91311d1665f95b83f343b7ab1f3",
                  "0xbdd95786b4e22f5bc317e87d1068e6820702e03ac971c43a398038dd6409707c",
                  "0xecb8e658f4a90a45f3b978f29e5f7bb6ce7457328d6c748a99e3d34643387450"];
*/
module.exports = {
  compilers: {
    solc: {
      version: "^0.6.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gasPrice: 130000000000,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC,"https://ropsten.infura.io/v3/d86e5c556a9f4e5d84c5319ab1d174be");
      },
      network_id: 3,
      gas: 8000000,
      gasPrice: 130000000000,
      timeoutBlocks: 300,
      skipDryRun: true,
    },
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      coinmarketcap: "705ed8e9-cb41-4081-8005-8bffa83dadda",
    },
  },
};
