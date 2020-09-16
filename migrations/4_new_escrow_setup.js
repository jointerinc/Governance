// company wallet address which receive all pre-minted tokens and can manage with it in Escrow contract
const fs  = require("fs");
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
var path = require('path');

 // deploy Escrow and Gateway contracts for main token (JNTR)
const Governance = artifacts.require("Governance"); //Governance.sol
const GovernanceProxy = artifacts.require("GovernanceProxy");

const Escrow = artifacts.require("Escrow"); //Escrow.sol
const RealEstate = artifacts.require("RealEstate");

const Gateway = artifacts.require("Gateway");

const {ownerWallet,CompanyWallet,CEOwallet } = require("../constant");

// const JointerEscrowContractAddress = ""; // Joiter Ecrow address require for Edge deployer

const MainTokenContract = "0xcd899e343a192ac3ce6530ce0ed9009275a2c701";
const WhiteListContract = "0x679024a6328d24BA5BD566C4D6C87DbFcE005724";

const Auction = "0xa65cd8e55825548917713006949a9888bf6a4e08"; // Auction contract address
const Liquidity = "0xe08fbFE40d0Eb16F844ca761BaE4D60b2f3c010a"; // Liquidity contract address
const Protection = "0x80fD7DF9233fCD817397ee2E156Bbf20eB3f53b5"; // Auction Protection contract address
const TokenVaultContract = "0x3c90514cDA4EF093C4B5FD5Aab9Ec99EeF28EE34";
const MainReserveContract = "0xc98791dc2e1151571edb62e2cd46b0289a272d71"; // Bancor pool that holds JNTR tokens
const AuctionRegistery = "0x694c28Cbf17C5c1bdee063feF91C258fA578c0B1";

module.exports =async function(deployer) {

    currentdata = await readFileAsync(path.resolve(__dirname, '../latestContract.json'));
    currentdata = JSON.parse(currentdata);

    escrowAddress = currentdata.Escrow;
    governanceAddress = currentdata.Governance;
    governanceProxyAddress = currentdata.GovernanceProxy;
    escrowedGovernanceAddress = currentdata.EscrowedGovernance;
    escrowedGovernanceProxyAddress = currentdata.EscrowedGovernanceProxy;
    gatewayAddress = currentdata.Gateway;
    realEstateAddress = currentdata.RealEstate;

    GovernanceInstance = await Governance.at(governanceAddress);
    
    GatewayInstance = await Gateway.at(gatewayAddress);

    await GovernanceInstance.setTokenContract(MainTokenContract, 0);

    // await GovernanceInstance.setTokenContract(JointerEscrowContractAddress, 3); // 4th community require for Edge co-voting

    await GovernanceInstance.setWhitelist(WhiteListContract);

    await GovernanceInstance.setEscrowContract(escrowAddress,0); 

    await GovernanceInstance.setGovernanceProxy(governanceProxyAddress); 

    await GovernanceInstance.updateCloseTime();

    await GovernanceInstance.addExcluded(0,[CompanyWallet,TokenVaultContract,Protection,MainReserveContract]);

    await GovernanceInstance.manageBlockedWallet(CompanyWallet, true); 

    
      // adding rules (the settings which can be changed by voting) to the Governance contract
      const Rules = [
        {
            //name: "updateContractAddress in Registry",
            address: AuctionRegistery,    // AuctionRegistry contract address
            ABI: "updateContractAddress(bytes32,address)",
            // Set Majority level according Jude direction. By default I set Absolute Majority (90%) to JNTR token community.
            majority: [90,0,0,0],   // Majority percentage according tokens community [Main (JNTR), ETN, STOCK, JNTR co-voting with Edge (if needed)]
        },

    ]
    
    await GovernanceInstance.addRule(Rules[0].address, Rules[0].majority, Rules[0].ABI); // rules for Governance

    // add new wallet to gateway channel (0) to transfer tokens to new Escrow contract
    await GatewayInstance.addWallet(0,"New Escrow",escrowAddress);

    // setup Escrow
    await EscrowInstance.setTokenContract(MainTokenContract);

    await EscrowInstance.setGatewayContract(gatewayAddress);

    await EscrowInstance.updateRegistery(AuctionRegistery); 

    await EscrowInstance.setGovernanceContract(governanceAddress);

    // now Jude have to transfer all tokens to the new Escrow
    //await EscrowInstance.init();

 };
