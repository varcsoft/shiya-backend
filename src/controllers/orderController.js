import response from "../config/response.js";
import { getAddressByIdAndUserId } from "../services/addressService.js";
import { createOrderItem } from "../services/orderItemService.js";
import {
  getOrdersByUserId,
  deleteOrder,
  createOrder,
  getOrderById,
  getOrderByOrderAndUserId,
  updateOrder,
  getOrders,
  getOrdersByDateRange,
} from "../services/orderService.js";
import { getVariantByVariantAndProductId } from "../services/productVariantService.js";
import { getProductById } from "../services/productService.js";
import { createRazorpayOrder } from "../services/razorpayInstance.js";
import { createTransaction } from "../services/transactionService.js";
import { getCartItems } from "../services/cartService.js";

const createOrderC = async (req, res) => {
  try {
    const { products, addressId } = req.body;

    const addressExist = await getAddressByIdAndUserId(addressId, req.user.id);
    if (!addressExist) {
      return response.sendError(res, 400, 2006, "Address does not exist");
    }
    const orderData = {
      userId: req.user.id,
      addressId: addressExist.id,
    };
    console.log("orderData", orderData);
    const order = await createOrder(orderData);

    const orderedProducts = await Promise.all(
      products.map(async (item) => {
        if (!item?.variantId) {
          const product = await getProductById(item.productId);
          if (!product) {
            return response.sendError(res, 400, 2000);
          }
          console.log("product", product);
          return {
            orderId: order.id,
            productId: item.productId,
            product_name: product.name,
            product_description: product.description,
            product_price: product.price,
            offer_price: product.offerPrice,
            product_quantity_type: product.quantityType,
            quantity: item.quantity || 1, // likely intended
            totalPrice:
              (item.quantity || 1) *
              (product.enableOffer ? product.offerPrice : product.price),
          };
        }

        const productVariant = await getVariantByVariantAndProductId(
          item.variantId,
          item.productId,
        );
        if (!productVariant) {
          return response.sendError(res, 400, 2000);
        }
        return {
          orderId: order.id,
          productId: item.productId,
          product_name: productVariant.product.name,
          product_description: productVariant.product.description,
          product_price: productVariant.product.price,
          offer_price: productVariant.offerPrice,
          product_quantity_type: productVariant.product.quantityType,

          productVariantId: item.variantId,
          variant_label: productVariant.label,
          variant_quantity: productVariant.quantity,
          variant_quantity_type: productVariant.quantityType,
          variant_price: productVariant.price,
          quantity: item.quantity || 1, // likely intended
          totalPrice:
            (item.quantity || 1) *
            (productVariant.enableOffer
              ? productVariant.offerPrice
              : productVariant.price),
        };
      }),
    );

    const bigTotalPrice = orderedProducts.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );
    await Promise.all(
      orderedProducts.map(async (item) => {
        await createOrderItem(item);
      }),
    );
    const razorpayOrder = await createRazorpayOrder({
      amount: bigTotalPrice,
      currency: "INR",
      orderId: order.id,
    });
    const transaction = await createTransaction({
      userId: req.user.id,
      gatewayOrderId: razorpayOrder.id,
      amount: bigTotalPrice,
    });
    await updateOrder(order.id, {
      transactionId: transaction.id,
    });

    return response.sendSuccess(res, 201, "Order created successfully", {
      order,
      transaction,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return response.sendError(res, 500, 999);
  }
};
const createOrderFromCartC = async (req, res) => {
  try {
    const { addressId } = req.body;
    const products = await getCartItems(req.user.id);
    const addressExist = await getAddressByIdAndUserId(addressId, req.user.id);
    if (!addressExist) {
      return response.sendError(res, 400, 2006, "Address does not exist");
    }
    const orderData = {
      userId: req.user.id,
      addressId: addressExist.id,
    };
    console.log("orderData", orderData);
    const order = await createOrder(orderData);

    const orderedProducts = await Promise.all(
      products.map(async (item) => {
        if (!item?.variantId) {
          const product = await getProductById(item.productId);
          if (!product) {
            return response.sendError(res, 400, 2000);
          }
          console.log("product", product);
          return {
            orderId: order.id,
            productId: item.productId,
            product_name: product.name,
            custom: item.custom || {},
            product_description: product.description,
            product_price: product.price,
            offer_price: product.offerPrice,
            product_quantity_type: product.quantityType,
            quantity: item.quantity || 1, // likely intended

            totalPrice:
              (item.quantity || 1) *
              (product.enableOffer ? product.offerPrice : product.price),
          };
        }

        const productVariant = await getVariantByVariantAndProductId(
          item.variantId,
          item.productId,
        );
        if (!productVariant) {
          return response.sendError(res, 400, 2000);
        }
        return {
          orderId: order.id,
          productId: item.productId,
          custom: item.custom || {},
          product_name: productVariant.product.name,
          product_description: productVariant.product.description,
          product_price: productVariant.product.price,
          offer_price: productVariant.offerPrice,
          product_quantity_type: productVariant.product.quantityType,
          productVariantId: item.variantId,
          variant_label: productVariant.label,
          variant_quantity: productVariant.quantity,
          variant_quantity_type: productVariant.quantityType,
          variant_price: productVariant.price,
          quantity: item.quantity || 1, // likely intended
          totalPrice:
            (item.quantity || 1) *
            (productVariant.enableOffer
              ? productVariant.offerPrice
              : productVariant.price),
        };
      }),
    );

    const bigTotalPrice = orderedProducts.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );
    await Promise.all(
      orderedProducts.map(async (item) => {
        await createOrderItem(item);
      }),
    );
    const razorpayOrder = await createRazorpayOrder({
      amount: bigTotalPrice,
      currency: "INR",
      orderId: order.id,
    });
    const transaction = await createTransaction({
      userId: req.user.id,
      gatewayOrderId: razorpayOrder.id,
      amount: bigTotalPrice,
    });
    await updateOrder(order.id, {
      transactionId: transaction.id,
    });

    return response.sendSuccess(res, 201, "Order created successfully", {
      order,
      transaction,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return response.sendError(res, 500, 999);
  }
};
const getOrderByIdC = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);
    if (!order) {
      return response.sendError(res, 404, 2007);
    }
    return response.sendSuccess(
      res,
      200,
      "Order retrieved successfully",
      order,
    );
  } catch (err) {
    console.log(err);
    return response.sendError(res, 500, 999);
  }
};
const deleteOrderC = async (req, res) => {
  try {
    const orderExist = await getOrderByOrderAndUserId(
      req.params.id,
      req.user.id,
    );
    if (!orderExist) {
      return response.sendError(res, 404, 2007);
    }
    const orderId = req.params.id;
    await deleteOrder(orderId);
    return response.sendSuccess(res, 204, "Order deleted successfully");
  } catch (err) {
    console.log(err);
    response.sendError(res, 500, 999);
  }
};
const getAllOrdersC = async (req, res) => {
  try {
    const orders = await getOrders();
    return response.sendSuccess(
      res,
      200,
      "Orders retrieved successfully",
      orders,
    );
  } catch (err) {
    response.sendError(res, 500, 999);
  }
};
const getOrdersC = async (req, res) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    return response.sendSuccess(
      res,
      200,
      "Orders retrieved successfully",
      orders,
    );
  } catch (err) {
    response.sendError(res, 500, 999);
  }
};
const updateOrderStatusC = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;
    const check = await getOrderById(orderId);
    if (!check) {
      return response.sendError(res, 404, 2007);
    }
    if (check.orderStatus !== orderStatus) {
      await updateOrder(orderId, {
        orderStatus,
      });
    }
    return response.sendSuccess(res, 200, "Order status updated successfully");
  } catch (err) {
    response.sendError(res, 500, 999);
  }
};
const getOrderReportC = async (req, res) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    const orders = await getOrdersByDateRange(from, to);
    return response.sendSuccess(
      res,
      200,
      "Orders retrieved successfully",
      orders,
    );
  } catch (err) {
    response.sendError(res, 500, 999);
  }
};

export {
  createOrderC,
  getOrderByIdC,
  deleteOrderC,
  getAllOrdersC,
  getOrdersC,
  createOrderFromCartC,
  getOrderReportC,
  updateOrderStatusC,
};
