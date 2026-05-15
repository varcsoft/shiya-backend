import authRoutes from "./auth.js";
import healthRoutes from "./health.js";
import adminRoutes from "./admin.js";
import userRoutes from "./user.js";
import emailTemplatesRoutes from "./emailtemplate.js";
import productRoutes from "./product.js";
import orderRoutes from "./order.js";
import categoryRoutes from "./category.js";
import imagesRoutes from "./images.js";
import subcategoryRoutes from "./subcategory.js";
import cartRoutes from "./cart.js";
import variantRoutes from "./variant.js";
import urlRoutes from "./urlRoutes.js";
import webhooks from "../webhooks/index.js";
import collectionRoutes from "./collection.js";
import wishlistRoutes from "./wishlist.js";
import homeRoutes from "./home.js";
import faqRoutes from "./faq.js";
import utilRoutes from "./util.js";
import superspecificationRoutes from "./superspecification.js";



export const initRoutes = (app) => {
  
  app.use("/health", healthRoutes);
  app.use("/emailtemplates", emailTemplatesRoutes);
  // API routes
  app.use("/home", homeRoutes);
  app.use("/faqs", faqRoutes);
  app.use("/admin", adminRoutes);
  app.use("/images", imagesRoutes);
  app.use("/category", categoryRoutes);
  app.use("/collection", collectionRoutes);
  app.use("/wishlist", wishlistRoutes);
  app.use("/superspecification" , superspecificationRoutes);
  app.use("/subcategory", subcategoryRoutes);
  app.use("/product", productRoutes);
  app.use("/cart", cartRoutes);
  app.use("/variant", variantRoutes);
  app.use("/order", orderRoutes);
  app.use("/auth", authRoutes);
  app.use("/url", urlRoutes);
  app.use("/util", utilRoutes);
  app.use("/webhooks", webhooks);

  // app.use("/upload", uploadRoutes);
  app.use("/user", userRoutes);
  app.use("/admin", adminRoutes);
};
