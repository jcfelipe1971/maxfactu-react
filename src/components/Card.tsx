import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Card(props: Props) {
  const { children } = props;
  return (
    <div
      ClassName="card"
      style={{
        width: "350px",
      }}
    >
      <div ClassName="card-body">{children}</div>
    </div>
  );
}

interface CardBodyProps {
  title: string;
  text?: string;
}

export function CardBody(props: CardBodyProps) {
  const { title, text } = props;
  return (
    <>
      <h5 ClassName="card-title">{title}</h5>
      <p ClassName="card-text">{text}</p>
    </>
  );
}

export default Card;
