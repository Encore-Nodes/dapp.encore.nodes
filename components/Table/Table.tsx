import Cell from "./Cell";
import { ButtonTable } from "../Buttons/index";
import { bnToString, timestampToDateString, toNumber } from "../../utils/uitls";

type Node = {
  name: string;
  rewards: string;
  lastClaimed: string;
  createTime: string;
};

const Table: React.FC<{ userNodes: Node[]; cashoutNodeRewards: (createTime: string) => Promise<void> }> = ({
  userNodes,
  cashoutNodeRewards,
}) => (
  <div className="grow-[2] basis-96 md:basis-64 h-full relative overflow-x-scroll rounded-lg lg:overflow-auto">
    <div className="absolute w-full h-full flex flex-col bg-slate-200 dark:bg-[#282230] min-w-[62rem]">
      <div className="flex bg-slate-100 dark:bg-[#373040] py-3 px-8 font-bold">
        <Cell>Node Name</Cell>
        <Cell>Pending Rewards</Cell>
        <Cell>Date Created</Cell>
        <Cell>Date Last Claimed</Cell>
        <Cell></Cell>
      </div>

      <div className="w-full h-full">
        <div className="relative w-full h-full overflow-y-scroll no-scrollbar">
          <div className="flex flex-col w-full h-full absolute items-center override-last-child-border">
            {userNodes.length > 0 ? (
              userNodes.map((node, i) => (
                <div key={i} className="flex items-center px-8 py-4 w-full basis-12 shrink-0 m-auto">
                  <Cell>{node.name}</Cell>
                  <Cell className="block grow basis-16 text-[#41A345]">
                    {toNumber(bnToString(node.rewards, 18), 0, 9)}
                  </Cell>
                  <Cell>{timestampToDateString(node.createTime)}</Cell>
                  <Cell>{timestampToDateString(node.lastClaimed)}</Cell>
                  <Cell className="flex justify-end">
                    <ButtonTable text="claim rewards" onHandleClick={() => cashoutNodeRewards(node.createTime)} />
                  </Cell>
                </div>
              ))
            ) : (
              <p className="block m-auto">You don’t have any nodes yet ...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Table;
