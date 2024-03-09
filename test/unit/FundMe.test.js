const { expect } = require("chai")
const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther("1")
          beforeEach(async () => {
              // deploy fundMe
              // using Hardhat-deploy
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.target)
              })
          })
          describe("fund", () => {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmount(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Add funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("Withdraw ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecipt = await transactionResponse.wait(1)
                  //calculate the gas
                  const { gasUsed, gasPrice } = transactionRecipt
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingDeployerBalance + startingFundMeBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })
              it("allow us to withdraw with multiple funders ", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecipt = await transactionResponse.wait(1)
                  //calculate the gas
                  const { gasUsed, gasPrice } = transactionRecipt
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
                  await expect(fundMe.getFunders(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmount(accounts[i].address),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
                      "FundMe__NotOwner"
                  )
              })
              it("cheaper withdraw testing ...", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionRecipt = await transactionResponse.wait(1)
                  //calculate the gas
                  const { gasUsed, gasPrice } = transactionRecipt
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
                  await expect(fundMe.getFunders(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmount(accounts[i].address),
                          0
                      )
                  }
              })

              it("Withdraw ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionRecipt = await transactionResponse.wait(1)
                  //calculate the gas
                  const { gasUsed, gasPrice } = transactionRecipt
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingDeployerBalance + startingFundMeBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })
          })
      })
