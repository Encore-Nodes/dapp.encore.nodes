import { MouseEventHandler, useState } from "react";

const ButtonTable: React.FC<{
  onHandleClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}> = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <button
      disabled={loading}
      className="mr-4 px-2 py-1  border rounded-md  bg-slate-400 text-white hover:bg-slate-500 hover:text-white disabled:bg-slate-600 disabled:text-white dark:bg-gradient-to-tr dark:from-slate-600 dark:to-slate-700 hover:dark:from-slate-700 dark:disabled:from-slate-800 dark:disabled:to-slate-900"
      onClick={async (e) => {
        setLoading(true);
        await props.onHandleClick(e);
        setLoading(false);
      }}
    >
      {props.text}
    </button>
  );
};

export default ButtonTable;
