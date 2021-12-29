import { InfuraProvider } from '@ethersproject/providers'

import { fetchAbi } from '../components/useAbiFetch'

describe('fetchAbi', () => {
  const provider = new InfuraProvider(1, process.env.INFURA_API_KEY)

  it('fetches the ABI of verified contracts', async () => {
    expect(
      (
        await fetchAbi(
          '1',
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          provider,
          process.env.ETHERSCAN_API_KEY
        )
      ).abiText
    ).toMatchInlineSnapshot(`
      "function name() view returns (string)
      function approve(address guy, uint256 wad) returns (bool)
      function totalSupply() view returns (uint256)
      function transferFrom(address src, address dst, uint256 wad) returns (bool)
      function withdraw(uint256 wad)
      function decimals() view returns (uint8)
      function balanceOf(address) view returns (uint256)
      function symbol() view returns (string)
      function transfer(address dst, uint256 wad) returns (bool)
      function deposit() payable
      function allowance(address, address) view returns (uint256)
      event Approval(address indexed src, address indexed guy, uint256 wad)
      event Transfer(address indexed src, address indexed dst, uint256 wad)
      event Deposit(address indexed dst, uint256 wad)
      event Withdrawal(address indexed src, uint256 wad)"
    `)
  })

  it('returns empty string for non-contract addresses', async () => {
    expect(
      (
        await fetchAbi(
          '1',
          '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
          provider,
          process.env.ETHERSCAN_API_KEY
        )
      ).abiText
    ).toBe('')
  })

  it('fetches the ABI of the implementation contract if the address of a proxy target is passed', async () => {
    // EIP-1967 beacon proxy
    expect(
      (
        await fetchAbi(
          '1',
          '0xDd4e2eb37268B047f55fC5cAf22837F9EC08A881',
          provider,
          process.env.ETHERSCAN_API_KEY
        )
      ).abiText
    ).toMatchInlineSnapshot(`""`)

    // GnosisSafeProxy
    expect(
      (
        await fetchAbi(
          '1',
          '0x0DA0C3e52C977Ed3cBc641fF02DD271c3ED55aFe',
          provider,
          process.env.ETHERSCAN_API_KEY
        )
      ).abiText
    ).toMatchInlineSnapshot(`
      "constructor()
      event AddedOwner(address owner)
      event ApproveHash(bytes32 indexed approvedHash, address indexed owner)
      event ChangedMasterCopy(address masterCopy)
      event ChangedThreshold(uint256 threshold)
      event DisabledModule(address module)
      event EnabledModule(address module)
      event ExecutionFailure(bytes32 txHash, uint256 payment)
      event ExecutionFromModuleFailure(address indexed module)
      event ExecutionFromModuleSuccess(address indexed module)
      event ExecutionSuccess(bytes32 txHash, uint256 payment)
      event RemovedOwner(address owner)
      event SignMsg(bytes32 indexed msgHash)
      function NAME() view returns (string)
      function VERSION() view returns (string)
      function addOwnerWithThreshold(address owner, uint256 _threshold)
      function approveHash(bytes32 hashToApprove)
      function approvedHashes(address, bytes32) view returns (uint256)
      function changeMasterCopy(address _masterCopy)
      function changeThreshold(uint256 _threshold)
      function disableModule(address prevModule, address module)
      function domainSeparator() view returns (bytes32)
      function enableModule(address module)
      function encodeTransactionData(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) view returns (bytes)
      function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) returns (bool success)
      function execTransactionFromModule(address to, uint256 value, bytes data, uint8 operation) returns (bool success)
      function execTransactionFromModuleReturnData(address to, uint256 value, bytes data, uint8 operation) returns (bool success, bytes returnData)
      function getMessageHash(bytes message) view returns (bytes32)
      function getModules() view returns (address[])
      function getModulesPaginated(address start, uint256 pageSize) view returns (address[] array, address next)
      function getOwners() view returns (address[])
      function getThreshold() view returns (uint256)
      function getTransactionHash(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) view returns (bytes32)
      function isOwner(address owner) view returns (bool)
      function isValidSignature(bytes _data, bytes _signature) returns (bytes4)
      function nonce() view returns (uint256)
      function removeOwner(address prevOwner, address owner, uint256 _threshold)
      function requiredTxGas(address to, uint256 value, bytes data, uint8 operation) returns (uint256)
      function setFallbackHandler(address handler)
      function setup(address[] _owners, uint256 _threshold, address to, bytes data, address fallbackHandler, address paymentToken, uint256 payment, address paymentReceiver)
      function signMessage(bytes _data)
      function signedMessages(bytes32) view returns (uint256)
      function swapOwner(address prevOwner, address oldOwner, address newOwner)"
    `)
  })
})
