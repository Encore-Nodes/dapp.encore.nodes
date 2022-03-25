const Cell: React.FC<{ className?: string; isButtonContainer?: boolean }> = (props) => (
  <div className={`block grow basis-16 ${props.className && props.className}`}>{props.children}</div>
);

export default Cell;
