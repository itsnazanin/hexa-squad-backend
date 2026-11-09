import { Request , Response , NextFunction } from "express"
import { addToCart, checkout, getCart, getMyOrders, getOrderById, guestCheckout, payOrder, removeFromCart } from "./order.service"
import { AuthRequest } from "../../types/AuthRequest"
import { AppError } from "../../common/errors/AppErrors"

export const payOrderController = async ( req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const userId = req.user?.id;

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError("Invalid order ID", 400);
    }

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const order = await payOrder({
      orderId,
      userId,
    });

    return res.status(200).json({
      message: "Payment successful",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const guestPayOrderController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError("Invalid order ID", 400);
    }

    const guestCheckoutToken = req.header(
      "x-guest-checkout-token"
    );

    if (!guestCheckoutToken) {
      throw new AppError("Unauthorized", 401);
    }

    const order = await payOrder({
      orderId,
      guestCheckoutToken,
    });

    return res.status(200).json({
      message: "Guest payment successful",
      order,
    });
  } catch (error) {
    next(error);
  }
};


export const addToCartController = async ( req: AuthRequest, res: Response ,  next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

     if(!userId){
       throw new AppError(
       "Unauthorized",
       401
       )
    }

    const order = await addToCart(
      userId,
      courseId
    );

    return res.status(200).json({
      message: "Course added to cart successfully",
      cart: order,
    });
  } catch (error) {
    next(error)
  }
};

export const getCartController = async ( req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const language = req.query.lang === "en" ? "EN" : "FA";

    const cart = await getCart(userId, language);

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};


export const removeFromCartController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        const userId = req.user?.id
        const courseId = Number(req.params.courseId)

        if(!userId){
            throw new AppError(
                "Unauthorized",
                401
            )
        }

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

        const cart = await removeFromCart(courseId, userId )

        return res.status(200).json({
            message: "Course removed from cart successfully",
            cart
        })

    }catch(error){
        next(error)
    }
}


export const checkoutController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        const userId = req.user?.id


        if(!userId){
            throw new AppError(
                "Unauthorized",
                401
            )
        }

        const cart = await checkout(userId)

        return res.status(200).json({
            message: "Checkout successful",
            cart
        })

    }catch(error){
        next(error)
    }
}



export const guestCheckoutController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { guestName, guestPhone, guestEmail, courseIds } = req.body;

    const result = await guestCheckout({ guestName, guestPhone, guestEmail, courseIds });

    return res.status(201).json({
      message: "Guest checkout successful",
      order: result.order,
      guestCheckoutToken: result.guestCheckoutToken,
    });
  } catch (error) {
    next(error);
  }
};


export const getMyOrdersController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{

        const userId = req.user?.id

        if(!userId){
            throw new AppError(
                "Unauthorized",
                401
            )
        }

        const orders = await getMyOrders(userId)

        return res.status(200).json({
            orders
        })

    }catch(error){
        next(error)
    }
}


export const getOrderByIdController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        const userId = req.user?.id
        const orderId = Number(req.params.orderId)


        if(!userId){
            throw new AppError(
                "Unauthorized",
                401
            )
        }

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new AppError("Invalid order ID", 400);
        }

        const order = await getOrderById(userId , orderId)

        return res.status(200).json({
            order
        })

    }catch(error){
        next(error)
    }
}