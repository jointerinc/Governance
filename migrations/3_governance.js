
// this address should be provided by Jude
// company wallet address which receive all pre-minted tokens and can manage with it in Escrow contract
const fs  = require("fs");
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
var path = require('path');
const RealEstate = artifacts.require("RealEstate");
const Gateway = artifacts.require("Gateway");
// deploy Escrow and Gateway contracts for main token (JNTR)
const Governance = artifacts.require("Governance"); //Governance.sol
const GovernanceProxy = artifacts.require("GovernanceProxy"); //GovernanceProxy.sol
// Governance contracts for escrowed users (only for users in Escrow contract)
const EscrowedGovernance = artifacts.require("Governance"); //Governance.sol
const EscrowedGovernanceProxy = artifacts.require("GovernanceProxy"); //GovernanceProxy.sol
 
const {ownerWallet,CompanyWallet,CEOwallet } = require("../constant");

module.exports =async function(deployer) {

   await deployer.deploy(
     Governance,
     CEOwallet,
     { from: ownerWallet }
   );
   GovernanceAddress = Governance.address;
   GovernanceInstance = await Governance.deployed();

   await deployer.deploy(
    GovernanceProxy,
    Governance.address,
    { from: ownerWallet }
   );

   GovernanceProxyAddress = GovernanceProxy.address;
   GovernanceProxyInstance = await GovernanceProxy.deployed();

  
   // deploy escrowed Governance
   await deployer.deploy(
      EscrowedGovernance,
      CEOwallet,
      { from: ownerWallet }
    );

    EscrowedGovernanceInstance = await EscrowedGovernance.deployed();

    await deployer.deploy(
        EscrowedGovernanceProxy,
        EscrowedGovernance.address,
        { from: ownerWallet }
    );

    EscrowedGovernanceProxyInstance = await EscrowedGovernanceProxy.deployed();
    
    await deployer.deploy(
        Gateway,
        { from: ownerWallet }
      );
    
    GatewayInstance = await Gateway.deployed();

    await deployer.deploy(
        RealEstate,
        GovernanceProxy.address,
        { from: ownerWallet }
      );
    
    RealEstateInstance = await RealEstate.deployed();

    currentdata = await readFileAsync(path.resolve(__dirname, '../latestContract.json'));
    currentdata = JSON.parse(currentdata);
    currentdata["Governance"] = GovernanceAddress;
    currentdata["GovernanceProxy"] = GovernanceProxyAddress;
    currentdata["EscrowedGovernance"] = EscrowedGovernance.address;
    currentdata["EscrowedGovernanceProxy"] = EscrowedGovernanceProxy.address;
    currentdata["Gateway"] = Gateway.address;
    currentdata["RealEstate"] = RealEstate.address;
    await writeFileAsync(path.resolve(__dirname, '../latestContract.json'), JSON.stringify(currentdata,undefined,2));

 };
  
 
