import { useEffect, useState } from "react";
import { fetchData, insertData, updateData, deleteData } from "../utils/api";
import { Link } from "react-router-dom";
import TableComponent from "../components/TableComponent";

// Adăugăm un id implicit pentru fiecare obiect din data dacă lipsește
const addDefaultId = (data, idColumn) => {
  return data.map((item, index) => ({
    ...item,
    id: item[idColumn] || `${idColumn}-${index}-${Date.now()}`,
  }));
};

const Dashboard = () => {
  const [client, setClient] = useState([]);
  const [categorii, setCategorii] = useState([]);
  const [comenzi, setComenzi] = useState([]);
  const [furnizori, setFurnizori] = useState([]);
  const [ingrediente, setIngrediente] = useState([]);
  const [produse, setProduse] = useState([]);
  const [produsecomenzi, setProdusecomenzi] = useState([]);
  const [produseingrediente, setProduseingrediente] = useState([]);

  const reloadData = async () => {
    try {
      const clientData = await fetchData("client");
      setClient(addDefaultId(clientData, "client_id"));

      const categoriiData = await fetchData("categorii");
      setCategorii(addDefaultId(categoriiData, "categorie_id"));

      const comenziData = await fetchData("comenzi");
      setComenzi(addDefaultId(comenziData, "comanda_id"));

      const furnizoriData = await fetchData("furnizori");
      setFurnizori(addDefaultId(furnizoriData, "furnizori_id"));

      const ingredienteData = await fetchData("ingrediente");
      setIngrediente(addDefaultId(ingredienteData, "ingredient_id"));

      const produseData = await fetchData("produse");
      setProduse(addDefaultId(produseData, "produs_id"));

      const produsecomenziData = await fetchData("produsecomenzi");
      setProdusecomenzi(addDefaultId(produsecomenziData, "comanda_id"));

      const produseingredienteData = await fetchData("produseingrediente");
      setProduseingrediente(addDefaultId(produseingredienteData, "produs_id"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md w-full fixed top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-500">
                Cosmetice
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Dashboard
              </Link>
              <Link
                to="/simple-queries"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                SimpleQueries
              </Link>
              <Link
                to="/complex-queries"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                ComplexQueries
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <h1 className="text-3xl font-bold text-blue-500 mb-4 mt-8 py-10">
        Dashboard
      </h1>
      <TableComponent
        title="Clienti"
        data={client}
        columns={["client_id", "username", "email"]}
        onInsert={(data) => insertData("client", data)}
        onUpdate={(id, data) => updateData("client", { id, ...data })}
        onDelete={(id) => deleteData("client", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Categorii"
        data={categorii}
        columns={["categorie_id", "nume_categorie", "descriere"]}
        onInsert={(data) => insertData("categorii", data)}
        onUpdate={(id, data) => updateData("categorii", { id, ...data })}
        onDelete={(id) => deleteData("categorii", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Comenzi"
        data={comenzi}
        columns={[
          "comanda_id",
          "client_id",
          "data_comanda",
          "total",
          "status_comanda",
        ]}
        onInsert={(data) => insertData("comenzi", data)}
        onUpdate={(id, data) => updateData("comenzi", { id, ...data })}
        onDelete={(id) => deleteData("comenzi", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Furnizori"
        data={furnizori}
        columns={["furnizori_id", "nume_furnizor", "tara", "contact_email"]}
        onInsert={(data) => insertData("furnizori", data)}
        onUpdate={(id, data) => updateData("furnizori", { id, ...data })}
        onDelete={(id) => deleteData("furnizori", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Ingrediente"
        data={ingrediente}
        columns={["ingredient_id", "nume_ingredient", "descriere"]}
        onInsert={(data) => insertData("ingrediente", data)}
        onUpdate={(id, data) => updateData("ingrediente", { id, ...data })}
        onDelete={(id) => deleteData("ingrediente", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Produse"
        data={produse}
        columns={[
          "produs_id",
          "nume_produs",
          "pret",
          "stoc",
          "sex_destinat",
          "tip_ten",
          "categorie_id",
          "furnizori_id",
        ]}
        onInsert={(data) => insertData("produse", data)}
        onUpdate={(id, data) => updateData("produse", { id, ...data })}
        onDelete={(id) => deleteData("produse", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Produse Comenzi"
        data={produsecomenzi}
        columns={[
          "comanda_id",
          "produs_id",
          "cantitate",
          "pret_unitar",
          "discount",
        ]}
        onInsert={(data) => insertData("produsecomenzi", data)}
        onUpdate={(id, data) => updateData("produsecomenzi", { id, ...data })}
        onDelete={(id) => deleteData("produsecomenzi", id)}
        reloadData={reloadData}
      />
      <TableComponent
        title="Produse Ingrediente"
        data={produseingrediente}
        columns={["produs_id", "ingredient_id"]}
        onInsert={(data) => insertData("produseingrediente", data)}
        onUpdate={(id, data) =>
          updateData("produseingrediente", { id, ...data })
        }
        onDelete={(id) => deleteData("produseingrediente", id)}
        reloadData={reloadData}
      />
    </div>
  );
};

export default Dashboard;
