const Proxym = artifacts.require("Proxym");


module.exports = async function (deployer) { 
  await deployer.deploy(Proxym ,{gas : 6000000}); 
  
};
