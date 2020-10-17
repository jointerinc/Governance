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

const MainTokenContract = "";
const WhiteListContract = "";

const Protection = ""; // Auction Protection contract address
const TokenVaultContract = "";
const MainReserveContract = ""; // UniPool pair address that holds JNTR tokens
const AuctionRegistry = "";

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

    EscrowInstance = await Escrow.at(escrowAddress);
    GovernanceInstance = await Governance.at(governanceAddress);

    EscrowedGovernanceInstance = await Governance.at(escrowedGovernanceAddress);

    GatewayInstance = await Gateway.at(gatewayAddress);

    RealEstateInstance = await RealEstate.at(realEstateAddress);

    await GovernanceInstance.setTokenContract(MainTokenContract, 0);

    // await GovernanceInstance.setTokenContract(JointerEscrowContractAddress, 3); // 4th community require for Edge co-voting

    await GovernanceInstance.setWhitelist(WhiteListContract);

    await GovernanceInstance.setEscrowContract(escrowAddress,0); 

    await GovernanceInstance.setGovernanceProxy(governanceProxyAddress); 

    await GovernanceInstance.updateCloseTime();

    await GovernanceInstance.addExcluded(0,[CompanyWallet,TokenVaultContract,Protection,MainReserveContract]);

    await GovernanceInstance.manageBlockedWallet(CompanyWallet, true); 

    await EscrowedGovernanceInstance.setTokenContract(escrowAddress, 0);

    // await EscrowedGovernanceInstance.setTokenContract(JointerEscrowContractAddress, 3); // 4th community require for Edge co-voting

    await EscrowedGovernanceInstance.setWhitelist(WhiteListContract);

    await EscrowedGovernanceInstance.setGovernanceProxy(escrowedGovernanceProxyAddress); 

    await EscrowedGovernanceInstance.updateCloseTime(); 

    await EscrowedGovernanceInstance.addExcluded(0,[CompanyWallet]);

    await EscrowedGovernanceInstance.manageBlockedWallet(CompanyWallet, true);

    // setup Escrow

    await EscrowInstance.setTokenContract(MainTokenContract);

    await EscrowInstance.setGatewayContract(gatewayAddress);

    await EscrowInstance.updateRegistery(AuctionRegistry); 

    await EscrowInstance.setGovernanceContract(governanceAddress);

    await EscrowInstance.init();
    
    await GatewayInstance.setTokenContract(MainTokenContract);

    await GatewayInstance.setEscrowContract(escrowAddress);

    await GatewayInstance.setAdmin(CompanyWallet);

    // Add Channels and Wallets (may be done later)
    await GatewayInstance.addChannel("Gateway supply"); // Channel ID: 0

    await GatewayInstance.addWallet(0,"CoinTiger integration","0x5944E37E1112e6643cE9A5734382A963f6A75CeE"); // CoinTiger integration wallet, where to send JNTR
    await GatewayInstance.addWallet(0,"Company wallet","0xc326DF3Bec90f94887d2756E03B51a222F2b0de4"); // Company wallet, where to send JNTR

    await GatewayInstance.addChannel("Crypto exchanges"); // Channel ID: 1

    // await GatewayInstance.addWallet(1,"HitBTC","0x9D76C6bDe437490d256f8B4369890eaB123B62C4"); // Deposit address in Exchange
    // await GatewayInstance.addWallet(1,"Binance","0x9D76C6bDe437490d256f8B4369890eaB123B62C4"); // Deposit address in Exchange
    await GatewayInstance.addChannel("SmartSwap P2C"); // Channel ID: 2
    // await GatewayInstance.addWallet(2,"SmartSwap P2C",SmartSwapP2CContract);  // SmartSwap P2C contract address
    // await GatewayInstance.setJointerVotingContract(EscrowedGovernanceProxy);  // when deploy Edge contract, set Jointer EscrowedGovernanceProxy
    
 };
