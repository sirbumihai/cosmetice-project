import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  return (
    <div className="w-64 h-80 rounded overflow-hidden shadow-lg m-4 flex flex-col justify-between">
      <div className="h-2/3 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={product.poza || "https://via.placeholder.com/150"} // Placeholder pentru poze lipsă
          alt={product.nume_produs}
        />
      </div>
      <div className="px-4 py-2 h-1/3">
        <div className="font-bold text-lg mb-2 text-center">
          {product.nume_produs}
        </div>
        <p className="text-gray-700 text-sm">Price: ${product.pret}</p>
        <p className="text-gray-700 text-sm">Stock: {product.stoc}</p>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    poza: PropTypes.string.isRequired,
    nume_produs: PropTypes.string.isRequired,
    pret: PropTypes.number.isRequired,
    stoc: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
