import { Response , NextFunction } from "express"
import { addToCart, checkout, getCart, getMyOrders, getOrderById, payOrder, removeFromCart } from "./order.service"
import { AuthRequest } from "../../types/AuthRequest"

export const payOrderController = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try{
        const userId = req.user?.id
        const orderId = Number(req.params.orderId)

        const order = await payOrder(userId as number , orderId)

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

    const order = await addToCart(
      userId as number,
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
        const cart = await getCart(userId as number)

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

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid courseId"
            })
        }

        const cart = await removeFromCart(courseId, userId as number )

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

        const cart = await checkout(userId as number)

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
        const orders = await getMyOrders(userId as number)

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

        if(Number.isNaN(orderId)){
            return res.status(400).json({
                message: "Invalid orderId"
            })
        }

        const order = await getOrderById(userId as number , orderId)

        return res.status(200).json({
            order
        })

    }catch(error){
        next(error)
    }
}