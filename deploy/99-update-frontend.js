const { ethers, network } = require("hardhat")
const fs = require("fs")
const { ECDH } = require("crypto")
const frontEndContractFile =
    "../frontend_nftmarketplace/constants/networkMapping.json"
const FRONT_END_ABI_FILE = "../front_lottery/constants/abi.json"
// console.log(fs)
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end..")
        await updateContractAddresses()
        // await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${FRONT_END_ABI_FILE}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.JSON)
    )
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${FRONT_END_ABI_FILE}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.JSON)
    )
}
async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractFile, "utf8")
    )
    if (chainId in contractAddresses) {
        if (
            !contractAddresses[chainId]["NftMarketplace"].includes(
                nftMarketplace.address
            )
        ) {
            contractAddresses[chainId]["NftMarketplace"].push(
                nftMarketplace.address
            )
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
        }
    }
    fs.writeFileSync(frontEndContractFile, JSON.stringify(contractAddresses))
    // fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
