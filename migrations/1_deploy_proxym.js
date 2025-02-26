const Proxym = artifacts.require("Proxym");


module.exports = async function (deployer) { 
  const prx = await deployer.deploy(Proxym); 
  
};
