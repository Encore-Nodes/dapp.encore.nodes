const Stat: React.FC<{ title?: string }> = (props) => (
  <div
    {...(props.title && { title: props.title })}
    className="flex flex-col justify-center items-center grow text-center bg-slate-200 dark:bg-[#282230] basis-32 sm:basis-80 p-4 rounded-lg"
  >
    {props.children}
  </div>
);

export default Stat;
