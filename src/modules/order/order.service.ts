import { prisma } from "../../config/prisma"
import { AppError } from "../../common/errors/AppErrors"
import { randomBytes, createHash } from "crypto";


type CourseLanguage = "FA" | "EN";

type GuestCheckoutInput = {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  courseIds: number[];
};

type PayOrderInput = {
  orderId: number;
  userId?: number;
  guestCheckoutToken?: string;
};

export const payOrder = async ({ orderId, userId, guestCheckoutToken}: PayOrderInput) => {

  const guestCheckoutTokenHash = guestCheckoutToken
    ? createHash("sha256")
        .update(guestCheckoutToken)
        .digest("hex")
    : undefined;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (userId !== undefined) {
      if (order.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }
    } else {
      if (
        !guestCheckoutTokenHash ||
        order.userId !== null ||
        order.guestCheckoutTokenHash !== guestCheckoutTokenHash
      ) {
        throw new AppError("Unauthorized", 403);
      }
    }

    if (order.status !== "PENDING") {
      throw new AppError("This order cannot be paid", 400);
    }

    if (order.items.length === 0) {
      throw new AppError("Order is empty", 400);
    }

    const courseIds = order.items.map((item) => item.courseId);

    const courses = await tx.course.findMany({
      where: {
        id: { in: courseIds },
      },
    });

    if (courses.length !== courseIds.length) {
      throw new AppError("Some courses are unavailable", 400);
    }

    for (const item of order.items) {
      const course = courses.find(
        (course) => course.id === item.courseId
      );

      if (!course || course.status !== "COMPLETED") {
        throw new AppError(
          "Some courses are no longer available",
          400
        );
      }

      if (course.price !== item.price) {
        throw new AppError(
          "Course prices have changed. Please checkout again.",
          409
        );
      }
    }

    const existingPurchases = await tx.purchasedCourse.findMany({
      where: {
        courseId: { in: courseIds },
        ...(userId !== undefined
          ? { userId }
          : {
              order: {
                is: {
                  guestPhone: order.guestPhone,
                },
              },
            }),
      },
    });

    if (existingPurchases.length > 0) {
      throw new AppError(
        "Some courses have already been purchased",
        409
      );
    }


    const claimedOrder = await tx.order.updateMany({
        where: {
            id: orderId,
            status: "PENDING",
            ...(userId !== undefined
            ? { userId }
            : { guestCheckoutTokenHash: guestCheckoutTokenHash! }),
        },
        data: {
            status: "PAID",
        },
    });

    if (claimedOrder.count !== 1) {
      throw new AppError(
        "Order has already been processed",
        409
      );
    }


    for (const item of order.items) {
      await tx.purchasedCourse.create({
        data: {
          userId: userId ?? null,
          orderId: userId === undefined ? orderId : null,
          courseId: item.courseId,
        },
      });

      await tx.course.update({
        where: {
          id: item.courseId,
        },
        data: {
          studentCount: {
            increment: 1,
          },
        },
      });
    }

    return tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });
  });
};



export const addToCart = async (userId: number, courseId: number) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  
  if (course.status !== "COMPLETED") {
    throw new AppError("Course is not available for purchase", 400);
  }

  
  const existingPurchased = await prisma.purchasedCourse.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingPurchased) {
    throw new AppError("Course already purchased", 409);
  }


  const pendingOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
    include: {
      items: true,
    },
  });

  if (pendingOrder) {
    const alreadyInCart = pendingOrder.items.some(
      (item) => item.courseId === courseId
    );

    if (alreadyInCart) {
      throw new AppError("Course already in cart", 409);
    }
  }

  
  const cart = await prisma.$transaction(async (tx) => {
    if (!pendingOrder) {
      return tx.order.create({
        data: {
          userId,
          totalPrice: course.price,
          status: "PENDING",
          items: {
            create: {
              courseId: course.id,
              price: course.price,
            },
          },
        },
        include: {
          items: true,
        },
      });
    }

    return tx.order.update({
      where: {
        id: pendingOrder.id,
      },
      data: {
        totalPrice: {
          increment: course.price,
        },
        items: {
          create: {
            courseId: course.id,
            price: course.price,
          },
        },
      },
      include: {
        items: true,
      },
    });
  });

  return cart;
};


export const getCart = async (
  userId: number,
  language: CourseLanguage
) => {
  const cart = await prisma.order.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
    include: {
      items: {
        include: {
          course: {
            include: {
              translations: {
                where: {
                  language,
                },
              },
              teacher: {
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    },
                    translations: {
                        where: {
                            language
                        }
                    }
                }
              },
              category: true,
            },
          },
        },
      },
    },
  });

  return cart;
};




export const removeFromCart = async ( courseId: number, userId: number ) => {
  const cart = await prisma.order.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
    include: {
      items: true,
    },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = cart.items.find(
    (item) => item.courseId === courseId
  );

  if (!cartItem) {
    throw new AppError("Course not found in cart", 404);
  }

  const updatedCart = await prisma.$transaction(async (tx) => {
    
    await tx.orderItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    
    const remainingItems = await tx.orderItem.findMany({
      where: {
        orderId: cart.id,
      },
    });

    
    if (remainingItems.length === 0) {
      await tx.order.delete({
        where: {
          id: cart.id,
        },
      });

      return null;
    }

    
    const totalPrice = remainingItems.reduce(
      (total, item) => total + item.price,
      0
    );

    
    return tx.order.update({
      where: {
        id: cart.id,
      },
      data: {
        totalPrice,
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });
  });

  return updatedCart;
};







export const checkout = async (userId: number) => {
  const cart = await prisma.order.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
    include: {
      items: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  if (cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  
  for (const item of cart.items) {
    if (item.course.status !== "COMPLETED") {
      throw new AppError(
        `Course ${item.courseId} is not available`,
        400
      );
    }
  }

  const purchasedCourses = await prisma.purchasedCourse.findMany({
    where: {
      userId,
      courseId: {
        in: cart.items.map((item) => item.courseId),
      },
    },
  });

  if (purchasedCourses.length > 0) {
    throw new AppError(
      "Some courses have already been purchased",
      409
    );
  }

  
  const updatedCart = await prisma.$transaction(async (tx) => {
    let totalPrice = 0;

    for (const item of cart.items) {
      const currentPrice = item.course.price;

      totalPrice += currentPrice;

      if (item.price !== currentPrice) {
        await tx.orderItem.update({
          where: {
            id: item.id,
          },
          data: {
            price: currentPrice,
          },
        });
      }
    }

    return tx.order.update({
      where: {
        id: cart.id,
      },
      data: {
        totalPrice,
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });
  });

  return updatedCart;
};


export const guestCheckout = async ({ guestName, guestPhone, guestEmail, courseIds}: GuestCheckoutInput) => {
  if (!courseIds || courseIds.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const uniqueCourseIds = [...new Set(courseIds)];

  if (uniqueCourseIds.length !== courseIds.length) {
    throw new AppError("Duplicate courses are not allowed", 400);
  }


  const guestCheckoutToken = randomBytes(32).toString("hex");


  const guestCheckoutTokenHash = createHash("sha256")
    .update(guestCheckoutToken)
    .digest("hex");

  const result = await prisma.$transaction(async (tx) => {
    const courses = await tx.course.findMany({
      where: {
        id: {
          in: uniqueCourseIds,
        },
      },
    });

    if (courses.length !== uniqueCourseIds.length) {
      throw new AppError("Some courses were not found", 404);
    }

    const unavailableCourse = courses.find(
      (course) => course.status !== "COMPLETED"
    );

    if (unavailableCourse) {
      throw new AppError(
        `Course ${unavailableCourse.id} is not available`,
        400
      );
    }

    const purchasedCourses = await tx.purchasedCourse.findMany({
      where: {
        courseId: {
          in: uniqueCourseIds,
        },
        order: {
          is: {
            guestPhone,
          },
        },
      },
    });

    if (purchasedCourses.length > 0) {
      throw new AppError(
        "Some courses have already been purchased",
        409
      );
    }

    const totalPrice = courses.reduce(
      (total, course) => total + course.price,
      0
    );

    const order = await tx.order.create({
      data: {
        totalPrice,
        status: "PENDING",
        guestName,
        guestPhone,
        guestEmail: guestEmail || null,
        guestCheckoutTokenHash,

        items: {
          create: courses.map((course) => ({
            courseId: course.id,
            price: course.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    return order;
  });

  return {
    order: result,
    guestCheckoutToken,
  };
};



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