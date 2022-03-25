import { Button } from "../Buttons/index";

const ButtonLink: React.FC<{ href: string; text: string; className?: string }> = (props) => (
  <a href={props.href} target="_blank" rel="noreferrer">
    <Button className={props.className} text={props.text}>
      {props.children}
    </Button>
  </a>
);

export default ButtonLink;
