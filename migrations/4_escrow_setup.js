// company wallet address which receive all pre-minted tokens and can manage with it in Escrow contract
const fs  = require("fs");
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
var path = require('path');

const Escrow = artifacts.require("Escrow"); //Escrow.sol
const Gateway = artifacts.require("Gateway");

const {ownerWallet,CompanyWallet,CEOwallet } = require("../constant");

// const JointerEscrowContractAddress = ""; // Joiter Ecrow address require for Edge deployer

const MainTokenContract = "0xcd899e343a192ac3ce6530ce0ed9009275a2c701";
const AuctionRegistery = "0x694c28Cbf17C5c1bdee063feF91C258fA578c0B1";

module.exports =async function(deployer) {

    currentdata = await readFileAsync(path.resolve(__dirname, '../latestContract.json'));
    currentdata = JSON.parse(currentdata);

    escrowAddress = currentdata.Escrow;
    governanceAddress = currentdata.Governance;
    escrowedGovernanceProxyAddress = currentdata.EscrowedGovernanceProxy;
    gatewayAddress = currentdata.Gateway;

    EscrowInstance = await Escrow.at(escrowAddress);
    GatewayInstance = await Gateway.at(gatewayAddress);

    await EscrowInstance.setTokenContract(MainTokenContract);

    await EscrowInstance.setGatewayContract(gatewayAddress);

    await EscrowInstance.updateRegistery(AuctionRegistery); 

    await EscrowInstance.setGovernanceContract(governanceAddress);

    await EscrowInstance.init();
    
    await GatewayInstance.setTokenContract(MainTokenContract);

    await GatewayInstance.setEscrowContract(escrowAddress);

    await GatewayInstance.setAdmin(ownerWallet);

    // Add Channels and Wallets (may be done later)
    await GatewayInstance.addChannel("Gateway supply"); // group ID: 0
    //await GatewayInstance.addWallet(0,"Bancor",MainReserveContract); // Bancor wallet, where to send JNTR
    await GatewayInstance.addChannel("Crypto exchanges"); // group ID: 1

    // await GatewayInstance.addWallet(1,"HitBTC","0x9D76C6bDe437490d256f8B4369890eaB123B62C4"); // Deposit address in Exchange
    // await GatewayInstance.addWallet(1,"Binance","0x9D76C6bDe437490d256f8B4369890eaB123B62C4"); // Deposit address in Exchange
    await GatewayInstance.addChannel("SmartSwap P2C"); // group ID: 2
    // await GatewayInstance.addWallet(2,"SmartSwap P2C",SmartSwapP2CContract);  // SmartSwap P2C contract address
    // await GatewayInstance.setJointerVotingContract(EscrowedGovernanceProxy);  // when deploy Edge contract, set Jointer EscrowedGovernanceProxy
    
    // Transfer ownership    
    //await EscrowInstance.transferOwnership(escrowedGovernanceProxyAddress); 
    //await GatewayInstance.transferOwnership(escrowedGovernanceProxyAddress); // All changes may be done only via Escrowed Governance (voting)
}
