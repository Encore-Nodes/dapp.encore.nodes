import { StatRow, Stat } from "./index";
import { toUSD } from "../../utils/uitls";

const Stats: React.FC<{
  totalCreatedNodes: string;
  userNodesNumber: string;
  ENCORERewardsAmount: string;
  ENCORETokenBalance: string;
  tokenPrice: string;
}> = (props) => (
  <div className="grow flex flex-col space-y-6">
    <StatRow>
      <Stat title="Route: $ENCORE -> WAVAX -> USDC.e">
        <p className="text-2xl font-bold">{toUSD(props.tokenPrice, 2)} </p>
        <p>
          Current <span className="text-primary">$ENCORE</span> token price in USDC.e
        </p>
      </Stat>
      <Stat>
        <p className="text-2xl font-bold">
          {new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(props.ENCORETokenBalance))}
        </p>
        <p>
          Your current <span className="text-primary mt-2">$ENCORE</span> token balance
        </p>
      </Stat>
    </StatRow>
    <StatRow>
      <Stat>
        <p className="text-2xl font-bold">{props.totalCreatedNodes}</p>
        <p>
          Total <span className="text-primary">$ENCORE</span> Nodes
        </p>
      </Stat>

      <Stat>
        <p className="text-2xl font-bold text-[#41A345]">
          {new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 9 }).format(
            Number(props.ENCORERewardsAmount)
          )}
        </p>
        <p>
          Your pending <span className="text-primary">$ENCORE</span> Nodes rewards
        </p>
      </Stat>
      <Stat>
        <p className="text-2xl font-bold">{props.userNodesNumber}</p>
        <p>
          Your <span className="text-primary">$ENCORE</span> Nodes
        </p>
      </Stat>
    </StatRow>
  </div>
);

export default Stats;
