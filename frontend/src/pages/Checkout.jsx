import { useSelector } from "react-redux";
import { getNames } from "country-list";
import { useGetCartQuery } from "../services/cart";
import { useState } from "react";
import CheckoutCard from "../components/CheckoutCard";
import {
  useMakePaymentMutation,
  useVerifyPaymentMutation,
} from "../services/payment";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import { useSaveAddressMutation } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const user = useSelector((state) => state?.auth?.user);
  console.log(user?.addresses);
  console.log(user);
  const [formData, setFormData] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: user?.phoneNumber || "",
    saveInfo: false,
  });
  console.log(formData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { data: cartItems } = useGetCartQuery();
  const [saveAddress] = useSaveAddressMutation();
  const cartTotal = cartItems?.items?.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const countries = getNames();

  const [makePayment] = useMakePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addRessess = await saveAddress(formData);
      console.log(addRessess);
      const data = await makePayment({ amount: cartTotal }).unwrap();

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        return console.log("Razorpay SDK failed to load. Are you online?");
      }
      const options = {
        key: import.meta.env.VITE_RZP_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Payment",
        description: "Loom Payment",
        order_id: data.order_id,
        // image: "/logo.png",
        handler: async function (output) {
          const response = await verifyPayment(output);
          console.log(response);
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <button
        className="border m-4 px-4 py-1 border-gray-400 text-gray-800 rounded-md mb-2 text-sm cursor-pointer hover:bg-gray-900 hover:text-gray-50 transition-all duration-400 inline-fit"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="p-4 md:flex-row-reverse w-full md:max-w-6xl md:mx-auto flex flex-col">
        {/* Product */}
        <div className=" bg-gray-100 rounded-xs md:w-1/2">
          <ul className="">
            {cartItems &&
              cartItems.items.map((item) => (
                <li key={`${item.product._id}-${item.size}`}>
                  <CheckoutCard item={item} />
                </li>
              ))}
          </ul>
          <div className="p-3">
            <div className="flex justify-between">
              <p className="">Subtotal</p>
              <p className="">{`RS.${cartTotal}`}</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <p className="text-base mt-15 pb-2 border-b mb-10 border-gray-400">
            {user?.email}
          </p>

          <h2 className="font-semibold text-lg">Delivery</h2>
          <div>
            <form
              onSubmit={handleSubmit}
              action=""
              className="space-y-4 max-w-xs"
            >
              {user?.addresses[0] ? (
                <div></div>
              ) : (
                <>
                  <div className="max-w-xs border cursor-pointer mt-2 p-2 text-xs border-gray-300 rounded-lg ">
                    <p className="text-gray-500 pl-1">Country</p>
                    <select
                      value={formData.country}
                      onChange={handleChange}
                      className="border-0 w-full focus:outline-none bg-transparent"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      type="text"
                      className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                      placeholder="First name"
                    />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                      type="text"
                      placeholder="Last name"
                    />
                  </div>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                    type="text"
                    placeholder="Address"
                  />
                  <input
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                  <div className="flex flex-col gap-4">
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                      type="text"
                      placeholder="City"
                    />
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                      type="text"
                      placeholder="State"
                    />
                    <input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                      type="text"
                      placeholder="PIN code"
                    />
                  </div>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className=" w-full border px-3 py-4 rounded-lg cursor-pointer border-gray-300 text-xs focus:outline-none"
                    type="text"
                    placeholder="Phone Number"
                    // defaultValue={user?.phoneNumber}
                  />
                  <label className="text-xs cursor-pointer flex gap-2">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                    />
                    Save this information for next time
                  </label>
                </>
              )}

              <button
                type="submit"
                className="bg-gray-950 text-sm cursor-pointer w-full p-2 text-gray-50 rounded-md"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
