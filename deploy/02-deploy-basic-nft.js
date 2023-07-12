const { network } = require("hardhat")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    await hre.storageLayout.export("layout.txt")
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitConfirmationss = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    const args = []
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitConfirmationss,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("verifying..")
        await verify(basicNft.address, args)
    }
    log("--------------------------------")
}
module.exports.tags = ["all", "basicnft"]
