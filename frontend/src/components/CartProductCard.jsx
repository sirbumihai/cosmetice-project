import PropTypes from "prop-types";

const CartProductCard = ({ product, onRemove, onUpdateQuantity }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      onUpdateQuantity(product.produs_id, newQuantity);
    }
  };

  return (
    <div className="w-64 h-auto rounded-2xl overflow-hidden shadow-lg m-4 flex flex-col justify-between bg-white">
      <div className="h-1/2 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={product.poza || "https://via.placeholder.com/150"} // Imagine placeholder
          alt={product.nume_produs}
        />
      </div>
      <div className="px-4 py-6 flex flex-col justify-between h-1/2">
        <h3 className="text-lg font-bold mb-2">{product.nume_produs}</h3>
        <p className="text-gray-700">{product.pret_unitar} RON</p>
        <div className="flex items-center">
          <label className="mr-2">Quantity:</label>
          <input
            type="number"
            value={product.cantitate}
            onChange={handleQuantityChange}
            className="border p-2 w-16"
            min="1"
          />
        </div>
        <button
          onClick={() => onRemove(product.produs_id)} // Buton pentru a elimina produsul din coș
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

CartProductCard.propTypes = {
  product: PropTypes.object.isRequired, // Detaliile produsului
  onRemove: PropTypes.func.isRequired, // Funcție pentru eliminare din coș
  onUpdateQuantity: PropTypes.func.isRequired, // Funcție pentru actualizarea cantității
};

export default CartProductCard;
