const fs  = require("fs");
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile);
var path = require('path');

const Escrow = artifacts.require("Escrow"); //Escrow.sol
const Gateway = artifacts.require("Gateway");
const Governance = artifacts.require("Governance"); //Governance.sol

const {ownerWallet,CompanyWallet,CEOwallet } = require("../constant");

module.exports =async function(deployer) {

    currentdata = await readFileAsync(path.resolve(__dirname, '../latestContract.json'));
    currentdata = JSON.parse(currentdata);

    escrowAddress = currentdata.Escrow;
    gatewayAddress = currentdata.Gateway;
    governanceAddress = currentdata.Governance;
    governanceProxyAddress = currentdata.GovernanceProxy;
    escrowedGovernanceAddress = currentdata.EscrowedGovernance;
    escrowedGovernanceProxyAddress = currentdata.EscrowedGovernanceProxy;

    EscrowInstance = await Escrow.at(escrowAddress);
    GatewayInstance = await Gateway.at(gatewayAddress);
    GovernanceInstance = await Governance.at(governanceAddress);
    EscrowedGovernanceInstance = await Governance.at(escrowedGovernanceAddress);

    await EscrowInstance.transferOwnership(escrowedGovernanceProxyAddress); 
    await GatewayInstance.transferOwnership(escrowedGovernanceProxyAddress); // All changes may be done only via Escrowed Governance (voting)
    //await GovernanceInstance.transferOwnership(governanceProxyAddress); // Governance become the Owner  
    //await EscrowedGovernanceInstance.transferOwnership(escrowedGovernanceProxyAddress); 
    await GovernanceInstance.transferOwnership(CompanyWallet); // Governance become the Owner  
    await EscrowedGovernanceInstance.transferOwnership(CompanyWallet); 

}
