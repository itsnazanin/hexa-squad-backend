import { prisma } from "../../config/prisma"
import { AppError } from "../../common/errors/AppErrors"


export const payOrder = async (userId: number , orderId: number) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            items: true
        }
    })
    
    if(!order){
        throw new AppError(
            "Order not found",
            404
        )
    }

    if(order.userId !== userId){
        throw new AppError(
            "Unauthorized",
            403
        )
    }

    if (order.status !== "PENDING"){
        throw new AppError(
            "this order can not be paid",
            400
        )
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
            where: {
                id: orderId
            },
            data: {
                status: "PAID"
            }
        })

        for (const item of order.items){
            await tx.purchasedCourse.create({
                data: {
                    userId,
                    courseId: item.courseId
                }
            })

            await tx.course.update({
                where: {
                    id: item.courseId
                },
                data: {
                    studentCount: {
                        increment: 1
                    }
                }
            })  
        }

        return updatedOrder

    })

    return result
}



export const addToCart = async (userId: number , courseId: number) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if (!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    const existingPurchased = await prisma.purchasedCourse.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if (existingPurchased){
        throw new AppError(
            "Course already purchased",
            409
        )
    }

    let pendingOrder = await prisma.order.findFirst({
        where: {
            userId, 
            status: "PENDING"
        },
        include: {
            items: true
        }
    })

    if(!pendingOrder){
        pendingOrder = await prisma.order.create({
            data: {
                userId,
                totalPrice: course.price,
                status: "PENDING",
                items: {
                    create: {
                        courseId: course.id,
                        price: course.price
                    }
                }
            },
            include:{
                items: true
            }
        })

        return pendingOrder
    }

    const alreadyInCart = pendingOrder.items.some(
        (item) => item.courseId === courseId
    )

    if(alreadyInCart){
        throw new AppError(
            "course already in cart",
            409
        )
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: pendingOrder.id
        },
        data: {
            totalPrice: {
                increment: course.price
            },
            items: {
                create: {
                    courseId: course.id,
                    price: course.price
                }
            }
        },
        include: {
            items: true
        }
    })

    return updatedOrder
}




export const getCart = async (userId: number) => {
    const cart = await prisma.order.findFirst({
        where: {
            userId,
            status: "PENDING"
        },
        include: {
            items: {
                include: {
                    course: {
                        include: {
                            teacher: true,
                            category: true
                            }
                        }
                }
            }
         }
    })

    return cart
}



export const removeFromCart = async (courseId: number , userId: number) => {
    const cart = await prisma.order.findFirst({
        where: {
            userId,
            status: "PENDING"
        },
        include: {
            items: true
        }
    })


    if(!cart){
        throw new AppError(
            "Cart not found",
            404
        )
    }
    
    const cartItem = cart.items.find(
        (item) => item.courseId === courseId
    )

    if(!cartItem){
        throw new AppError(
            "Course not found in cart",
            404
        )
    }

    const updatedCart = await prisma.order.update({
        where: {
            id: cart.id
        },
        data: {
            totalPrice: {
                decrement: cartItem.price
            },
            items: {
                delete: {
                    id: cartItem.id
                }
            }
        },
        include: {
            items: {
                include: {
                    course: true
                }
            }
        }
    })

    return updatedCart
}





export const checkout = async (userId: number) => {

    const cart = await prisma.order.findFirst({
        where: {
            userId,
            status: "PENDING"
        },
        include: {
            items: {
                include: {
                    course: true
                }
            }
        }
    })

    if(!cart){
        throw new AppError(
            "Cart not found",
            404
        )
    }

    if(cart.items.length === 0){
        throw new AppError(
            "Cart is empty",
            400
        )
    }

    return cart
}




export const getMyOrders = async (userId: number) => {

    const orders = await prisma.order.findMany({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    course: true
                }
            }
        },  
        orderBy: {
            createdAt: "desc"
        }
    }) 

    return orders

}


export const getOrderById = async (userId: number , orderId: number) => {
    
    const order = await prisma.order.findFirst({
        where: {
            userId,
            id: orderId
        },
        include: {
            items: {
                include: {
                    course: true
                }
            }
        }
    })


    if(!order){
        throw new AppError(
            "Order not found",
            404
        )
    }

    return order
}