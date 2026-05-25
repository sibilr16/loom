import { Link, useParams } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

function BreadCrumb({ product }) {
  const { category } = useParams();

  return (
    <nav className="flex items-center gap-1.5 px-4 py-3 text-xs text-gray-400 flex-wrap">
      <Link to="/" className="hover:text-gray-700 transition-colors">
        <Home size={13} />
      </Link>

      <ChevronRight size={12} className="text-gray-300" />

      <Link
        to={`/?category=${category}`}
        className="capitalize hover:text-gray-700 transition-colors"
      >
        {category}
      </Link>

      <ChevronRight size={12} className="text-gray-300" />

      <span className="text-gray-600 font-medium truncate max-w-[180px] sm:max-w-xs">
        {product.productName}
      </span>
    </nav>
  );
}

export default BreadCrumb;
