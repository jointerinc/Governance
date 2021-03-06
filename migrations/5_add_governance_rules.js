const fs  = require("fs");
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
var path = require('path');

const Governance = artifacts.require("Governance"); //Governance.sol

const AuctionRegistry = "";
const Auction = ""; // Auction contract address
const Liquidity = ""; // Liquidity contract address
const Protection = ""; // Auction Protection contract address
const WhiteListContract = "";
const AuctionProxyRegistry = "";
const WhiteListRegistry = "";
const LiquidityRegistry = "";


module.exports =async function(deployer) {

    currentdata = await readFileAsync(path.resolve(__dirname, '../latestContract.json'));
    currentdata = JSON.parse(currentdata);

    escrowAddress = currentdata.Escrow;
    governanceAddress = currentdata.Governance;
    escrowedGovernanceAddress = currentdata.EscrowedGovernance;
    gatewayAddress = currentdata.Gateway;
    realEstateAddress = currentdata.RealEstate;

    GovernanceInstance = await Governance.at(governanceAddress);
    EscrowedGovernanceInstance = await Governance.at(escrowedGovernanceAddress);

    const EscrowedRules = [
        {
            //name: "Move user from one group to another.",
            address: escrowAddress,
            ABI: "moveToGroup(address,uint256)",
            // Set Majority level according Jude direction. By default I set Absolute Majority (90%) to JNTR token community.
            majority: [50,0,0,0],   // Majority percentage according tokens community [Main (JNTR), ETN, STOCK, JNTR co-voting with Edge (if needed)]
        },
        {
            //name: "Add new group with rate.",
            address: escrowAddress,
            ABI: "addGroup(uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "Change group rate.",
            address: escrowAddress,
            ABI: "changeGroupRate(uint256,uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "Change group restriction.",
            address: escrowAddress,
            ABI: "setGroupRestriction(uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "Add new channel.",
            address: gatewayAddress,
            ABI: "addChannel(string)",
            majority: [50,0,0,0],
        },
        {
            //name: "Add new wallet to channel.",
            address: gatewayAddress,
            ABI: "addWallet(uint256,string,address)",
            majority: [50,0,0,0],
        },
        {
            //name: "Change selected wallet address.",
            address: gatewayAddress,
            ABI: "updateWallet(uint256,uint256,address)",
            majority: [50,0,0,0],
        },
        {
            //name: "Change Gateway admin wallet.",
            address: gatewayAddress,
            ABI: "setAdmin(address)",
            majority: [75,0,0,0],
        },
        {
            //name: "Block selected wallet transfer to.",
            address: gatewayAddress,
            ABI: "blockWallet(uint256,uint256,bool)",   //blockWallet(uint256 channelId, uint256 walletId, bool isBlock)
            majority: [50,0,0,0],
        },
        {
            //name: "Block selected channel transfer to any wallet.",
            address: gatewayAddress,
            ABI: "blockChannel(uint256,bool)",  //blockChannel(uint256 channelId, bool isBlock)
            majority: [50,0,0,0],
        },
        {
            //name: "Absolute Majority %",
            address: escrowedGovernanceAddress,    // EscrowedGovernance contract address
            ABI: "setAbsoluteLevel(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "% required to Expedite voting",
            address: escrowedGovernanceAddress,
            ABI: "setExpeditedLevel(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Add primary wallet which is disallowed for voting",
            address: escrowedGovernanceAddress,
            ABI: "manageBlockedWallet(address,bool)",
            majority: [90,0,0,0],
        },
        {
            //name: "Change Majority levels for existing rule",
            address: escrowedGovernanceAddress,
            ABI: "changeRuleMajority(uint256,uint8[4])",
            majority: [90,0,0,0],
        },
        {
            //name: "Change contract address for existing rule",
            address: escrowedGovernanceAddress,
            ABI: "changeRuleAddress(uint256,address)",
            majority: [90,0,0,0],
        },
        // other rules can be added later
      ];
    
      var i=0;
      while (i<EscrowedRules.length){ // `for` loop does not work correctly, so I use `while`
        await EscrowedGovernanceInstance.addRule(EscrowedRules[i].address, EscrowedRules[i].majority, EscrowedRules[i].ABI); // rules for Escrowed Governance
        i++;
      }
    
      // adding rules (the settings which can be changed by voting) to the Governance contract
      const Rules = [
        {
            //name: "updateContractAddress in Registry",
            address: AuctionRegistry,    // AuctionRegistry contract address
            ABI: "updateContractAddress(bytes32,address)",
            // Set Majority level according Jude direction. By default I set Absolute Majority (90%) to JNTR token community.
            majority: [90,0,0,0],   // Majority percentage according tokens community [Main (JNTR), ETN, STOCK, JNTR co-voting with Edge (if needed)]
        },
        {
            //name: "setGroupBonusRatio",
            address: Auction, // Auction contract address
            ABI: "setGroupBonusRatio(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "setDownSideProtectionRatio",
            address: Auction,
            ABI: "setDownSideProtectionRatio(uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "setfundWalletRatio (9% Real Estate wallet ratio in contribution value)",
            address: Auction,
            ABI: "setfundWalletRatio(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "Total Stacking reward (1%)",
            address: Auction,
            ABI: "setstakingPercent(uint256)", //"setStackingPercent(uint256)"
            majority: [75,0,0,0],
        },
        {
            //name: "Average days to recover max daily investment (10 days)",
            address: Auction,
            ABI: "setAverageDays(uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "Investment power",
            address: Auction,
            ABI: "setMainTokenRatio(uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "Days to defer investment power",
            address: Auction,
            ABI: "setMainTokenCheckDay(uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "Max daily investment",
            address: Auction,
            ABI: "setMaxContributionAllowed(uint256)",
            majority: [50,0,0,0],
        },
        {
            //name: "Daily investment lead by %",
            address: Auction,
            ABI: "updateIndividualBonusRatio(uint256,uint256,uint256,uint256,uint256)",
            majority: [75,0,0,0],
        },    
        {
            //name: "Set Auction tine limits",
            address: Auction,
            ABI: "changeTimings(uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "Vault ratio",
            address: Protection,  // AuctionProtection contract address
            ABI: "setVaultRatio(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Days locked period",
            address: Protection,
            ABI: "setTokenLockDuration(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "update Bancor Converter",
            address: Liquidity,  // Liquidity contract address
            ABI: "updateConverter(address)",
            majority: [90,0,0,0],
        },
        {
            //name: "Turnover Reserve recovering",
            address: Liquidity,
            ABI: "setRelayPercent(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Side reserve allocation",
            address: Liquidity,
            ABI: "setSideReseverRatio(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "Mathcing contribution ratio",
            address: Liquidity,
            ABI: "setTagAlongRatio(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "Daily Appreciation Limit",
            address: Liquidity,
            ABI: "setAppreciationLimit(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "set BNT Token Volatility Ratio",
            address: Liquidity,
            ABI: "setBaseTokenVolatiltyRatio(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "set Reduction Start Day",
            address: Liquidity,
            ABI: "setReductionStartDay(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "update Max Wallet per user",
            address: WhiteListContract, // WhiteList contract address
            ABI: "updateMaxWallet(address,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "add JNTR Receiving Rule",
            address: WhiteListContract,
            ABI: "addMainRecivingRule(uint256, uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "remove JNTR Transferring Rules",
            address: WhiteListContract,
            ABI: "removeMainTransferingRules(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "add JNTR Transferring Rule",
            address: WhiteListContract,
            ABI: "addMainTransferringRule(uint256,uint256,uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "add ETN Transferring Rule",
            address: WhiteListContract,
            ABI: "addEtnTransferringRule(uint256,uint256,uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "remove ETN Transferring Rules",
            address: WhiteListContract,
            ABI: "removeEtnTransferingRules(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "add ETN Receiving Rule",
            address: WhiteListContract,
            ABI: "addEtnRecivingRule(uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "add STOCK Transferring Rule",
            address: WhiteListContract,
            ABI: "addStockTransferringRule(uint256,uint256,uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "remove STOCK Transferring Rules",
            address: WhiteListContract,
            ABI: "removeStockTransferingRules(uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "add STOCK Receiving Rule",
            address: WhiteListContract,
            ABI: "addStockRecivingRule(uint256,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "update HoldBack Days",
            address: WhiteListContract,
            ABI: "updateHoldBackDays(uint8,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "update Maturity Days",
            address: WhiteListContract,
            ABI: "updateMaturityDays(uint8,uint256)",
            majority: [75,0,0,0],
        },
        {
            //name: "Absolute Majority %",
            address: governanceAddress,    // Governance contract address
            ABI: "setAbsoluteLevel(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "% required to Expedite voting",
            address: governanceAddress,
            ABI: "setExpeditedLevel(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Add primary wallet which is disallowed for voting",
            address: governanceAddress,
            ABI: "manageBlockedWallet(address,bool)",
            majority: [90,0,0,0],
        },
        {
            //name: "add new community for the voting",
            address: governanceAddress,
            ABI: "setTokenContract(address,uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Set Escrow contract address, where pre-minted tokens locked",
            address: governanceAddress,
            ABI: "setEscrowContract(address,uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Change Majority levels for existing rule",
            address: governanceAddress,
            ABI: "changeRuleMajority(uint256,uint8[4])",
            majority: [90,0,0,0],
        },
        {
            //name: "Change contract address for existing rule",
            address: governanceAddress,
            ABI: "changeRuleAddress(uint256,address)",
            majority: [90,0,0,0],
        },
        {
            //name: "Transfer token/ETH from Real Estate wallet",
            address: realEstateAddress,
            ABI: "transfer(address,uint256,address)",
            majority: [75,0,0,0],
        },
        {
            //name: "Open / close BuyBack",
            address: Liquidity,
            ABI: "setisBuyBackOpen(bool)",
            majority: [90,0,0,0],
        },
        {
            //name: "Upgrade Auction contract",
            address: AuctionProxyRegistry,
            ABI: "upgradeTo(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Upgrade Whitelist contract",
            address: WhiteListRegistry,
            ABI: "upgradeTo(uint256)",
            majority: [90,0,0,0],
        },
        {
            //name: "Upgrade Liquidity contract",
            address: LiquidityRegistry,
            ABI: "upgradeTo(uint256)",
            majority: [90,0,0,0],
        },
    ]
    
      var j=0;
      while (j<Rules.length){ // `for` loop does not work correctly, so I use `while`
        await GovernanceInstance.addRule(Rules[j].address, Rules[j].majority, Rules[j].ABI); // rules for Escrowed Governance
        j++;
      }

}