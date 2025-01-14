import PropTypes from "prop-types";

const ProductCard = ({ product, renderItem, onAddToCart }) => {
  return (
    <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-lg m-4 flex flex-col justify-between bg-white">
      <div className="h-1/2 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={product.poza || "https://via.placeholder.com/150"} // Imagine placeholder
          alt={product.nume_produs}
        />
      </div>
      <div className="px-4 py-6 flex flex-col justify-between h-1/2">
        {renderItem(product)}
        <button
          onClick={onAddToCart} // Buton pentru a adăuga produsul în coș
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired, // Detaliile produsului
  renderItem: PropTypes.func.isRequired, // Funcție pentru conținut personalizat
  onAddToCart: PropTypes.func.isRequired, // Funcție pentru adăugare în coș
};

export default ProductCard;
