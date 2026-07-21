type Props = {
  data: string[];
};

function List({ data }: Props) {
  return (
    <ul ClassName="list-group">
      {data.map((elemento) => (
        <li key={elemento} ClassName="list-group-item">
          {elemento}
        </li>
      ))}
    </ul>
  );
}

export default List;
