import razorpayInstance from "../config/razorpay.js";

const createRazorpayOrder = async (data) => {
  try {
    const { amount, currency, orderId } = data;
    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: orderId,
    });
    return order;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export { createRazorpayOrder };
