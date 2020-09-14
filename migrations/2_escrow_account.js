
// this address should be provided by Jude
// company wallet address which receive all pre-minted tokens and can manage with it in Escrow contract
const fs  = require("fs");
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
var path = require('path');
const Escrow = artifacts.require("Escrow"); //Escrow.sol
// deploy Escrow and Gateway contracts for main token (JNTR)

const {ownerWallet,CompanyWallet,CEOwallet } = require("../constant");


module.exports =async function(deployer) {

  await deployer.deploy(
    Escrow,
    CompanyWallet,
    { from: ownerWallet }
  );
  EscrowInstance = await Escrow.deployed();
/*
  currentdata = await readFileAsync(path.resolve(__dirname, '../latestContract.json'));
  currentdata = JSON.parse(currentdata);
  currentdata["Escrow"] = Escrow.address;
  await writeFileAsync(path.resolve(__dirname, '../latestContract.json'), JSON.stringify(currentdata,undefined,2));
*/
};
 
