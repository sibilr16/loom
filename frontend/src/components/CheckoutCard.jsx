function CheckoutCard({ item }) {
  // console.log(item);
  return (
    <div className="flex gap-3 p-2 ">
      <div className="h-20 rounded-lg border-4 border-white w-14 overflow-hidden">
        <img
          className="w-full h-full object-cover "
          src={`http://localhost:3000/uploads/${item.product.thumbnail}`}
          alt=""
        />
      </div>
      <div className="flex-1">
        <div className="flex mt-3 items-center justify-between">
          <p className="text-xs">{item.product.productName}</p>
          <p className="text-xs ">{`RS.${item.product.price}`}</p>
        </div>
        <div className="flex mt-2 gap-3">
          <p className="text-xs border inline px-1">{item.size}</p>
          <p className="text-xs">{`${item.quantity}No.s`}</p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCard;
