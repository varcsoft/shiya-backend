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
const refundRazorpayOrder = async ({ paymentId }) => {
  try {
    const refund = await razorpayInstance.payments.refund({
      paymentId,
    });
    return refund;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export { createRazorpayOrder, refundRazorpayOrder };
