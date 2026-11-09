import { Router } from "express";
import { addToCartController, checkoutController, getCartController, getMyOrdersController, getOrderByIdController, guestCheckoutController, guestPayOrderController, payOrderController, removeFromCartController } from "./order.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { createOrderSchema, guestCheckoutSchema } from "./order.schema";
import { validate } from "../../common/middlewares/validate.middleware";

const router = Router();

router.post("/cart" , authMiddleware , validate(createOrderSchema), addToCartController)
router.post("/:orderId/pay" , authMiddleware , payOrderController)
router.get("/cart", authMiddleware , getCartController)
router.delete("/cart/:courseId" , authMiddleware , removeFromCartController)
router.post("/checkout" , authMiddleware , checkoutController)
router.post("/guest-checkout",validate(guestCheckoutSchema),guestCheckoutController);
router.post("/guest/:orderId/pay", guestPayOrderController);
router.get("/" , authMiddleware , getMyOrdersController)
router.get("/:orderId" , authMiddleware , getOrderByIdController)

export default router