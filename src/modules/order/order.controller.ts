import { Response , NextFunction } from "express"
import { addToCart, checkout, getCart, getMyOrders, getOrderById, payOrder, removeFromCart } from "./order.service"
import { AuthRequest } from "../../types/AuthRequest"
import { AppError } from "../../common/errors/AppErrors"

export const payOrderController = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try{
        const userId = req.user?.id
        const orderId = Number(req.params.orderId)

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new AppError("Invalid order ID", 400);
        }

        if(!userId){
            throw new AppError(
                "Unauthorized",
                401
            )
        }

        const order = await payOrder(userId , orderId)

        return res.status(200).json({
            message: "Order paid successfully",
            order
        })

    }catch(error){
        next(error)
    }
}



export const addToCartController = async (
  req: AuthRequest,
  res: Response , 
  next: NextFunction
) => {
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

export const getCartController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{

        const userId = req.user?.id


        if(!userId){
            throw new AppError(
                "Unauthorized",
                401
            )
        }


        const cart = await getCart(userId)

        return res.status(200).json({
            cart
        })

    }catch(error){
        next(error)
    }
}


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