import Card, { CardBody } from "./components/Card";
import List from "./components/List";

/*
function App() {
  return <CardBody title={"hola1"} text={"El texto del componente"} />;
}*/

function App() {
  const list = ["juank", "jk", "Pedro"];
  return (
    <Card>
      <CardBody title="prueba" text="otro texto" />
      <List data={list} />
    </Card>
  );
}

export default App;
