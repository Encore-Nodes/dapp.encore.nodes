import { useRef, useState, useEffect, useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import toast, { useToasterStore } from "react-hot-toast";

import { EncoresIcon, Plus } from "../components/Icons/index";
import { Button, ButtonLink } from "../components/Buttons/index"
import { Stats }  from "../components/Stats/index";
import { NavBar } from "../components/NavBar/index";
import { ToastError, ToastInfo, ToastSuccess } from "../components/Toasts/index";
import { Modal } from "../components/Modal/index";
import { Table } from "../components/Table/index";

import { bnToString, getTokenPrice,  toHex } from "../utils/uitls";
import { AVAX_C_ID, RPC_URLS, ENCORE_DATA } from "../utils/constants";

type NodeEntity = {
  name: string;
  rewards: string;
  lastClaimed: string;
  createTime: string
}

const Home: NextPage = () => {
  const web3ModalRef = useRef<Web3Modal>();
  const [provider, setProvider] = useState<any>();
  const [ethersProvider, setEthersProvider] = useState<Web3Provider>();
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState<string>();
  const [ENCORELoading, setENCORELoading] = useState(false);
  const [totalCreatedNodes, setTotalCreatedNodes] = useState("0");
  const [userNodesNumber, setUserNodesNumber] = useState("0");
  const [ENCORERewardsAmount, setENCORERewardsAmount] = useState("0");
  const [ENCORETokenBalance, setENCORETokenBalance] = useState("0");
  const [tokenPrice, setTokenPrice] = useState("0")
  const [modalOpen, setModalOpen] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [userNodes, setUserNodes] = useState<NodeEntity[]>([])

  const isAvaxChain = useMemo(() => chainId === toHex(AVAX_C_ID), [chainId]);
  const { toasts } = useToasterStore();

  const errorMsg = useMemo(() => {
    if (account && !isAvaxChain) {
      return "Please change the network to AVAX C Chain";
    } else if (!account) {
      return "Please connect your wallet to fetch data and claim rewards";
    } else {
      return "";
    }
  }, [account, isAvaxChain]);

  const resetState = () => {
    setUserNodes([]);
    setENCORERewardsAmount("0")
    setENCORETokenBalance("0")
    setUserNodesNumber("0")
  }

  /**
   * @dev connects the users wallet
   */
  const connectWallet = async () => {
    try {
      const provider = await web3ModalRef.current?.connect();
      const _ethersProvider = new ethers.providers.Web3Provider(provider);
      const accounts = await _ethersProvider.listAccounts();
      const network = await _ethersProvider.getNetwork();

      setProvider(provider);
      setEthersProvider(_ethersProvider);
      setChainId(toHex(network.chainId));
      if (accounts) setAccount(accounts[0]);
    } catch (error: any) {
      console.error(error);
    }
  };

  /**
   * @dev switch the network to avax c chain or add it to metamask
   */
  const switchNetwork = async () => {
    if (!ethersProvider?.provider.request) return;

    try {
      await ethersProvider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(AVAX_C_ID) }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await ethersProvider.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: toHex(AVAX_C_ID),
                rpcUrls: ["https://api.harmony.one"],
                chainName: "Avalanche Network",
                nativeCurrency: { name: "AVAX", decimals: 18, symbol: "AVAX" },
                blockExplorerUrls: ["https://api.avax.network/ext/bc/C/rpc"],
                iconUrls: ["https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022"],
              },
            ],
          });
        } catch (err: any) {
          console.error(err);
        }
      }
    }
  };

  /**
   * @dev claims all the ENCORE node rewards
   */
  const cashoutAllNodesRewards = async () => {
    setENCORELoading(true);
    const signer = ethersProvider?.getSigner();
    const contract = new ethers.Contract(ENCORE_DATA.address, ENCORE_DATA.abi, signer);

    try {
      const tx = await contract.cashoutAll();
      await tx.wait();
      await fetchContractData();
      toast((t) => <ToastSuccess t={t} text="$ENCORE rewards claimed successfully!" />);
    } catch (err: any) {
      console.error("CASHOUTALL ERR: ", err);
      toast((t) => <ToastError t={t} text={err.message} />);
    } finally {
      setENCORELoading(false);
    }
  };

  const cashoutNodeRewards = async (createTime: string) => {
    const signer = ethersProvider?.getSigner();
    const contract = new ethers.Contract(ENCORE_DATA.address, ENCORE_DATA.abi, signer);

    try {
      const tx = await contract.cashoutReward(createTime);
      await tx.wait();
      await fetchContractData()
      toast((t) => <ToastSuccess t={t} text="Node rewards claimed successfully!" />);
    } catch(err: any) {
      if(err.data && err.data.message) {
        toast((t) => <ToastError t={t} text={(err as any).data.message} />);
      } else {
        toast((t) => <ToastError t={t} text={(err as any).message} />);
      }
      console.error(err)
    
    } 
  }

  /**
   * @dev fetches core nodes token balance and unpaid earnings
   */
  const fetchContractData = async () => {
    // get ENCORE data
    const signer = await ethersProvider?.getSigner();
    const address = await signer?.getAddress();
    const tnodes = new ethers.Contract(ENCORE_DATA.address, ENCORE_DATA.abi, signer);
    const _totalCreatedNodes = await tnodes.getTotalCreatedNodes();
    const _ENCORETokenBalance = await tnodes.balanceOf(address);
    const _tokenPrice = await getTokenPrice(ethersProvider);
    // needs to catch no-node owner error
    try {
      const _userNodesNumber = await tnodes.getNodeNumberOf(address);
      // fetch total reward amount
      const _ENCORERewardsAmount = await tnodes.getRewardAmount();
      // fetch nodes data
      const _nodeNames = await tnodes.getNodesNames();
      const _nodeRewards = await tnodes.getNodesRewards();
      const _nodeLastClaims = await tnodes.getNodesLastClaims();
      const _nodesCreatime = await tnodes.getNodesCreatime();
      // split the names
      const names = _nodeNames.split("#");
      const rewards = _nodeRewards.split("#")
      const lastClaimed = _nodeLastClaims.split("#");
      const nodesCreateTime = _nodesCreatime.split("#");

      const _userNodes = [];
      for(let i = 0; i < names.length; i++) {
        _userNodes.push({
          name: names[i],
          rewards: rewards[i],
          lastClaimed: lastClaimed[i],
          createTime: nodesCreateTime[i]
        })
      } 
      setUserNodes(_userNodes)
      setENCORERewardsAmount(bnToString(_ENCORERewardsAmount, 18));
      setUserNodesNumber(_userNodesNumber.toString());
    } catch (err: any) {
      console.error(err);
    }
    setTokenPrice(_tokenPrice)
    setENCORETokenBalance(bnToString(_ENCORETokenBalance.toString(), 18));
    setTotalCreatedNodes(_totalCreatedNodes.toString());
    
  };

  /** 
  * @dev toggles modal
  */
     const toggleModal = () => {
      setModalOpen((prev) => !prev);
    };
  
  /** 
  * @dev creates a node with a name
  * @param name the name of the node
  */
  const handleCreateNode = async (name: string) => {
    try {
      const signer = await ethersProvider?.getSigner();
      const tnodes = new ethers.Contract(ENCORE_DATA.address, ENCORE_DATA.abi, signer);
      const tx = await tnodes.createNodeWithTokens(name);
      await tx.wait()
      await fetchContractData();
      toast((t) => <ToastSuccess t={t} text={"Node created successfully!"} />);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.data.message);
    }
  };

  /**
   * @dev fetch and set data on chain and account change
   */
  useEffect(() => {
    if (isAvaxChain && account) {
      fetchContractData();
    } else {
      if (web3ModalRef.current?.cachedProvider === "injected") {
        switchNetwork();
      }
    }
  }, [isAvaxChain, account]);

  /**
   * @dev init web3modal on first page load and connect if cached connection found
   */
  useEffect(() => {
    const init = async () => {
      web3ModalRef.current = new Web3Modal({
        cacheProvider: true,
        disableInjectedProvider: false,
        network: "avalanche-fuji-mainnet",
        theme: "dark",
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              network: "avalanche-fuji-mainnet",
              rpc: RPC_URLS,
            },
          },
        },
      });

      if (web3ModalRef.current.cachedProvider) {
        await connectWallet();
      }
      setIsInit(false);
    };
    init();
  }, []);

  /**
   * @dev handle events through tracking the provider state
   */
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = async (accounts: any) => {
        // clear cache on metamask disconnect
        if (accounts.length === 0) {
          await web3ModalRef.current?.clearCachedProvider();
        }
        resetState()
        setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", async () => {
        console.log("disconnect");
        await web3ModalRef.current?.clearCachedProvider();
        setAccount("");
      });

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [provider]);

  /** 
  * @dev show connect wallet error if not connected
  * or dismiss the notification
  */
  useEffect(() => {
    if (!isInit) {
      if (errorMsg.length > 0) {
        toast((t) => <ToastInfo t={t} text={errorMsg} />, {
          duration: Infinity,
        });
      } else {
        for (const { id } of toasts) {
          toast.dismiss(id);
        }
      }
    }
  }, [errorMsg, isInit]);

  return (
    <div className="container px-4 mx-auto py-16 h-auto min-h-screen flex flex-col">
      <Head>
        <title>Core Nodes - Claim USDC.e rewards</title>
        <meta property="og:title" content="Core Nodes - Claim usdc.e rewards" key="title" />
        <meta
          property="og:description"
          content="Core Nodes - Sustainable Passive Income. Built on the Avalanche Network. Earn Passive Rewards in $USDC and 0.9% Rewards from NAAS"
          key="description"
        />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      {modalOpen && <Modal toggleModal={toggleModal} onCreateNodeHandler={handleCreateNode} />}
      <NavBar onConnect={connectWallet} isConnected={!!account} />
      <div className="flex flex-col grow space-y-6 pt-6 md:pt-8 lg:pt-12">
        <Stats
          totalCreatedNodes={totalCreatedNodes}
          userNodesNumber={userNodesNumber}
          ENCORERewardsAmount={ENCORERewardsAmount}
          ENCORETokenBalance={ENCORETokenBalance}
          tokenPrice={tokenPrice}
        />
        <Table userNodes={userNodes} cashoutNodeRewards={cashoutNodeRewards}  />
      </div>
      <div className="flex justify-center md:justify-between items-center pt-10">
        <div className="flex space-y-4 md:space-y-0 flex-col md:flex-row w-full sm:w-auto justify-center items-center md:space-x-4 flex-wrap">
          <Button
            primary
            text="Claim All"
            className="w-full sm:w-64 md:w-auto"
            onHandleClick={cashoutAllNodesRewards}
            loading={ENCORELoading}
            icon={<EncoresIcon />}
            disabled={!isAvaxChain}
          />
          <Button
            primary
            text="Create node"
            className="w-full sm:w-64 md:w-auto"
            onHandleClick={() => {
              setModalOpen(true);
            }}
            icon={<Plus />}
            disabled={!isAvaxChain}
          />
          <div className="md:hidden w-full sm:w-64 md:w-auto">
          <ButtonLink
           className="w-full sm:w-64 md:w-auto"
            href="https://traderjoexyz.com/trade?outputCurrency=0xe1c1a8dcd6ae8b17cc2923a82ddb9bf8827095b7#/"
            text="Buy $ENCORE"
          />
          </div>
        </div>
        <div className="hidden md:block">
          <ButtonLink
            href="https://traderjoexyz.com/trade?outputCurrency=0xe1c1a8dcd6ae8b17cc2923a82ddb9bf8827095b7#/"
            text="Buy $ENCORE"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
