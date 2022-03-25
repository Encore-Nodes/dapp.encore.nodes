import { MouseEventHandler, ReactElement } from "react";
import { LoadingSpinner } from "../Icons";

const Button: React.FC<{
  className?: string;
  primary?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onHandleClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactElement;
  text: string;
}> = (props) => (
  <button
    disabled={props.disabled}
    onClick={props.onHandleClick}
    className={`flex justify-center items-center text-lg text-slate-50 space-x-2 py-2 px-4 rounded-md shadow-lg disabled:cursor-not-allowed ${
      props.primary
        ? props.loading
          ? "bg-[#2B60A6]"
          : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-[#2B60A6] hover:to-[#2B60A6]"
        : props.loading
        ? "bg-[#A63023]"
        : "bg-gradient-to-r from-[#F06647] to-[#ED564E] hover:from-[#A63023] hover:to-[#A63023]"
    } ${props.className}`}
  >
    {props.loading ? <LoadingSpinner /> : props.icon}
    <p>{props.text}</p>
  </button>
);

export default Button;
