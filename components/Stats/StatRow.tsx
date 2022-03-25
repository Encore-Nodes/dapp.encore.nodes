const StatRow: React.FC = (props) => (
  <div className="grow flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0 basis-32">{props.children}</div>
);

export default StatRow;
