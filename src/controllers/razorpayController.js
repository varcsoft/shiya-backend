import {
  markAuthorized,
  markCaptured,
  markFailed,
} from "../services/transactionService.js";
import {
  PAYMENT_AUTHORIZED,
  PAYMENT_CAPTURED,
  PAYMENT_FAILED,
  ORDER_CREATED,
  ORDER_CANCELLED,
} from "../utils/constants.js";

const processOrder = async (req, res) => {
  const event = req.body.event;
  const payload = req.body.payload;
  console.log("Event Captured", event);
  console.log("Order Captured", payload);
  console.log("Signature Is Valid", req.signatureIsValid);

  if (req.signatureIsValid) {
    let payment = payload.payment.entity;
    switch (event) {
      case PAYMENT_CAPTURED:
        await markCaptured({
          gatewayOrderId: payment.order_id,
          gatewayPaymentId: payment.id,
          fee: payment.fee,
          tax: payment.tax,
          baseAmount: payment.amount,
        });
        break;
      case PAYMENT_AUTHORIZED:
        await markAuthorized({
          gatewayOrderId: payment.order_id,
          method: payment.method,
          vpa: payment.vpa,
          email: payment.email,
          contact: payment.contact,
        });
        break;

      case PAYMENT_FAILED:
        await markFailed({ gatewayOrderId: payment.order_id });
        break;
      default:
        console.log("Unhandled event:", event);
        break;
    }

    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false });
  }
};

const processPayment = async (req, res) => {
  try {
    const event = req.body.event;
    const payload = req.body.payload;

    console.log("Event Captured", event);
    console.log("Payment Captured", payload);
    console.log("Signature Is Valid", req.signatureIsValid);
    if (req.signatureIsValid) {
      let payment = payload.payment.entity;
      switch (event) {
        case PAYMENT_CAPTURED:
          await markCaptured({
            gatewayOrderId: payment.order_id,
            gatewayPaymentId: payment.id,
            fee: payment.fee,
            tax: payment.tax,
            baseAmount: payment.amount,
          });
          break;
        case PAYMENT_AUTHORIZED:
          await markAuthorized({
            gatewayOrderId: payment.order_id,
            method: payment.method,
            vpa: payment.vpa,
            email: payment.email,
            contact: payment.contact,
          });
          break;

        case PAYMENT_FAILED:
          await markFailed({ gatewayOrderId: payment.order_id });
          break;
        default:
          console.log("Unhandled event:", event);
          break;
      }

      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error("Error processing payment:", err);
    return res.status(500).json({ success: false });
  }
};

export { processOrder, processPayment };
