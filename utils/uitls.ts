import { BigNumber, ethers } from "ethers";
import { ENCORE_WAVAX_LP_DATA, USDCE_WAVAX_LP_DATA } from "./constants";

export const toHex = (num: number | string) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const toUSD = (value: string, decimals?: number) =>
  new Intl.NumberFormat("en-EN", { style: "currency", currency: "USD", maximumFractionDigits: decimals }).format(
    Number(value)
  );

export const bnToString = (value: BigNumber | string, decimals: number) => ethers.utils.formatUnits(value, decimals);

export const toNumber = (value: string, minimumFractionDigits = 0, maximumFractionDigits = 0) => {
  return new Intl.NumberFormat("en-EN", { minimumFractionDigits, maximumFractionDigits }).format(Number(value));
};

export const timestampToDateString: (_date: EpochTimeStamp | string) => string = (_date) => {
  const date = new Date((_date as number) * 1000);
  return `${date.getUTCMonth() + 1}.${date.getUTCDate()}.${date.getUTCFullYear()}`;
};

const calculatePairPrice = async (
  address: string,
  abi: string[],
  provider: any,
  r0Decimal: number,
  r1Decimal: number
) => {
  const contract = new ethers.Contract(address, abi, provider);
  const [reserve0Bn, reserve1Bn] = await contract.getReserves();
  const reserve0 = Number(ethers.utils.formatUnits(reserve0Bn, r0Decimal));
  const reserve1 = Number(ethers.utils.formatUnits(reserve1Bn, r1Decimal));
  return reserve0 / reserve1;
};

export const getTokenPrice = async (provider: any) => {
  try {
    const wavaxPriceInUSDCE = await calculatePairPrice(
      USDCE_WAVAX_LP_DATA.address,
      USDCE_WAVAX_LP_DATA.abi,
      provider,
      6,
      18
    );
    const ENCOREPriceInWAVAX = await calculatePairPrice(
      ENCORE_WAVAX_LP_DATA.address,
      ENCORE_WAVAX_LP_DATA.abi,
      provider,
      18,
      18
    );

    return (wavaxPriceInUSDCE / ENCOREPriceInWAVAX).toString();
  } catch (err) {
    return "0";
  }
};
