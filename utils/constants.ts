export const AVAX_C_ID = 43114;
//export const AVAX_C_ID = 1337;
export const RPC_URLS = {
  1: "https://ethereumnodelight.app.runonflux.io",
  56: "https://bsc-dataseed.binance.org/",
  60: "https://rpc.gochain.io",
  88: "https://rpc.tomochain.com",
  128: "https://http-mainnet.hecochain.com/",
  137: "https://polygon-rpc.com/",
  250: "https://rpc.ftm.tools/",
  820: "https://clo-geth.0xinfra.com/",
  [AVAX_C_ID]: "https://api.avax.network/ext/bc/C/rpc",
  42161: "https://arb1.arbitrum.io/rpc",
};

export const ENCORE_DATA = {
  address: "0xd5e23742c2fa216909ee11abd75f9551154ee268",
  abi: [
    "function getTotalCreatedNodes() public view returns (uint256)",
    "function getNodeNumberOf(address account) public view returns (uint256)",
    "function getRewardAmount() public view returns (uint256)",
    "function createNodeWithTokens(string memory name) public",
    "function cashoutAll() public",
    "function approve(address spender, uint256 value) returns (bool)",
    "function getNodesNames() public view returns (string memory)",
    "function getNodesRewards() public view returns (string memory)",
    "function getNodesLastClaims() public view returns (string memory)",
    "function getTotalStakedReward() public view returns (uint256)",
    "function publiDistriRewards() public",
    "function balanceOf(address owner) view returns (uint balance)",
    "function getNodesCreatime() public view returns (string memory)",
    "function cashoutReward(uint256 blocktime) public",
  ],
};

export const ENCORE_WAVAX_LP_DATA = {
  address: "0x12DbB50F791cE2908A2b73477a6e9554fA6794C5",
  abi: ["function getReserves() public view returns (uint, uint, uint)"],
};

export const USDCE_WAVAX_LP_DATA = {
  address: "0xA389f9430876455C36478DeEa9769B7Ca4E3DDB1",
  abi: ["function getReserves() public view returns (uint, uint, uint)"],
};
