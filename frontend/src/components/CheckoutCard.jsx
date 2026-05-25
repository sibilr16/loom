function CheckoutCard({ item }) {
  return (
    <div className="flex gap-3 p-3">
      {/* Image */}
      <div className="w-16 h-20 rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-gray-100">
        <img
          className="w-full h-full object-cover"
          src={`https://loom-h6m8.onrender.com/uploads/${item.product.thumbnail}`}
          alt={item.product.productName}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-gray-800 leading-snug">
            {item.product.productName}
          </p>
          <p className="text-xs font-semibold text-gray-900 shrink-0">
            ₹{item.product.price * item.quantity}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] border border-gray-300 px-1.5 py-0.5 rounded text-gray-600">
            {item.size}
          </span>
          <span className="text-[10px] text-gray-400">
            Qty: {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCard;
