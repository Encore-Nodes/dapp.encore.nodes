import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../Buttons/index";
import Plus from "../Icons/Plus";
import { ToastError } from "../Toasts/index";

const Modal: React.FC<{
  toggleModal: () => void;
  onCreateNodeHandler: (name: string) => Promise<void>;
}> = (props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const error = useMemo(() => {
    if (name.length < 4) {
      return "The name must be at least 4 letters long";
    } else if (name.includes("#")) {
      return `The name can't include "#"`;
    } else {
      return "";
    }
  }, [name]);

  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      e.preventDefault();
      await props.onCreateNodeHandler(name);
      setName("");
      setLoading(false);
      props.toggleModal();
    } catch (errMsg) {
      toast((t) => <ToastError t={t} text={(errMsg as any).toString()} />);
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto "
      aria-labelledby="create-node-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-slate-200 bg-opacity-40 dark:bg-black dark:bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="relative inline-block border border-slate-900 align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-slate-200 dark:bg-[#273138] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-xl font-bold dark:text-[#fdfdfd]" id="modal-title">
                  Create your <span className="text-primary">$ENCORE</span> Node
                </h3>
                <div className="mt-2">
                  <p className="dark:text-[#fdfdfd]">
                    Each ENCORE node requires <span className="font-bold">10 tokens</span> to generate
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Your Node Name ..."
                  className="w-full mt-2 p-2 border border-[#13171a] dark:text-[#fdfdfd]  dark:bg-[#282230]"
                  onChange={handleChange}
                />
                <div className="mt-2 h-6">{error && <p className="mt-2 text-red-500">{error}</p>}</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-400 dark:bg-[#13171a] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="ml-2">
              <Button
                primary
                text="Create Your Node"
                onHandleClick={handleClick}
                disabled={name.length === 0 || loading}
                loading={loading}
                icon={<Plus />}
              />
            </div>
            <button
              type="button"
              className="mt-3 flex justify-center items-center border border-black shadow-sm px-4 py-2 rounded-md bg-slate-300 dark:bg-gray-700 text-base font-medium  hover:bg-slate-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={props.toggleModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
