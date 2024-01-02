import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../../features/ProductsSlice";
import toast, { Toaster } from "react-hot-toast";

const mode = "development";
const API_BASE_URL = mode === "development" ? "http://localhost:5000" : "";

const Form = () => {
   const nav = useNavigate();

   const items = useSelector((state) => state.ProductsSlice.added_products);

   const calculateTotalAmount = () => {
      let total = 0;
      items.map((item) => (total = total + item.price * item.qty));

      return total;
   };

   const [transactionResponse, setTransactionResponse] = useState(null);
   const [otpScreen, setOtpScreen] = useState(false);
   const [otp, setOtp] = useState(null);

   const [formData, setFormData] = useState({
      cardNumber: "",
      cvv: "",
      expirationDate: "",
      amount: "",
      description: "",
   });
   const dispatch = useDispatch();
   const handleForm = async (e) => {
      e.preventDefault();
      const body = formData;
      body.amount = calculateTotalAmount() + 200;
      const response = await fetch(
         `${API_BASE_URL}/api/card/initiate-card-payment`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         }
      );

      const data = await response.json();

      if (data) {
         if (!data.success) {
            toast.error(data.message);
         } else {
            setTransactionResponse(data);
            setOtpScreen(true);
            toast.success(data.message);
         }
         console.log("initiate-card-payment Response: ", data);
      }
      //   dispatch(emptyCart());
      //   nav("/TraceOrder");
   };

   const handleOtp = async (e) => {
      e.preventDefault();

      if (!otp) {
         toast.error("OTP is Required");
      }

      const body = {
         transactionId: transactionResponse.newOtpSession.transactionId,
         otp: Number(otp),
      };
      body.amount = calculateTotalAmount() + 200;
      const response = await fetch(`${API_BASE_URL}/api/card/verify-payment`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data) {
         if (!data.success) {
            toast.error(data.message);
         } else {
            toast.success(data.message);
            dispatch(emptyCart());
            nav("/TraceOrder");
         }
         console.log("initiate-card-payment Response: ", data);
      }
   };
   return (
      <div class="leading-loose w-screen md:w-7/12">
         <Toaster />
         <form
            class="max-w-xl my-4 sm:m-4 p-5 md:p-10 bg-white rounded shadow-xl"
            onSubmit={(e) => handleForm(e)}
         >
            <p class="text-gray-800 font-medium">Billing Details</p>
            <div class="">
               <label class="block text-sm text-gray-00" for="cus_name">
                  Name
               </label>
               <input
                  class="w-full px-5 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_name"
                  name="cus_name"
                  type="text"
                  required
                  placeholder="Your Name"
                  aria-label="Name"
               />
            </div>
            <div class="mt-2">
               <label class="block text-sm text-gray-600" for="cus_email">
                  Email
               </label>
               <input
                  class="w-full px-5  py-2  text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_email"
                  name="cus_email"
                  type="text"
                  required
                  placeholder="Your Email"
                  aria-label="Email"
               />
            </div>
            <div class="mt-2">
               <label class=" block text-sm text-gray-600" for="cus_email">
                  Address
               </label>
               <input
                  class="w-full px-2  py-2  text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_email"
                  name="cus_email"
                  type="text"
                  required
                  placeholder="Street"
                  aria-label="Email"
               />
            </div>
            <div class="mt-2">
               <label
                  class="hidden text-sm block text-gray-600"
                  for="cus_email"
               >
                  City
               </label>
               <input
                  class="w-full px-2 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_email"
                  name="cus_email"
                  type="text"
                  required
                  placeholder="City"
                  aria-label="Email"
               />
            </div>
            <div class="inline-block mt-2 w-1/2 pr-1">
               <label
                  class="hidden block text-sm text-gray-600"
                  for="cus_email"
               >
                  Country
               </label>
               <input
                  class="w-full px-1 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_email"
                  name="cus_email"
                  type="text"
                  required
                  placeholder="Country"
                  aria-label="Email"
               />
            </div>
            <div class="inline-block mt-2 -mx-1 pl-1 w-1/2">
               <label
                  class="hidden block text-sm text-gray-600"
                  for="cus_email"
               >
                  Zip
               </label>
               <input
                  class="w-full px-2 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_email"
                  name="cus_email"
                  type="text"
                  required
                  placeholder="Zip"
                  aria-label="Email"
               />
            </div>
            <p class="mt-4 text-gray-800 font-medium">Payment information</p>
            <div class="space-y-5">
               <label class="block text-sm text-gray-600" for="cus_name">
                  Card
               </label>
               <input
                  class="w-full px-2 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_name"
                  name="card"
                  value={formData.cardNumber}
                  onChange={(e) =>
                     setFormData({ ...formData, cardNumber: e.target.value })
                  }
                  type="text"
                  required
                  placeholder="Card Number"
                  aria-label="Name"
               />
               <input
                  class="w-full px-2 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_name"
                  name="cus_name"
                  type="text"
                  required
                  placeholder="CVC"
                  aria-label="Name"
                  value={formData.cvv}
                  onChange={(e) =>
                     setFormData({ ...formData, cvv: e.target.value })
                  }
               />
               <input
                  class="w-full px-2 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_name"
                  name="cus_name"
                  type="text"
                  required
                  placeholder="Expiration Date"
                  aria-label="Name"
                  value={formData.expirationDate}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        expirationDate: e.target.value,
                     })
                  }
               />
            </div>
            <div class="mt-4">
               <button
                  class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded "
                  type="submit"
               >
                  Ordered
               </button>
            </div>
         </form>

         {otpScreen && (
            <form onSubmit={(e) => handleOtp(e)}>
               <input
                  class="w-full px-2 py-2 text-sm text-gray-700 bg-gray-200 rounded outline-emerald-500"
                  id="cus_name"
                  name="cus_name"
                  type="text"
                  required
                  placeholder="Enter OTP"
                  aria-label="Name"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
               />
               <button
                  class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded "
                  type="submit"
               >
                  Confirm
               </button>
            </form>
         )}
      </div>
   );
};

export default Form;
