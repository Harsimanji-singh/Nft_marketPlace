const { network } = require("hardhat")
function sleep(timeinMs) {
    return new Promise((resolve) => setTimeout(resolve, timeinMs))
}
async function moveBlock(amount, sleepAmount = 0) {
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        if (sleepAmount) {
            await sleep(sleepAmount)
        }
    }
}
module.exports = {
    moveBlock,
    sleep,
}
