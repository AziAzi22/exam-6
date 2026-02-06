import { Router, type RequestHandler } from "express";
import { authorization } from "../middleware/authorization.js";
import { getSavedProducts, saveProduct } from "../controller/saved-product.ctr.js";

const saveProductRouter: Router = Router()


saveProductRouter.get("/save_or_unsave_product/:id", authorization, saveProduct as RequestHandler);
saveProductRouter.get("/get_saved_products", authorization, getSavedProducts as RequestHandler);

export default saveProductRouter