import { Link, useParams } from "react-router-dom";
import { VscHome } from "react-icons/vsc";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function BreadCrumb({ product }) {
  const { category } = useParams();

  return (
    <nav className="flex gap-1 p-4 items-center text-gray-900 tracking-wide text-sm ">
      <Link to="/">
        <VscHome />
      </Link>
      <span>
        <MdKeyboardDoubleArrowRight />
      </span>
      <Link className="capitalize" to={`/?category=${category}`}>
        {category}
      </Link>
      <span>
        <MdKeyboardDoubleArrowRight />
      </span>
      <span>{product.productName}</span>
    </nav>
  );
}

export default BreadCrumb;
