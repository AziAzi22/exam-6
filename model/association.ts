import { Auth } from "./auth.model.js";
import { Category } from "./category.models.js";
import { OrderProduct } from "./order.model.js";
import { Product } from "./product.model.js";
import { SavedProduct } from "./saved.product.js";

// category

Auth.hasMany(Category, { foreignKey: "adminId", as: "fk_adminId_category" });
Category.belongsTo(Auth, {
  foreignKey: "adminId",
  as: "fk_adminId_category_belongs",
});

// product

Auth.hasMany(Product, { foreignKey: "adminId", as: "fk_adminId_product" });
Product.belongsTo(Auth, {
  foreignKey: "adminId",
  as: "fk_adminId_product_belongs",
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "fk_categoryId_product",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "fk_categoryId_product_belongs",
});

// saved product

Auth.hasMany(SavedProduct, {
  foreignKey: "userId",
  as: "fk_userId_savedProduct",
});
SavedProduct.belongsTo(Auth, {
  foreignKey: "userId",
  as: "fk_userId_savedProduct_belongs",
});

Product.hasMany(SavedProduct, {
  foreignKey: "productId",
  as: "fk_productId_savedProduct",
});
SavedProduct.belongsTo(Product, {
  foreignKey: "productId",
  as: "fk_productId_savedProduct_belongs",
});

// order product

Auth.hasMany(OrderProduct, {
  foreignKey: "userId",
  as: "fk_userId_orderProduct",
});
OrderProduct.belongsTo(Auth, {
  foreignKey: "userId",
  as: "fk_userId_orderProduct_belongs",
});

Product.hasMany(OrderProduct, {
  foreignKey: "productId",
  as: "fk_productId_orderProduct",
});
OrderProduct.belongsTo(Product, {
  foreignKey: "productId",
  as: "fk_productId_orderProduct_belongs",
});

// export

export { Auth, Category, Product, SavedProduct, OrderProduct };
