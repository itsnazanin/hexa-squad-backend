import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Language,
  Role,
  CourseStatus,
  ReactionType,
  OrderStatus,
} from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type Translation = {
  title: string;
  shortDescription: string;
  description: string;
};

type CourseSeed = {
  id: number;
  categoryId: number;
  courseTime: number;
  price: number;
  thumbnail: string;

  fa: Translation;
  en: Translation;
};

type BlogSeed = {
  id: number;
  coverImage: string;
  blogImage: string;
  author: string;
  authorImage: string

  fa: BlogTranslationSeed;
  en: BlogTranslationSeed;
};

type BlogTranslationSeed = {
  title: string
  shortDescription: string
  description: string
  content: string
}

const CATEGORY_IDS = {
  PROGRAMMING: 1,
  DATA_ANALYSIS: 2,
  NETWORK_SECURITY: 3,
  GAME: 4,
} as const;


const categories = [
  {
    id: CATEGORY_IDS.PROGRAMMING,
    fa: "برنامه‌نویسی",
    en: "Programming",
  },
  {
    id: CATEGORY_IDS.DATA_ANALYSIS,
    fa: "تحلیل داده",
    en: "Data Analysis",
  },
  {
    id: CATEGORY_IDS.NETWORK_SECURITY,
    fa: "امنیت شبکه",
    en: "Network Security",
  },
  {
    id: CATEGORY_IDS.GAME,
    fa: "بازی‌سازی",
    en: "Game Development",
  },
];



const courses: CourseSeed[] = [
  {
    id: 10001,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 18,
    price: 850000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/html.jpg",

    fa: {
      title: "آموزش HTML و CSS",
      shortDescription: "یادگیری اصول طراحی صفحات وب از پایه",
      description:
        "در این دوره با مفاهیم پایه طراحی وب و نحوه ساخت صفحات اینترنتی آشنا می‌شوید. ابتدا یاد می‌گیرید چگونه با استفاده از HTML ساختار اصلی صفحات وب را ایجاد کنید و بخش‌های مختلفی مانند متن‌ها، تصاویر، لینک‌ها و فرم‌ها را بسازید. سپس با CSS نحوه طراحی ظاهر صفحات، انتخاب رنگ‌ها، فونت‌ها و ایجاد چیدمان‌های زیبا را فرا می‌گیرید. در ادامه با Flexbox و Grid برای طراحی ساختارهای حرفه‌ای‌تر آشنا می‌شوید. همچنین نحوه طراحی واکنش‌گرا را یاد می‌گیرید تا وب‌سایت شما در موبایل، تبلت و دسکتاپ به‌درستی نمایش داده شود. در پایان دوره می‌توانید صفحات وب استاندارد و جذابی را از صفر طراحی و پیاده‌سازی کنید.",
    },

    en: {
      title: "HTML & CSS Course",
      shortDescription: "Learn the fundamentals of modern web page design.",
      description:
        "In this course, you will be introduced to the fundamental concepts of web design and the process of building web pages. You will begin by learning how to use HTML to establish the core structure of web pages, incorporating elements such as text, images, links, and forms. Next, you will explore CSS to design the visual appearance of your pages—selecting colors and fonts, and creating attractive layouts. You will then move on to using Flexbox and Grid to develop more professional structures. Additionally, you will learn responsive design techniques, ensuring your website displays correctly across mobile devices, tablets, and desktops. By the end of the course, you will be able to design and implement standard, engaging web pages from scratch.",
    },
  },

  {
    id: 10002,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 24,
    price: 1100000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/js-pics.jpg",

    fa: {
      title: "آموزش JavaScript",
      shortDescription: "یادگیری کامل JavaScript از پایه تا سطح کاربردی",
      description:
        "در این دوره زبان برنامه‌نویسی JavaScript را از سطح مقدماتی تا مفاهیم پیشرفته یاد می‌گیرید و با کاربرد آن در توسعه وب آشنا می‌شوید. ابتدا مفاهیمی مانند متغیرها، انواع داده، شرط‌ها، حلقه‌ها و توابع را آموزش می‌بینید و سپس کار با آرایه‌ها و آبجکت‌ها را فرا می‌گیرید. در ادامه با مفاهیم مهمی مانند Scope، Closure و Hoisting آشنا می‌شوید و یاد می‌گیرید چگونه با استفاده از DOM صفحات وب تعاملی ایجاد کنید. همچنین نحوه مدیریت رویدادها و ارتباط با APIها را آموزش می‌بینید. در بخش‌های پیشرفته‌تر، مفاهیم Promise، Async و Await را یاد می‌گیرید تا بتوانید درخواست‌های غیرهم‌زمان را مدیریت کنید. در پایان دوره توانایی پیاده‌سازی برنامه‌ها و قابلیت‌های پویا در وب‌سایت‌ها را خواهید داشت.",
    },

    en: {
      title: "JavaScript Course",
      shortDescription:
        "Learn JavaScript from fundamentals to practical development.",
      description:
        "In this course, you will learn the JavaScript programming language—from introductory levels to advanced concepts—and explore its application in web development. You will begin by covering fundamentals such as variables, data types, conditionals, loops, and functions, followed by working with arrays and objects. You will then delve into key concepts like scope, closures, and hoisting, and learn how to create interactive web pages using the DOM. Additionally, you will learn how to handle events and interact with APIs. In the more advanced sections, you will master Promises, `async`, and `await` to manage asynchronous requests. By the end of the course, you will be equipped to implement dynamic applications and features within websites.",
    },
  },

  {
    id: 10003,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 30,
    price: 1450000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/react.jpg",

    fa: {
      title: "آموزش React",
      shortDescription: "ساخت رابط‌های کاربری مدرن با React",
      description:
        "در این دوره با کتابخانه قدرتمند React آشنا می‌شوید و یاد می‌گیرید چگونه رابط‌های کاربری مدرن و تعاملی برای وب‌سایت‌ها طراحی و پیاده‌سازی کنید. ابتدا مفاهیم پایه React و نحوه ایجاد پروژه را آموزش می‌بینید و سپس با Componentها و نحوه تقسیم رابط کاربری به بخش‌های مستقل و قابل استفاده مجدد آشنا می‌شوید. در ادامه کار با Props، State و مدیریت رویدادها را فرا می‌گیرید و یاد می‌گیرید چگونه وضعیت بخش‌های مختلف برنامه را کنترل کنید. همچنین با Hookهای کاربردی مانند useState، useEffect و useContext آشنا می‌شوید. در بخش‌های بعدی نحوه مدیریت مسیرها، دریافت اطلاعات از API و مدیریت داده‌های سمت کاربر را یاد می‌گیرید. در پایان دوره می‌توانید با استفاده از React وب‌اپلیکیشن‌های پویا، استاندارد و کاربردی توسعه دهید.",
    },

    en: {
      title: "React Course",
      shortDescription: "Build modern user interfaces with React.",
      description:
        "In this course, you will be introduced to the powerful React library and learn how to design and implement modern, interactive user interfaces for websites. You will begin by covering the fundamental concepts of React and how to set up a project, followed by an exploration of components—learning how to break down a user interface into independent, reusable parts. You will then master working with props, state, and event handling, learning how to manage the state across different sections of an application. Additionally, you will become familiar with essential React hooks such as `useState`, `useEffect`, and `useContext`. In subsequent sections, you will learn how to handle routing, fetch data from APIs, and manage client-side data. By the end of the course, you will be able to develop dynamic, professional, and functional web applications using React.",
    },
  },

  {
    id: 10004,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 32,
    price: 1650000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/next.jpg",

    fa: {
      title: "آموزش Next.js",
      shortDescription: "ساخت پروژه‌های حرفه‌ای با Next.js",
      description:
        "در این دوره با فریم‌ورک Next.js آشنا می‌شوید و یاد می‌گیرید چگونه برنامه‌های وب مدرن و بهینه را بر پایه React توسعه دهید. ابتدا ساختار پروژه‌های Next.js و سیستم مسیریابی App Router را بررسی می‌کنید و با نحوه ایجاد صفحات و Layoutها آشنا می‌شوید. سپس تفاوت Server Components و Client Components و کاربرد هرکدام را فرا می‌گیرید. در ادامه با روش‌های دریافت اطلاعات، مدیریت درخواست‌ها و ایجاد Route Handlerها آشنا خواهید شد. همچنین مفاهیمی مانند Dynamic Routing، Loading، Error Handling و بهینه‌سازی تصاویر را آموزش می‌بینید. در بخش‌های پیشرفته‌تر با مدیریت Metadata، احراز هویت و روش‌های مختلف رندرینگ آشنا می‌شوید. در پایان می‌توانید وب‌اپلیکیشن‌های مدرن، سریع و قابل توسعه با Next.js طراحی و پیاده‌سازی کنید.",
    },

    en: {
      title: "Next.js Course",
      shortDescription: "Build professional web applications with Next.js.",
      description:
        "In this course, you will be introduced to the Next.js framework and learn how to develop modern, optimized web applications based on React. You will begin by exploring the structure of Next.js projects and the App Router system, learning how to create pages and layouts. Next, you will understand the differences between Server Components and Client Components, as well as the use cases for each. You will then learn about data fetching, request handling, and the creation of Route Handlers. The course also covers concepts such as Dynamic Routing, loading states, error handling, and image optimization. In more advanced sections, you will explore metadata management, authentication, and various rendering strategies. By the end of the course, you will be able to design and implement modern, fast, and scalable web applications using Next.js.",
    },
  },

  {
    id: 10005,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 28,
    price: 1550000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/ts-pics.jpg",

    fa: {
      title: "آموزش TypeScript",
      shortDescription: "یادگیری TypeScript برای پروژه‌های حرفه‌ای",
      description:
        "در این دوره با زبان TypeScript و نقش آن در توسعه نرم‌افزارهای مدرن آشنا می‌شوید. ابتدا تفاوت‌های TypeScript و JavaScript را بررسی می‌کنید و یاد می‌گیرید چگونه با استفاده از سیستم نوع‌دهی، خطاهای احتمالی کد را پیش از اجرا شناسایی کنید. سپس مفاهیمی مانند Type Annotation، Interface و Type Alias را آموزش می‌بینید و با نحوه تعریف ساختار داده‌ها و انواع مختلف متغیرها آشنا می‌شوید. در ادامه موضوعات پیشرفته‌تری مانند Generics، Union Types و Type Narrowing را یاد می‌گیرید. همچنین نحوه استفاده از TypeScript در پروژه‌های React و Node.js را فرا می‌گیرید. در پایان دوره می‌توانید کدهایی ساختارمندتر، قابل‌نگهداری‌تر و مطمئن‌تر برای پروژه‌های حرفه‌ای توسعه دهید.",
    },

    en: {
      title: "TypeScript Course",
      shortDescription: "Learn TypeScript for professional applications.",
      description:
        "In this course, you will explore the TypeScript language and its role in modern software development. You will begin by examining the differences between TypeScript and JavaScript, learning how to utilize its type system to identify potential code errors before execution. Next, you will cover concepts such as Type Annotations, Interfaces, and Type Aliases, learning how to define data structures and various variable types. You will then progress to more advanced topics, including Generics, Union Types, and Type Narrowing. Additionally, you will learn how to integrate TypeScript into React and Node.js projects. By the end of the course, you will be equipped to develop more structured, maintainable, and reliable code for professional projects.",
    },
  },

  {
    id: 10006,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 34,
    price: 1750000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/node.jpg",

    fa: {
      title: "آموزش Node.js",
      shortDescription: "ساخت Backend با Node.js",
      description:
        "در این دوره با Node.js و کاربرد آن برای اجرای JavaScript در سمت سرور آشنا می‌شوید. ابتدا معماری Node.js، محیط اجرای آن و تفاوت برنامه‌نویسی سمت سرور و سمت کاربر را بررسی می‌کنید. سپس با ماژول‌ها، مدیریت پکیج‌ها و ابزار npm آشنا خواهید شد. در ادامه نحوه کار با فایل‌ها، مدیریت درخواست‌های شبکه و ایجاد یک سرور ساده را فرا می‌گیرید. همچنین با مفاهیم مهمی مانند Event Loop، برنامه‌نویسی غیرهم‌زمان، Promise و Async/Await آشنا می‌شوید. در بخش‌های عملی با استفاده از Node.js و فریم‌ورک Express API طراحی می‌کنید و با پایگاه داده ارتباط برقرار خواهید کرد. در پایان می‌توانید از JavaScript برای توسعه برنامه‌ها و سرویس‌های سمت سرور استفاده کنید.",
    },

    en: {
      title: "Node.js Course",
      shortDescription: "Build backend applications with Node.js.",
      description:
        "In this course, you will learn about Node.js and its application to run JavaScript on the server side. First, you will examine the architecture of Node.js, its execution environment and the difference between server-side and user-side programming. Then you will get familiar with modules, package management and npm tools. Next, you will learn how to work with files, manage network requests and create a simple server. You will also learn important concepts such as Event Loop, asynchronous programming, Promise and Async/Await. In the practical parts, you will design and interact with the database using Node.js and the Express API framework. Finally, you can use JavaScript to develop server-side applications and services.",
    },
  },

  {
    id: 10007,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 36,
    price: 1850000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/express.jpg",

    fa: {
      title: "آموزش Express.js",
      shortDescription: "ساخت APIهای حرفه‌ای با Express",
      description:
        "در این دوره با Express.js به‌عنوان یکی از فریم‌ورک‌های محبوب Node.js برای توسعه سمت سرور آشنا می‌شوید. ابتدا ساختار پروژه‌های بک‌اند و نحوه راه‌اندازی یک سرور با Express را یاد می‌گیرید. سپس با مفاهیمی مانند Routing و Middleware آشنا می‌شوید و نحوه دریافت درخواست‌ها و ارسال پاسخ‌های مناسب را فرا می‌گیرید. در ادامه یاد می‌گیرید چگونه APIهای استاندارد طراحی کنید و عملیات مختلف ایجاد، دریافت، ویرایش و حذف اطلاعات را پیاده‌سازی کنید. همچنین با نحوه اتصال به پایگاه داده، مدیریت خطاها و پیاده‌سازی احراز هویت کاربران آشنا خواهید شد. در طول دوره با انجام تمرین‌ها و پروژه‌های عملی، مهارت لازم برای توسعه بک‌اند وب‌سایت‌ها و اپلیکیشن‌های واقعی را کسب می‌کنید.",
    },

    en: {
      title: "Express.js Course",
      shortDescription: "Build professional REST APIs with Express.",
      description:
        "In this course, you will explore Express.js, a popular Node.js framework for server-side development. You will begin by learning the structure of backend projects and how to set up a server using Express. Next, you will cover concepts such as routing and middleware, learning how to handle incoming requests and send appropriate responses. You will then learn to design standard APIs and implement CRUD (Create, Read, Update, Delete) operations. Additionally, the course covers connecting to databases, error handling, and implementing user authentication. Through practical exercises and hands-on projects, you will gain the skills necessary to develop the backend for real-world websites and applications.",
    },
  },

  {
    id: 10008,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 40,
    price: 2100000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/postgresql.jpg",

    fa: {
      title: "آموزش PostgreSQL",
      shortDescription: "یادگیری دیتابیس PostgreSQL",
      description:
        "در این دوره با PostgreSQL به‌عنوان یکی از قدرتمندترین سیستم‌های مدیریت پایگاه داده رابطه‌ای آشنا می‌شوید و یاد می‌گیرید چگونه اطلاعات پروژه‌های نرم‌افزاری را به شکل اصولی ذخیره و مدیریت کنید. ابتدا با مفاهیم پایگاه داده، جداول، سطرها و ستون‌ها آشنا می‌شوید و سپس نحوه ایجاد دیتابیس و طراحی ساختار جداول را فرا می‌گیرید. در ادامه دستورات SQL برای ثبت، دریافت، ویرایش و حذف اطلاعات را آموزش می‌بینید. همچنین با مفاهیمی مانند کلید اصلی، کلید خارجی، ارتباط میان جداول و انواع داده آشنا خواهید شد. در بخش‌های پیشرفته‌تر، کار با JOIN، Subquery، Index و Transaction را یاد می‌گیرید. در پایان دوره می‌توانید پایگاه داده‌های رابطه‌ای طراحی کرده و آن‌ها را در پروژه‌های واقعی به کار بگیرید.",
    },

    en: {
      title: "PostgreSQL Course",
      shortDescription: "Learn PostgreSQL and relational database design.",
      description:
        "In this course, you will be introduced to PostgreSQL—one of the most powerful relational database management systems—and learn how to systematically store and manage data for software projects. You will begin by exploring fundamental database concepts, such as tables, rows, and columns, before moving on to creating databases and designing table structures. You will then learn SQL commands for inserting, retrieving, updating, and deleting data. Additionally, you will become familiar with concepts including primary keys, foreign keys, relationships between tables, and data types. In the more advanced sections, you will learn to work with JOINs, subqueries, indexes, and transactions. By the end of the course, you will be able to design relational databases and implement them in real-world projects.",
    },
  },

  {
    id: 10009,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 38,
    price: 2200000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/prisma.jpeg",

    fa: {
      title: "آموزش Prisma",
      shortDescription: "کار با Prisma ORM در پروژه‌های واقعی",
      description:
        "در این دوره با Prisma به‌عنوان یک ORM مدرن برای مدیریت و ارتباط با پایگاه داده در پروژه‌های بک‌اند آشنا می‌شوید. ابتدا مفاهیم ORM و نحوه عملکرد Prisma را بررسی می‌کنید و یاد می‌گیرید چگونه آن را در پروژه‌های Node.js راه‌اندازی و پیکربندی کنید. سپس با نوشتن مدل‌ها در فایل Schema و تعریف ساختار جداول و ارتباط میان داده‌ها آشنا می‌شوید. در ادامه نحوه استفاده از Migration برای مدیریت تغییرات پایگاه داده و کار با Prisma Client را فرا می‌گیرید. همچنین عملیات ایجاد، دریافت، ویرایش و حذف اطلاعات را به‌صورت عملی پیاده‌سازی می‌کنید. در بخش‌های پیشرفته‌تر با روابط میان مدل‌ها، Queryهای پیچیده و مدیریت تراکنش‌ها آشنا خواهید شد. در پایان دوره می‌توانید از Prisma برای مدیریت حرفه‌ای پایگاه داده در پروژه‌های واقعی استفاده کنید.",
    },

    en: {
      title: "Prisma ORM Course",
      shortDescription: "Work with Prisma ORM in real-world projects.",
      description:
        "In this course, you will explore Prisma—a modern ORM designed for database management and interaction within backend projects. You will begin by examining the concepts behind ORMs and how Prisma functions, learning how to set up and configure it for Node.js projects. You will then learn to define data models within a schema file, establishing table structures and the relationships between data entities. Furthermore, you will discover how to use migrations to manage database changes and work with the Prisma Client. You will also gain hands-on experience in performing CRUD (Create, Read, Update, and Delete) operations. In the more advanced sections, you will delve into modeling relationships, executing complex queries, and managing transactions. By the end of the course, you will be equipped to use Prisma for professional-grade database management in real-world projects.",
    },
  },

  {
    id: 10010,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 42,
    price: 2500000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/fullstack.jpg",

    fa: {
      title: "آموزش Full Stack",
      shortDescription: "ساخت پروژه کامل Full Stack",
      description:
        "در این دوره با فرایند کامل توسعه یک وب‌سایت یا وب‌اپلیکیشن از ابتدا تا انتها آشنا می‌شوید و مهارت‌های موردنیاز برای فعالیت به‌عنوان توسعه‌دهنده Full Stack را کسب می‌کنید. ابتدا با اصول طراحی رابط کاربری و توسعه بخش فرانت‌اند با استفاده از HTML، CSS، JavaScript و React آشنا می‌شوید. سپس نحوه طراحی و پیاده‌سازی بک‌اند با Node.js و Express را آموزش می‌بینید. در ادامه یاد می‌گیرید چگونه پایگاه داده طراحی کنید و با استفاده از ابزارهایی مانند Prisma اطلاعات کاربران و برنامه را مدیریت کنید. همچنین نحوه ایجاد و اتصال APIها، پیاده‌سازی سیستم ثبت‌نام و ورود کاربران و مدیریت دسترسی‌ها را فرا می‌گیرید. در طول دوره بخش‌های مختلف یک پروژه واقعی را توسعه می‌دهید و ارتباط میان فرانت‌اند، بک‌اند و پایگاه داده را به‌صورت عملی تجربه می‌کنید. در پایان می‌توانید یک وب‌سایت کامل و کاربردی را از صفر تا مرحله اجرا توسعه دهید.",
    },

    en: {
      title: "Full Stack Development",
      shortDescription: "Build a complete full-stack application.",
      description:
        "In this course, you will explore the complete development lifecycle of a website or web application—from start to finish—and acquire the skills necessary to work as a Full Stack developer. You will begin by learning the fundamentals of user interface (UI) design and front-end development using HTML, CSS, JavaScript, and React. Next, you will learn how to design and implement the back-end using Node.js and Express. You will also learn how to design databases and manage application and user data using tools like Prisma. Furthermore, you will cover the creation and integration of APIs, the implementation of user registration and login systems, and access control management. Throughout the course, you will build various components of a real-world project, gaining hands-on experience with the interactions between the front-end, back-end, and database. By the end, you will be able to develop a fully functional website from scratch, taking it all the way to deployment.",
    },
  },

  {
    id: 10011,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 20,
    price: 900000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/git.png",

    fa: {
      title: "Git و GitHub",
      shortDescription: "یادگیری Git و مدیریت پروژه با GitHub",
      description:
        "در این دوره با Git و GitHub به‌عنوان ابزارهای مهم مدیریت نسخه و همکاری در پروژه‌های نرم‌افزاری آشنا می‌شوید. ابتدا مفهوم Version Control و اهمیت ثبت تغییرات کد در فرایند توسعه نرم‌افزار را یاد می‌گیرید. سپس نحوه نصب Git، ایجاد Repository و اجرای دستورات پایه مانند Commit، Add و Status را آموزش می‌بینید. در ادامه با مفهوم Branch و روش ایجاد شاخه‌های مختلف برای توسعه قابلیت‌های جدید آشنا می‌شوید. همچنین نحوه اتصال پروژه محلی به GitHub، ارسال تغییرات با Push و دریافت تغییرات با Pull را فرا می‌گیرید. در بخش‌های عملی با Merge، حل Conflict و کار گروهی روی پروژه‌های مشترک آشنا خواهید شد. در پایان می‌توانید پروژه‌های خود را به شکل اصولی مدیریت کرده و با سایر توسعه‌دهندگان همکاری کنید.",
    },

    en: {
      title: "Git & GitHub",
      shortDescription: "Learn Git and professional GitHub workflows.",
      description:
        "In this course, you will learn about Git and GitHub—essential tools for version control and collaboration in software projects. You will begin by understanding the concept of version control and the importance of tracking code changes throughout the software development process. Next, you will learn how to install Git, create repositories, and execute fundamental commands such as `commit`, `add`, and `status`. You will then explore the concept of branching and how to create separate branches to develop new features. Furthermore, you will learn how to connect your local project to GitHub, push your changes, and pull updates from the repository. Through practical exercises, you will gain experience with merging, resolving conflicts, and collaborating with others on shared projects. By the end of the course, you will be able to manage your projects systematically and collaborate effectively with other developers.",
    },
  },

  {
    id: 10012,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 25,
    price: 1250000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/tailwind.jpg",

    fa: {
      title: "آموزش Tailwind CSS",
      shortDescription: "طراحی سریع و مدرن با Tailwind CSS",
      description:
        "در این دوره با Tailwind CSS آشنا می‌شوید و یاد می‌گیرید چگونه بدون نوشتن حجم زیادی از کدهای CSS اختصاصی، رابط‌های کاربری زیبا و مدرن طراحی کنید. ابتدا مفهوم Utility-First CSS و نحوه استفاده از کلاس‌های آماده Tailwind را بررسی می‌کنید. سپس با ابزارهای مربوط به رنگ‌بندی، فاصله‌گذاری، اندازه‌ها، فونت‌ها و حاشیه‌ها آشنا خواهید شد. در ادامه نحوه ایجاد Layoutهای مختلف با Flexbox و Grid را فرا می‌گیرید. همچنین طراحی واکنش‌گرا، مدیریت حالت‌های Hover و Focus و استفاده از کلاس‌های شرطی را آموزش می‌بینید. در بخش عملی، کامپوننت‌ها و صفحات مختلف یک وب‌سایت را با Tailwind CSS طراحی می‌کنید. در پایان می‌توانید رابط‌های کاربری منظم، واکنش‌گرا و قابل توسعه ایجاد کنید.",
    },

    en: {
      title: "Tailwind CSS",
      shortDescription: "Build modern interfaces quickly with Tailwind CSS.",
      description:
        "In this course, you will be introduced to Tailwind CSS and learn how to design beautiful, modern user interfaces without writing large amounts of custom CSS code. You will begin by exploring the utility-first CSS concept and how to utilize Tailwind’s pre-built classes. Next, you will become familiar with tools for handling colors, spacing, sizing, typography, and borders. You will then learn how to create various layouts using Flexbox and Grid. The course also covers responsive design, managing hover and focus states, and implementing conditional classes. In the practical section, you will design various website components and pages using Tailwind CSS. By the end, you will be able to build well-structured, responsive, and scalable user interfaces.",
    },
  },

  {
    id: 10013,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 22,
    price: 1000000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/restapi.jpeg",

    fa: {
      title: "آموزش REST API",
      shortDescription: "ساخت APIهای استاندارد و قابل توسعه",
      description:
        "در این دوره با معماری REST و نحوه طراحی و پیاده‌سازی API برای ارتباط میان بخش‌های مختلف یک نرم‌افزار آشنا می‌شوید. ابتدا مفهوم API و نقش آن در ارتباط میان فرانت‌اند و بک‌اند را بررسی می‌کنید. سپس با متدهای HTTP مانند GET، POST، PUT، PATCH و DELETE و کاربرد هرکدام آشنا خواهید شد. در ادامه نحوه طراحی Endpointهای استاندارد، مدیریت درخواست‌ها و ساختار پاسخ‌های سرور را فرا می‌گیرید. همچنین با کدهای وضعیت HTTP، انتقال داده با JSON و اصول اعتبارسنجی اطلاعات آشنا می‌شوید. در بخش عملی، با استفاده از Node.js و Express یک REST API طراحی کرده و عملیات مختلف مدیریت اطلاعات را پیاده‌سازی می‌کنید. در پایان می‌توانید APIهای ساختارمند و قابل‌استفاده برای پروژه‌های واقعی توسعه دهید.",
    },

    en: {
      title: "REST API Development",
      shortDescription: "Design scalable and maintainable REST APIs.",
      description:
        "In this course, you will learn about REST architecture and how to design and implement APIs to facilitate communication between different components of a software application. You will begin by exploring the concept of an API and its role in connecting the front-end and back-end. Next, you will become familiar with HTTP methods—such as GET, POST, PUT, PATCH, and DELETE—and their specific use cases. You will then learn how to design standard endpoints, handle requests, and structure server responses. Additionally, you will cover HTTP status codes, data transfer using JSON, and the principles of data validation. In the practical section, you will use Node.js and Express to design a REST API and implement various data management operations. By the end of the course, you will be able to develop structured, functional APIs suitable for real-world projects.",
    },
  },

  {
    id: 10014,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 27,
    price: 1300000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/backend.jpg",

    fa: {
      title: "احراز هویت در Backend",
      shortDescription: "ساخت سیستم Authentication حرفه‌ای",
      description:
        "در این دوره با مفاهیم احراز هویت و مدیریت دسترسی کاربران در برنامه‌های بک‌اند آشنا می‌شوید و یاد می‌گیرید چگونه سیستم ورود و ثبت‌نام امن طراحی کنید. ابتدا تفاوت میان Authentication و Authorization را بررسی می‌کنید و با روش‌های شناسایی کاربران آشنا می‌شوید. سپس نحوه پیاده‌سازی ثبت‌نام، ورود، خروج و مدیریت اطلاعات حساب کاربری را آموزش می‌بینید. در ادامه با روش‌های رمزنگاری و هش کردن رمز عبور و استفاده از JWT برای مدیریت نشست کاربران آشنا خواهید شد. همچنین نحوه پیاده‌سازی سیستم‌های تأیید هویت با کد یک‌بارمصرف، مدیریت انقضای توکن و بازیابی رمز عبور را فرا می‌گیرید. در بخش عملی، یک سیستم احراز هویت کامل با کنترل دسترسی نقش‌های مختلف پیاده‌سازی می‌کنید. در پایان می‌توانید سیستم ورود و ثبت‌نام استانداردی برای پروژه‌های واقعی توسعه دهید.",
    },

    en: {
      title: "Backend Authentication",
      shortDescription: "Build a professional authentication system.",
      description:
        "In this course, you will explore the concepts of user authentication and access management within backend applications, learning how to design secure login and registration systems. You will begin by examining the distinction between authentication and authorization, and discover various methods for identifying users. Next, you will learn how to implement registration, login, and logout functionalities, as well as how to manage user account information. You will also cover password hashing and encryption techniques, along with the use of JWT (JSON Web Tokens) for managing user sessions. Furthermore, you will learn to implement identity verification systems using one-time codes, manage token expiration, and handle password recovery. In the practical component, you will build a comprehensive authentication system that includes role-based access control. By the end of the course, you will be equipped to develop standard login and registration systems for real-world projects.",
    },
  },

  {
    id: 10015,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 26,
    price: 1350000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/apisecret.jpg",

    fa: {
      title: "امنیت API",
      shortDescription: "اصول مهم امنیت APIهای وب",
      description:
        "در این دوره با rate limiting، CORS، Helmet، validation و روش‌های محافظت از API آشنا می‌شوید.",
    },

    en: {
      title: "API Security",
      shortDescription: "Learn essential web API security practices.",
      description:
        "Learn rate limiting, CORS, Helmet, validation and practical techniques for securing APIs.",
    },
  },

  {
    id: 10016,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 35,
    price: 1900000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/website.jpg",

    fa: {
      title: "ساخت فروشگاه اینترنتی",
      shortDescription: "ساخت یک فروشگاه آنلاین واقعی",
      description:
        "در این دوره به‌صورت عملی با مراحل طراحی و توسعه یک فروشگاه اینترنتی آشنا می‌شوید و یاد می‌گیرید چگونه یک وب‌سایت فروشگاهی کامل ایجاد کنید. ابتدا ساختار کلی فروشگاه و بخش‌های موردنیاز آن مانند صفحه اصلی، فهرست محصولات و صفحه جزئیات محصول را طراحی می‌کنید. سپس نحوه پیاده‌سازی رابط کاربری واکنش‌گرا و ایجاد تجربه خرید مناسب برای کاربران را فرا می‌گیرید. در ادامه سیستم مدیریت محصولات، دسته‌بندی‌ها، جست‌وجو و فیلتر کردن اطلاعات را توسعه می‌دهید. همچنین با پیاده‌سازی سبد خرید، مدیریت حساب کاربران و فرایند ثبت سفارش آشنا می‌شوید. در بخش بک‌اند، نحوه طراحی API، اتصال به پایگاه داده و مدیریت اطلاعات فروشگاه را آموزش می‌بینید. در پایان یک فروشگاه اینترنتی کاربردی را توسعه می‌دهید که قابلیت گسترش و اتصال به امکانات بیشتر را داشته باشد.",
    },

    en: {
      title: "E-commerce Development",
      shortDescription: "Build a complete online store.",
      description:
        "In this course, you will gain practical experience with the design and development stages of an online store, learning how to build a fully functional e-commerce website. You will begin by designing the store's overall structure and essential components, such as the homepage, product listings, and product detail pages. Next, you will learn to implement a responsive user interface and create an optimal shopping experience for users. You will then develop systems for product management, categorization, search, and data filtering. Additionally, you will learn how to implement a shopping cart, manage user accounts, and handle the order placement process. On the back-end, you will cover API design, database connectivity, and the management of store data. By the end of the course, you will have developed a functional online store that is scalable and capable of integrating with further features.",
    },
  },

  {
    id: 10017,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 29,
    price: 1500000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/reactquery.jpg",

    fa: {
      title: "React Query",
      shortDescription: "مدیریت حرفه‌ای server state در React",
      description:
        "در این دوره با کتابخانه TanStack Query که با نام React Query نیز شناخته می‌شود آشنا می‌شوید و یاد می‌گیرید چگونه مدیریت داده‌های دریافتی از سرور را در پروژه‌های React ساده‌تر و اصولی‌تر انجام دهید. ابتدا مفهوم Server State و تفاوت آن با Client State را بررسی می‌کنید. سپس نحوه راه‌اندازی کتابخانه و استفاده از Hookهایی مانند useQuery برای دریافت اطلاعات از API را فرا می‌گیرید. در ادامه با useMutation برای ایجاد، ویرایش و حذف اطلاعات آشنا می‌شوید. همچنین مفاهیمی مانند Query Key، Caching، Refetching و مدیریت وضعیت‌های Loading و Error را آموزش می‌بینید. در بخش‌های پیشرفته‌تر با Invalidation، Optimistic Updates و Pagination کار می‌کنید. در پایان می‌توانید ارتباط با سرور و مدیریت داده‌ها را به شکل بهینه و قابل‌نگهداری در برنامه‌های React پیاده‌سازی کنید.",
    },

    en: {
      title: "React Query",
      shortDescription: "Master server-state management in React.",
      description:
        "In this course, you will explore the TanStack Query library—also known as React Query—and learn how to manage server-fetched data in React projects more efficiently and systematically. You will begin by examining the concept of Server State and how it differs from Client State. Next, you will learn how to set up the library and utilize hooks, such as `useQuery`, to retrieve data from an API. You will then move on to using `useMutation` for creating, updating, and deleting data. Additionally, you will cover key concepts including Query Keys, caching, refetching, and the handling of loading and error states. In the more advanced sections, you will work with query invalidation, optimistic updates, and pagination. By the end of the course, you will be able to implement server communication and data management in your React applications in a way that is both optimized and maintainable.",
    },
  },

  {
    id: 10018,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 24,
    price: 1150000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/zustand.jpg",

    fa: {
      title: "Zustand",
      shortDescription: "مدیریت state با Zustand",
      description:
        "در این دوره با Zustand به‌عنوان یک کتابخانه سبک و کاربردی برای مدیریت وضعیت در برنامه‌های React آشنا می‌شوید. ابتدا مفهوم State Management و مشکلات انتقال داده میان کامپوننت‌های مختلف را بررسی می‌کنید. سپس نحوه نصب و راه‌اندازی Zustand و ایجاد Store برای نگهداری اطلاعات مشترک را یاد می‌گیرید. در ادامه با روش تعریف Stateها و Actionها و نحوه دسترسی کامپوننت‌ها به اطلاعات مرکزی آشنا خواهید شد. همچنین مفاهیمی مانند مدیریت Stateهای مشتق‌شده، به‌روزرسانی اطلاعات و استفاده از چند Store را فرا می‌گیرید. در بخش عملی قابلیت‌هایی مانند سبد خرید، مدیریت اطلاعات کاربر و تنظیمات رابط کاربری را پیاده‌سازی می‌کنید. در پایان می‌توانید وضعیت مشترک برنامه‌های React را بدون پیچیدگی‌های غیرضروری مدیریت کنید.",
    },

    en: {
      title: "Zustand State Management",
      shortDescription: "Manage React state with Zustand.",
      description:
        "In this course, you will explore Zustand—a lightweight and practical library for state management in React applications. You will begin by examining the concept of state management and the challenges associated with passing data between different components. Next, you will learn how to install and set up Zustand, as well as how to create a store to house shared data. You will then discover how to define states and actions, and how components can access this centralized data. Furthermore, you will cover topics such as managing derived state, updating data, and utilizing multiple stores. In the practical section, you will implement features like a shopping cart, user data management, and UI settings. By the end of the course, you will be able to manage shared state in React applications without any unnecessary complexity.",
    },
  },

  {
    id: 10019,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 21,
    price: 950000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/zod.jpeg",

    fa: {
      title: "React Hook Form و Zod",
      shortDescription: "ساخت فرم‌های حرفه‌ای و validation",
      description:
        "در این دوره با دو ابزار کاربردی Zod و React Hook Form برای مدیریت فرم‌ها و اعتبارسنجی اطلاعات در پروژه‌های React آشنا می‌شوید. ابتدا با چالش‌های مدیریت فرم‌های پیچیده و اهمیت اعتبارسنجی اطلاعات ورودی کاربران آشنا خواهید شد. سپس نحوه استفاده از React Hook Form برای مدیریت مقادیر ورودی، وضعیت فرم و ارسال اطلاعات را فرا می‌گیرید. در ادامه با Zod و روش تعریف Schema برای اعتبارسنجی ساختار و نوع داده‌ها آشنا می‌شوید. همچنین نحوه اتصال Zod به React Hook Form و استفاده از Resolver را آموزش می‌بینید. در بخش عملی فرم‌هایی مانند ثبت‌نام، ورود و ویرایش اطلاعات کاربر را با پیام‌های خطای مناسب پیاده‌سازی می‌کنید. در پایان می‌توانید فرم‌های استاندارد، قابل‌اعتماد و قابل‌نگهداری برای پروژه‌های واقعی طراحی کنید.",
    },

    en: {
      title: "React Hook Form & Zod",
      shortDescription: "Build professional forms with validation.",
      description:
        "In this course, you will learn about two practical tools—Zod and React Hook Form—for managing forms and validating data in React projects. You will begin by exploring the challenges of handling complex forms and the importance of validating user input. Next, you will learn how to use React Hook Form to manage input values, form state, and data submission. You will then be introduced to Zod and how to define schemas to validate data structures and types. Furthermore, you will learn how to integrate Zod with React Hook Form using resolvers. In the practical section, you will implement forms—such as those for registration, login, and user profile editing—complete with appropriate error messages. By the end of the course, you will be able to design standard, reliable, and maintainable forms for real-world projects.",
    },
  },

  {
    id: 10020,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 31,
    price: 1700000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/websocket.png",

    fa: {
      title: "WebSocket و Socket.IO",
      shortDescription: "ساخت برنامه‌های Real-Time",
      description:
        "در این دوره با مفاهیم ارتباطات بلادرنگ در برنامه‌های تحت وب آشنا می‌شوید و یاد می‌گیرید چگونه اطلاعات را بدون نیاز به ارسال درخواست‌های مکرر میان کلاینت و سرور منتقل کنید. ابتدا تفاوت ارتباطات HTTP و WebSocket و نحوه ایجاد یک اتصال دوطرفه را بررسی می‌کنید. سپس با ساختار WebSocket و مراحل برقراری، مدیریت و قطع اتصال آشنا خواهید شد. در ادامه کتابخانه Socket.io را آموزش می‌بینید و نحوه ایجاد سرور و کلاینت برای تبادل پیام را فرا می‌گیرید. همچنین با مفاهیمی مانند Event، Room، Namespace و مدیریت کاربران متصل آشنا می‌شوید. در بخش عملی قابلیت‌هایی مانند چت آنلاین، اعلان‌های لحظه‌ای و به‌روزرسانی زنده اطلاعات را پیاده‌سازی می‌کنید. در پایان می‌توانید قابلیت‌های بلادرنگ را به وب‌اپلیکیشن‌های خود اضافه کنید.",
    },

    en: {
      title: "WebSocket & Socket.IO",
      shortDescription: "Build real-time web applications.",
      description:
        "In this course, you will explore the concepts of real-time communication in web applications and learn how to transfer data between the client and server without the need for repeated requests. You will begin by examining the differences between HTTP and WebSocket communications, as well as how to establish a two-way connection. Next, you will delve into the structure of WebSockets and the processes involved in establishing, managing, and terminating connections. You will then learn to use the Socket.io library to build servers and clients for exchanging messages, while also covering key concepts such as Events, Rooms, Namespaces, and the management of connected users. Through practical, hands-on projects, you will implement features like online chat, real-time notifications, and live data updates. By the end of the course, you will be able to integrate real-time capabilities into your own web applications.",
    },
  },

  {
    id: 10021,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 23,
    price: 1050000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/docker.jpg",

    fa: {
      title: "Docker برای برنامه‌نویسان",
      shortDescription: "اجرای پروژه‌ها با Docker",
      description:
        "در این دوره container، image، Dockerfile و اجرای دیتابیس و backend با Docker را یاد می‌گیرید.",
    },

    en: {
      title: "Docker for Developers",
      shortDescription: "Run and manage applications with Docker.",
      description:
        "Learn containers, images, Dockerfiles and running databases and backend services with Docker.",
    },
  },

  {
    id: 10022,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 33,
    price: 1800000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/deployment.jpg",

    fa: {
      title: "Deployment پروژه‌های وب",
      shortDescription: "انتشار پروژه‌های واقعی روی اینترنت",
      description:
        "در این دوره با فرایند انتشار و راه‌اندازی پروژه‌های وب آشنا می‌شوید و یاد می‌گیرید چگونه یک پروژه توسعه‌یافته را از محیط محلی به فضای آنلاین منتقل کنید. ابتدا مفاهیم هاست، سرور، دامنه و تفاوت محیط توسعه و محیط عملیاتی را بررسی می‌کنید. سپس نحوه آماده‌سازی پروژه برای انتشار و مدیریت متغیرهای محیطی را فرا می‌گیرید. در ادامه با روش‌های استقرار پروژه‌های فرانت‌اند و بک‌اند روی سرویس‌های میزبانی مختلف آشنا می‌شوید. همچنین نحوه اتصال دامنه، تنظیم HTTPS و پیکربندی ارتباط میان فرانت‌اند، بک‌اند و پایگاه داده را آموزش می‌بینید. در بخش عملی، یک پروژه وب را منتشر کرده و روش بررسی خطاها و به‌روزرسانی نسخه‌های جدید آن را تمرین می‌کنید. در پایان می‌توانید پروژه‌های خود را برای استفاده کاربران در محیط واقعی راه‌اندازی کنید.",
    },

    en: {
      title: "Web Deployment",
      shortDescription: "Deploy real-world web applications.",
      description:
        "In this course, you will become familiar with the process of publishing and launching web projects, learning how to transition a developed project from a local environment to an online space. You will begin by exploring concepts such as hosting, servers, and domains, as well as the differences between development and production environments. Next, you will learn how to prepare a project for deployment and manage environment variables. You will then discover methods for deploying front-end and back-end projects across various hosting services. Additionally, you will learn how to connect a domain, set up HTTPS, and configure the communication between the front-end, back-end, and database. In the practical section, you will deploy a web project and practice troubleshooting errors and rolling out new updates. By the end of the course, you will be able to launch your own projects for real-world use by end-users.",
    },
  },

  {
    id: 10023,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 28,
    price: 1450000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/dataanalyts.jpg",

    fa: {
      title: "مبانی تحلیل داده",
      shortDescription: "آشنایی با مفاهیم تحلیل داده",
      description:
        "در این دوره با اصول و مفاهیم اولیه تحلیل داده آشنا می‌شوید و یاد می‌گیرید چگونه اطلاعات خام را بررسی کرده و از آن‌ها نتایج قابل‌استفاده استخراج کنید. ابتدا با مفهوم داده، انواع داده و مراحل مختلف فرایند تحلیل آشنا خواهید شد. سپس نحوه جمع‌آوری، دسته‌بندی و سازمان‌دهی اطلاعات را فرا می‌گیرید. در ادامه با مفاهیم آمار توصیفی، میانگین، میانه، نمودارها و روش‌های ساده بررسی داده‌ها آشنا می‌شوید. همچنین یاد می‌گیرید چگونه الگوها، ارتباط‌ها و روندهای موجود در داده‌ها را شناسایی کنید. در بخش عملی دوره با ابزارهای کاربردی تحلیل داده و روش نمایش نتایج به کمک نمودارها آشنا خواهید شد. در پایان می‌توانید داده‌های ساده را تحلیل کرده و بر اساس نتایج به‌دست‌آمده گزارش‌های قابل‌فهم تهیه کنید.",
    },

    en: {
      title: "Data Analysis Fundamentals",
      shortDescription: "Learn the fundamentals of data analysis.",
      description:
        "In this course, you will become familiar with the fundamental principles and concepts of data analysis, learning how to examine raw information and extract actionable insights from it. You will begin by exploring the concept of data, its various types, and the different stages of the analysis process. Next, you will learn how to collect, categorize, and organize information. You will then be introduced to concepts such as descriptive statistics, mean, median, charts, and straightforward methods for data examination. Furthermore, you will learn to identify patterns, relationships, and trends within the data. In the practical portion of the course, you will explore useful data analysis tools and techniques for visualizing results through charts. By the end of the course, you will be able to analyze straightforward datasets and produce clear, understandable reports based on your findings.",
    },
  },

  {
    id: 10024,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 30,
    price: 1550000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/python.jpg",

    fa: {
      title: "Python برای تحلیل داده",
      shortDescription: "استفاده از Python در تحلیل داده",
      description:
        "در این دوره با زبان برنامه‌نویسی Python و کاربرد آن در تحلیل و پردازش داده‌ها آشنا می‌شوید. ابتدا اصول برنامه‌نویسی پایتون و مفاهیم پایه آن را یاد می‌گیرید تا بتوانید کدهای موردنیاز برای کار با داده‌ها را بنویسید. سپس با کتابخانه‌هایی مانند NumPy و Pandas آشنا می‌شوید که برای پردازش، مدیریت و تحلیل مجموعه داده‌ها کاربرد دارند. در ادامه نحوه پاک‌سازی داده‌ها، شناسایی اطلاعات ناقص و استخراج اطلاعات مفید از داده‌های خام را فرا می‌گیرید. همچنین با ابزارهای مصورسازی داده مانند Matplotlib و Seaborn آشنا می‌شوید تا بتوانید نتایج تحلیل‌های خود را به شکل نمودارهای قابل‌فهم نمایش دهید. در پایان دوره می‌توانید داده‌های واقعی را بررسی کنید، الگوهای مهم را شناسایی کرده و نتایج تحلیلی ارائه دهید.",
    },

    en: {
      title: "Python for Data Analysis",
      shortDescription: "Use Python for practical data analysis.",
      description:
        "In this course, you will be introduced to the Python programming language and its application in data analysis and processing. You will begin by learning the fundamentals of Python programming and its core concepts, enabling you to write the code necessary for working with data. Next, you will explore libraries such as NumPy and Pandas, which are used for processing, managing, and analyzing datasets. You will then learn how to clean data, identify incomplete information, and extract valuable insights from raw data. Additionally, you will become familiar with data visualization tools like Matplotlib and Seaborn, allowing you to present your analysis results through clear, understandable charts. By the end of the course, you will be able to examine real-world data, identify significant patterns, and present analytical findings.",
    },
  },

  {
    id: 10025,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 32,
    price: 1650000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/data.jpeg",

    fa: {
      title: "Pandas",
      shortDescription: "تحلیل داده با Pandas",
      description:
        "در این دوره DataFrame، filtering، grouping و تحلیل داده با Pandas را یاد می‌گیرید.",
    },

    en: {
      title: "Pandas",
      shortDescription: "Analyze datasets efficiently with Pandas.",
      description:
        "Learn DataFrames, filtering, grouping and practical data analysis with Pandas.",
    },
  },

  {
    id: 10026,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 27,
    price: 1400000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/datavs.jpg",

    fa: {
      title: "Data Visualization",
      shortDescription: "نمایش حرفه‌ای داده‌ها",
      description:
        "در این دوره با مفاهیم مصورسازی داده آشنا می‌شوید و یاد می‌گیرید چگونه اطلاعات پیچیده را به نمودارها و گزارش‌های بصری قابل‌فهم تبدیل کنید. ابتدا اصول نمایش داده‌ها و اهمیت انتخاب روش مناسب برای ارائه اطلاعات را بررسی می‌کنید. سپس با انواع نمودارها مانند نمودار میله‌ای، خطی، دایره‌ای و پراکندگی آشنا می‌شوید. در ادامه نحوه انتخاب رنگ‌ها، مقیاس‌ها و ساختار مناسب برای نمایش دقیق داده‌ها را فرا می‌گیرید. همچنین با ابزارهای رایج مصورسازی داده و روش ایجاد داشبوردهای تحلیلی آشنا خواهید شد. در بخش عملی، مجموعه داده‌های مختلف را بررسی کرده و نتایج تحلیل را به شکل گزارش‌های تصویری ارائه می‌دهید. در پایان می‌توانید اطلاعات را به شکلی واضح و کاربردی نمایش دهید تا تصمیم‌گیری بر اساس داده‌ها آسان‌تر شود.",
    },

    en: {
      title: "Data Visualization",
      shortDescription: "Present data using effective visualizations.",
      description:
        "In this course, you will explore the concepts of data visualization and learn how to transform complex information into understandable charts and visual reports. You will begin by examining the principles of data representation and the importance of selecting the appropriate method for presenting information. Next, you will become familiar with various types of charts, such as bar, line, pie, and scatter plots. You will then learn how to choose the right colors, scales, and structures to represent data accurately. Additionally, you will be introduced to common data visualization tools and techniques for creating analytical dashboards. In the practical component, you will analyze various datasets and present your findings through visual reports. By the end of the course, you will be able to display information in a clear and practical manner, facilitating data-driven decision-making.",
    },
  },

  {
    id: 10027,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 34,
    price: 1750000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/sql.jpg",

    fa: {
      title: "SQL برای تحلیل داده",
      shortDescription: "کار با SQL برای تحلیل داده",
      description:
        "در این دوره با زبان SQL و کاربرد آن در استخراج، بررسی و تحلیل داده‌ها آشنا می‌شوید. ابتدا مفاهیم پایگاه داده رابطه‌ای و نحوه ذخیره‌سازی اطلاعات را یاد می‌گیرید و سپس دستورات پایه برای دریافت و فیلتر کردن داده‌ها را آموزش می‌بینید. در ادامه با استفاده از شرط‌ها، مرتب‌سازی و توابع تجمیعی می‌توانید اطلاعات موردنیاز خود را از میان حجم زیادی از داده‌ها استخراج کنید. همچنین نحوه ترکیب اطلاعات از چند جدول با استفاده از JOIN و Subquery را فرا می‌گیرید. در بخش‌های پیشرفته‌تر با GROUP BY، HAVING و توابع پنجره‌ای برای تحلیل‌های دقیق‌تر آشنا می‌شوید. در طول دوره روی مجموعه داده‌های واقعی تمرین خواهید کرد تا بتوانید پرس‌وجوهای تحلیلی بنویسید. در پایان می‌توانید با استفاده از SQL اطلاعات ارزشمند را از پایگاه داده استخراج و تحلیل کنید.",
    },

    en: {
      title: "SQL for Data Analysis",
      shortDescription: "Use SQL for practical data analysis.",
      description:
        "In this course, you will learn about the SQL language and its application in extracting, examining, and analyzing data. You will begin by understanding the concepts of relational databases and how information is stored, followed by the fundamental commands for retrieving and filtering data. You will then learn to extract specific information from large datasets using conditions, sorting, and aggregate functions. Additionally, you will discover how to combine data from multiple tables using JOINs and subqueries. In the more advanced sections, you will explore `GROUP BY`, `HAVING`, and window functions to perform more precise analysis. Throughout the course, you will work with real-world datasets, gaining the skills to write analytical queries. By the end, you will be able to use SQL to extract and analyze valuable insights from a database.",
    },
  },

  {
    id: 10028,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 36,
    price: 1950000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/ai.jpg",

    fa: {
      title: "مبانی هوش مصنوعی",
      shortDescription: "آشنایی با مفاهیم پایه AI",
      description:
        "در این دوره با مفاهیم پایه هوش مصنوعی و تأثیر آن بر فناوری و زندگی روزمره آشنا می‌شوید. ابتدا مفهوم هوش مصنوعی، تاریخچه شکل‌گیری آن و نحوه عملکرد سیستم‌های هوشمند را بررسی می‌کنید. سپس تفاوت میان هوش مصنوعی، یادگیری ماشین و یادگیری عمیق را فرا می‌گیرید و با روش‌های مختلف آموزش سیستم‌های هوشمند آشنا می‌شوید. در ادامه مفاهیمی مانند شبکه‌های عصبی، پردازش زبان طبیعی و بینایی ماشین را به زبان ساده بررسی می‌کنید. همچنین با هوش مصنوعی مولد، مدل‌های زبانی بزرگ و ابزارهای جدید این حوزه آشنا خواهید شد. در پایان دوره دید مناسبی نسبت به کاربردهای هوش مصنوعی در کسب‌وکار، آموزش، برنامه‌نویسی و سایر زمینه‌ها به دست می‌آورید.",
    },

    en: {
      title: "Artificial Intelligence Fundamentals",
      shortDescription: "Learn the fundamentals of artificial intelligence.",
      description:
        "In this course, you will explore the fundamental concepts of artificial intelligence and its impact on technology and daily life. You will begin by examining the concept of artificial intelligence, its history, and how intelligent systems function. Next, you will learn the distinctions between artificial intelligence, machine learning, and deep learning, and discover various methods for training intelligent systems. You will then delve into concepts such as neural networks, natural language processing, and computer vision—explained in simple, accessible terms. Additionally, you will be introduced to generative AI, large language models, and the latest tools in the field. By the end of the course, you will have gained a solid understanding of how artificial intelligence is applied across business, education, programming, and other domains.",
    },
  },

  {
    id: 10029,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 40,
    price: 2200000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/ml.jpg",

    fa: {
      title: "Machine Learning",
      shortDescription: "یادگیری مفاهیم اصلی Machine Learning",
      description:
        "در این دوره با الگوریتم‌های اصلی یادگیری ماشین و فرآیند ساخت مدل آشنا می‌شوید.",
    },

    en: {
      title: "Machine Learning",
      shortDescription: "Learn the fundamentals of machine learning.",
      description:
        "Learn core machine learning algorithms and the practical workflow of building predictive models.",
    },
  },

  {
    id: 10030,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 26,
    price: 1300000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/excel.png",

    fa: {
      title: "Excel برای تحلیل داده",
      shortDescription: "تحلیل داده با Excel",
      description:
        "در این دوره با نرم‌افزار Microsoft Excel و کاربرد آن در مدیریت و تحلیل داده‌ها آشنا می‌شوید. ابتدا محیط اکسل، ساختار سلول‌ها، سطرها و ستون‌ها و نحوه ورود و سازمان‌دهی اطلاعات را یاد می‌گیرید. سپس با فرمول‌ها و توابع پرکاربرد مانند SUM، AVERAGE، IF و COUNTIF برای انجام محاسبات و بررسی داده‌ها آشنا می‌شوید. در ادامه نحوه مرتب‌سازی، فیلتر کردن و پاک‌سازی اطلاعات را فرا می‌گیرید. همچنین با Pivot Table و Pivot Chart برای خلاصه‌سازی و تحلیل مجموعه داده‌های بزرگ کار خواهید کرد. در بخش عملی، نمودارها و گزارش‌های تحلیلی ایجاد می‌کنید تا بتوانید نتایج را به شکل قابل‌فهم ارائه دهید. در پایان دوره قادر خواهید بود با استفاده از Excel داده‌ها را مدیریت، بررسی و تحلیل کنید.",
    },

    en: {
      title: "Excel for Data Analysis",
      shortDescription: "Analyze data effectively with Excel.",
      description:
        "In this course, you will learn about Microsoft Excel software and its use in data management and analysis. First, you learn the Excel environment, the structure of cells, rows and columns, and how to enter and organize information. Then you will get to know frequently used formulas and functions such as SUM, AVERAGE, IF and COUNTIF to perform calculations and check data. Next, you will learn how to sort, filter and clear information. You will also work with Pivot Tables and Pivot Charts to summarize and analyze large data sets. In the practical part, you will create graphs and analytical reports to present the results in an understandable way. At the end of the course, you will be able to manage, review and analyze data using Excel.",
    },
  },

  {
    id: 10031,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 29,
    price: 1500000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/powerbl.jpg",

    fa: {
      title: "Power BI",
      shortDescription: "ساخت داشبوردهای حرفه‌ای با Power BI",
      description:
        "در این دوره با نرم‌افزار Power BI و کاربرد آن در تحلیل و نمایش بصری داده‌ها آشنا می‌شوید. ابتدا محیط نرم‌افزار و نحوه اتصال به منابع مختلف داده مانند Excel و پایگاه‌های داده را یاد می‌گیرید. سپس با ابزار Power Query برای پاک‌سازی، تبدیل و آماده‌سازی داده‌ها کار می‌کنید. در ادامه نحوه ایجاد ارتباط میان جداول و طراحی مدل داده را فرا می‌گیرید. همچنین با زبان DAX و توابع کاربردی آن برای محاسبات و تحلیل‌های پیشرفته آشنا خواهید شد. در بخش عملی، نمودارها، گزارش‌ها و داشبوردهای تعاملی طراحی می‌کنید تا اطلاعات را به شکل حرفه‌ای نمایش دهید. در پایان می‌توانید داده‌های کسب‌وکار را تحلیل کرده و گزارش‌های بصری کاربردی برای تصمیم‌گیری تهیه کنید.",
    },

    en: {
      title: "Power BI",
      shortDescription: "Build professional dashboards with Power BI.",
      description:
        "In this course, you will become familiar with Power BI and its application in data analysis and visualization. You will begin by exploring the software interface and learning how to connect to various data sources, such as Excel files and databases. Next, you will work with Power Query to clean, transform, and prepare your data. You will then learn how to establish relationships between tables and design a data model. Additionally, you will be introduced to the DAX language and its essential functions for performing advanced calculations and analysis. In the practical component, you will design interactive charts, reports, and dashboards to present information in a professional manner. By the end of the course, you will be able to analyze business data and create actionable visual reports to support decision-making.",
    },
  },

  {
    id: 10032,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 35,
    price: 1850000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/networksecurity.jpg",

    fa: {
      title: "مبانی امنیت شبکه",
      shortDescription: "آشنایی با اصول امنیت شبکه",
      description:
        "در این دوره با مفاهیم پایه شبکه‌های کامپیوتری و اصول محافظت از ارتباطات و اطلاعات در برابر تهدیدات امنیتی آشنا می‌شوید. ابتدا ساختار شبکه، انواع شبکه‌ها و مدل‌های ارتباطی مانند OSI و TCP/IP را بررسی می‌کنید. سپس با مفاهیمی مانند IP، DNS، پورت‌ها و پروتکل‌های ارتباطی آشنا خواهید شد. در ادامه تهدیدات رایج شبکه از جمله شنود اطلاعات، جعل هویت، حملات منع سرویس و دسترسی غیرمجاز را مطالعه می‌کنید. همچنین با اصول کار فایروال‌ها، رمزنگاری ارتباطات و روش‌های کنترل دسترسی آشنا می‌شوید. در بخش عملی، ابزارهای مقدماتی بررسی شبکه را در محیط‌های آزمایشگاهی به کار می‌گیرید. در پایان می‌توانید ساختار امنیت شبکه را بهتر درک کرده و روش‌های اولیه شناسایی و کاهش تهدیدات را بشناسید.",
    },

    en: {
      title: "Network Security Fundamentals",
      shortDescription: "Learn the fundamentals of network security.",
      description:
        "In this course, you will learn about the fundamental concepts of computer networks and the principles of protecting communications and data against security threats. You will begin by examining network architecture, types of networks, and communication models such as OSI and TCP/IP. Next, you will explore concepts including IP, DNS, ports, and communication protocols. You will then study common network threats, such as eavesdropping, identity spoofing, denial-of-service attacks, and unauthorized access. Additionally, you will learn about the operation of firewalls, communication encryption, and access control methods. In the practical component, you will apply basic network analysis tools within a laboratory environment. By the end of the course, you will have a better understanding of network security architecture and be familiar with fundamental methods for identifying and mitigating threats.",
    },
  },

  {
    id: 10033,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 38,
    price: 2050000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/hacking.jpg",

    fa: {
      title: "Ethical Hacking",
      shortDescription: "آشنایی با تست نفوذ و Ethical Hacking",
      description:
        "در این دوره با مفاهیم هک اخلاقی و اصول شناسایی و ارزیابی آسیب‌پذیری‌های امنیتی آشنا می‌شوید. ابتدا مبانی امنیت سایبری، انواع تهدیدات و روش‌های رایج حملات سایبری را بررسی می‌کنید. سپس با مفاهیم شبکه، پروتکل‌های ارتباطی و نحوه شناسایی نقاط ضعف سیستم‌ها آشنا خواهید شد. در ادامه مراحل مختلف تست نفوذ شامل جمع‌آوری اطلاعات، شناسایی سرویس‌ها، تحلیل آسیب‌پذیری‌ها و ارزیابی امنیت را آموزش می‌بینید. همچنین با ابزارهای متداول امنیتی و نحوه استفاده از آن‌ها در محیط‌های آزمایشگاهی آشنا می‌شوید. در بخش عملی دوره روش بررسی امنیت وب‌سایت‌ها و سیستم‌ها را در چارچوب مجوزهای قانونی تمرین می‌کنید. در پایان می‌توانید دید مناسبی نسبت به فرایند تست نفوذ و روش‌های شناسایی و پیشگیری از تهدیدات امنیتی به دست آورید.",
    },

    en: {
      title: "Ethical Hacking",
      shortDescription: "Learn ethical hacking and penetration testing concepts.",
      description:
        "In this course, you will learn about the concepts of ethical hacking, as well as the principles for identifying and assessing security vulnerabilities. You will begin by exploring the fundamentals of cybersecurity, various types of threats, and common cyberattack methods. Next, you will become familiar with networking concepts, communication protocols, and how to identify system weaknesses. You will then learn the various stages of penetration testing, including information gathering, service identification, vulnerability analysis, and security assessment. Additionally, you will be introduced to common security tools and how to utilize them within a laboratory environment. In the practical component of the course, you will practice assessing the security of websites and systems, strictly within the scope of legal authorization. By the end of the course, you will have gained a solid understanding of the penetration testing process, as well as methods for identifying and preventing security threats.",
    },
  },

  {
    id: 10034,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 31,
    price: 1700000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/security.jpg",

    fa: {
      title: "امنیت وب",
      shortDescription: "آشنایی با آسیب‌پذیری‌های رایج وب",
      description:
        "در این دوره با اصول امنیت وب و روش‌های شناسایی و پیشگیری از آسیب‌پذیری‌های رایج در وب‌سایت‌ها آشنا می‌شوید. ابتدا مفاهیم پایه امنیت اطلاعات، تهدیدات سایبری و نحوه عملکرد حملات تحت وب را بررسی می‌کنید. سپس آسیب‌پذیری‌هایی مانند XSS، CSRF، SQL Injection و ضعف‌های مربوط به کنترل دسترسی را آموزش می‌بینید. در ادامه با روش‌های امن‌سازی ورودی‌های کاربر، مدیریت نشست‌ها و محافظت از اطلاعات حساس آشنا خواهید شد. همچنین نحوه استفاده صحیح از HTTPS، اعتبارسنجی داده‌ها و تنظیم هدرهای امنیتی را فرا می‌گیرید. در بخش عملی، آسیب‌پذیری‌ها را در محیط‌های آزمایشگاهی بررسی کرده و روش‌های برطرف کردن آن‌ها را تمرین می‌کنید. در پایان می‌توانید امنیت وب‌سایت‌ها را بهتر ارزیابی کرده و اصول اولیه توسعه امن را در پروژه‌های خود رعایت کنید.",
    },

    en: {
      title: "Web Security",
      shortDescription: "Learn common web application security concepts.",
      description:
        "In this course, you will learn the principles of web security, as well as methods for identifying and preventing common website vulnerabilities. You will begin by exploring fundamental concepts of information security, cyber threats, and the mechanics of web-based attacks. Next, you will study specific vulnerabilities—such as XSS, CSRF, SQL Injection, and access control flaws—and learn how to secure user inputs, manage sessions, and protect sensitive data. You will also learn the proper implementation of HTTPS, data validation, and the configuration of security headers. Through hands-on exercises in a lab environment, you will examine these vulnerabilities and practice remediation techniques. By the end of the course, you will be equipped to better assess website security and apply the core principles of secure development to your own projects.",
    },
  },

  {
    id: 10035,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 24,
    price: 1200000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/linux.jpg",

    fa: {
      title: "Linux برای امنیت",
      shortDescription: "استفاده از Linux در امنیت",
      description:
        "در این دوره با سیستم‌عامل لینوکس و نقش آن در مدیریت سیستم‌ها و امنیت سایبری آشنا می‌شوید. ابتدا ساختار لینوکس، توزیع‌های مختلف و نحوه نصب و راه‌اندازی آن را یاد می‌گیرید. سپس کار با ترمینال و دستورات مهم برای مدیریت فایل‌ها، پوشه‌ها و پردازش‌ها را آموزش می‌بینید. در ادامه با مدیریت کاربران، گروه‌ها، مجوزهای دسترسی و تنظیمات امنیتی سیستم آشنا می‌شوید. همچنین نحوه مدیریت سرویس‌ها، بررسی ارتباطات شبکه و مشاهده گزارش‌های سیستمی را فرا می‌گیرید. در بخش عملی دوره با ابزارهای امنیتی لینوکس و کاربرد آن‌ها در بررسی و ارزیابی امنیت سیستم‌ها آشنا خواهید شد. در پایان می‌توانید از محیط لینوکس برای مدیریت سیستم و انجام فعالیت‌های مقدماتی امنیتی در محیط‌های مجاز استفاده کنید.",
    },

    en: {
      title: "Linux for Security",
      shortDescription: "Use Linux tools for security workflows.",
      description:
        "In this course, you will be introduced to the Linux operating system and its role in system administration and cybersecurity. You will begin by learning about the Linux architecture, various distributions, and the installation and setup process. Next, you will learn to work with the terminal and master essential commands for managing files, directories, and processes. You will then explore user and group management, access permissions, and system security configurations. Furthermore, you will learn how to manage services, analyze network connections, and review system logs. In the practical component of the course, you will become familiar with Linux security tools and their application in assessing and evaluating system security. By the end of the course, you will be able to utilize the Linux environment for system administration and perform foundational security tasks within authorized settings.",
    },
  },

  {
    id: 10036,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 28,
    price: 1450000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/backend.jpg",

    fa: {
      title: "امنیت API و Backend",
      shortDescription: "محافظت از APIها و Backend",
      description:
        "در این دوره با اصول امنیت در توسعه بک‌اند و طراحی APIهای امن آشنا می‌شوید و یاد می‌گیرید چگونه از اطلاعات و منابع یک سیستم در برابر دسترسی‌های غیرمجاز محافظت کنید. ابتدا مفاهیم امنیت سمت سرور و تهدیدات رایج در برنامه‌های بک‌اند را بررسی می‌کنید. سپس با روش‌های احراز هویت، مدیریت مجوزها و کنترل دسترسی کاربران آشنا می‌شوید. در ادامه موضوعاتی مانند اعتبارسنجی ورودی‌ها، جلوگیری از تزریق دستورات، مدیریت امن توکن‌ها و محافظت از اطلاعات حساس را آموزش می‌بینید. همچنین با محدودسازی درخواست‌ها، مدیریت خطاها و تنظیمات امنیتی ارتباطات API آشنا خواهید شد. در بخش عملی، روش شناسایی و رفع آسیب‌پذیری‌های متداول را در محیط‌های مجاز تمرین می‌کنید. در پایان می‌توانید APIها و سرویس‌های بک‌اند امن‌تر و قابل‌اعتمادتری طراحی کنید.",
    },

    en: {
      title: "API & Backend Security",
      shortDescription: "Protect backend applications and APIs.",
      description:
        "In this course, you will explore the principles of security in backend development and the design of secure APIs, learning how to protect a system's data and resources from unauthorized access. You will begin by examining server-side security concepts and common threats facing backend applications. Next, you will cover authentication methods, permission management, and user access control. The course further explores topics such as input validation, the prevention of command injection, secure token management, and the protection of sensitive information. You will also learn about request rate limiting, error handling, and security configurations for API communications. Through practical exercises, you will practice identifying and remediating common vulnerabilities within controlled environments. By the end of the course, you will be equipped to design more secure and reliable APIs and backend services.",
    },
  },

  {
    id: 10037,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 34,
    price: 1800000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/gamedesign.jpeg",

    fa: {
      title: "مبانی بازی‌سازی",
      shortDescription: "آشنایی با اصول ساخت بازی",
      description:
        "در این دوره با مفاهیم اولیه طراحی و توسعه بازی‌های کامپیوتری آشنا می‌شوید و مراحل تبدیل یک ایده به یک بازی قابل اجرا را یاد می‌گیرید. ابتدا با تاریخچه بازی‌سازی، انواع بازی‌ها و اجزای اصلی یک بازی آشنا خواهید شد. سپس مفاهیمی مانند گیم‌پلی، مکانیک‌های بازی، طراحی مراحل و تجربه کاربری را بررسی می‌کنید. در ادامه با نقش برنامه‌نویسی، طراحی گرافیک، صداگذاری و انیمیشن در فرایند ساخت بازی آشنا می‌شوید. همچنین اصول طراحی شخصیت‌ها، محیط بازی و تعامل بازیکن با دنیای بازی را فرا می‌گیرید. در بخش عملی، مراحل اولیه طراحی یک بازی ساده را تجربه می‌کنید و با ابزارهای رایج بازی‌سازی آشنا می‌شوید. در پایان دید جامعی نسبت به فرایند توسعه بازی و مهارت‌های موردنیاز این حوزه به دست می‌آورید.",
    },

    en: {
      title: "Game Development Fundamentals",
      shortDescription: "Learn the fundamentals of game development.",
      description:
        "In this course, you will be introduced to the fundamental concepts of computer game design and development, learning the steps involved in transforming an idea into a playable game. You will begin by exploring the history of game development, various game genres, and the core components of a game. Next, you will examine concepts such as gameplay, game mechanics, level design, and user experience. You will then learn about the roles of programming, graphic design, sound design, and animation within the game development process. Additionally, you will cover the principles of character design, environment creation, and player interaction with the game world. In the practical component, you will experience the initial stages of designing a simple game and become familiar with common game development tools. By the end of the course, you will have gained a comprehensive understanding of the game development process and the skills required in this field.",
    },
  },

  {
    id: 10038,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 42,
    price: 2300000,
    thumbnail: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/unitys.jpg",

    fa: {
      title: "Unity",
      shortDescription: "ساخت بازی با Unity",
      description:
        "در این دوره با موتور بازی‌سازی Unity آشنا می‌شوید و یاد می‌گیرید چگونه ایده‌های خود را به بازی‌های دوبعدی و سه‌بعدی تبدیل کنید. ابتدا محیط نرم‌افزار و ابزارهای اصلی آن را بررسی می‌کنید و با مفاهیمی مانند Scene، GameObject و Component آشنا می‌شوید. سپس برنامه‌نویسی با زبان C# را برای کنترل شخصیت‌ها، مدیریت رویدادها و ایجاد منطق بازی فرا می‌گیرید. در ادامه نحوه طراحی محیط بازی، استفاده از مدل‌های سه‌بعدی، تنظیم فیزیک و ایجاد برخورد میان اشیا را آموزش می‌بینید. همچنین با سیستم انیمیشن، صداگذاری و ایجاد تعاملات مختلف در بازی آشنا خواهید شد. در طول دوره با انجام تمرین‌های عملی، مراحل توسعه یک بازی را تجربه می‌کنید. در پایان می‌توانید یک بازی کاربردی طراحی کرده و از آن خروجی قابل اجرا تهیه کنید.",
    },

    en: {
      title: "Unity Game Development",
      shortDescription: "Build games with Unity.",
      description:
        "In this course, you will be introduced to the Unity game engine and learn how to transform your ideas into 2D and 3D games. You will begin by exploring the software interface and its core tools, becoming familiar with key concepts such as Scenes, GameObjects, and Components. Next, you will learn C# programming to control characters, manage events, and implement game logic. You will also learn how to design game environments, utilize 3D models, configure physics, and set up collision detection between objects. Furthermore, you will explore animation systems, audio integration, and the creation of various in-game interactions. Throughout the course, you will gain hands-on experience in the game development process by completing practical exercises. By the end, you will be able to design a functional game and export it as a playable build.",
    },
  },

  {
    id: 10039,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 36,
    price: 2000000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/unity.jpg",

    fa: {
      title: "C# برای Unity",
      shortDescription: "یادگیری C# برای بازی‌سازی",
      description:
        "در این دوره با زبان برنامه‌نویسی C# و کاربرد آن در توسعه بازی با موتور Unity آشنا می‌شوید. ابتدا ساختار زبان C# و مفاهیم پایه برنامه‌نویسی مانند متغیرها، انواع داده، شرط‌ها و حلقه‌ها را یاد می‌گیرید. سپس با توابع، کلاس‌ها، اشیا و اصول برنامه‌نویسی شیءگرا آشنا می‌شوید. در ادامه نحوه استفاده از اسکریپت‌ها در Unity و اتصال آن‌ها به GameObjectها را فرا می‌گیرید. همچنین یاد می‌گیرید چگونه حرکت شخصیت‌ها، تعامل با محیط، برخورد اشیا و منطق اصلی بازی را با استفاده از C# پیاده‌سازی کنید. در بخش عملی، قابلیت‌های مختلف یک بازی را مرحله‌به‌مرحله توسعه می‌دهید. در پایان می‌توانید با استفاده از C# رفتارها و سیستم‌های موردنیاز بازی‌های دوبعدی و سه‌بعدی را در Unity برنامه‌نویسی کنید.",
    },

    en: {
      title: "C# for Unity",
      shortDescription: "Learn C# for Unity game development.",
      description:
        "In this course, you will learn about the C# programming language and its application in game development using the Unity engine. You will begin by exploring the structure of C# and fundamental programming concepts such as variables, data types, conditionals, and loops. Next, you will be introduced to functions, classes, objects, and the principles of object-oriented programming. You will then learn how to utilize scripts within Unity and attach them to GameObjects. Furthermore, you will discover how to implement character movement, environmental interaction, object collisions, and core game logic using C#. Through practical exercises, you will develop various game features step-by-step. By the end of the course, you will be able to use C# to program the behaviors and systems required for 2D and 3D games in Unity.",
    },
  },

  {
    id: 10040,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 30,
    price: 1650000,
    thumbnail:"https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/courses/games.jpg",

    fa: {
      title: "طراحی بازی",
      shortDescription: "اصول Game Design",
      description:
        "در این دوره با اصول طراحی بازی، gameplay و تجربه کاربر آشنا می‌شوید.",
    },

    en: {
      title: "Game Design",
      shortDescription: "Learn the principles of game design.",
      description:
        "Learn game design principles, gameplay concepts and player experience fundamentals.",
    },
  },
];



const blogs: BlogSeed[] = [
  {
    id: 20001,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/programming.jpeg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/programming.jpeg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author1.jpg",

    fa: {
      title: "مسیر یادگیری برنامه‌نویسی در سال ۱۴۰۵",
      shortDescription: "چطور مسیر یادگیری برنامه‌نویسی را شروع کنیم؟",
      description: "در این مقاله درباره انتخاب مسیر مناسب برای شروع برنامه‌نویسی و مهارت‌هایی که باید یاد بگیرید صحبت می‌کنیم.",
      content: `
شروع برنامه‌نویسی برای بسیاری از افراد می‌تواند کمی گیج‌کننده باشد. زبان‌های برنامه‌نویسی مختلف، ابزارهای متنوع و مسیرهای شغلی متفاوت باعث می‌شوند که افراد در ابتدای راه ندانند از کجا باید شروع کنند.

اولین قدم برای یادگیری برنامه‌نویسی، مشخص کردن هدف است. آیا می‌خواهید وب‌سایت طراحی کنید؟ به توسعه اپلیکیشن علاقه دارید؟ یا قصد دارید وارد حوزه هوش مصنوعی شوید؟ پاسخ به این سؤال کمک می‌کند مسیر مناسب‌تری انتخاب کنید.

## ۱. انتخاب مسیر مناسب

یکی از محبوب‌ترین مسیرهای ورود به دنیای برنامه‌نویسی، توسعه وب است. در این مسیر می‌توانید ابتدا با HTML و CSS ساختار و ظاهر صفحات وب را یاد بگیرید و سپس با JavaScript به صفحات خود تعامل اضافه کنید.

بعد از یادگیری مبانی، می‌توانید وارد دنیای React و سپس Next.js شوید. این ابزارها به شما کمک می‌کنند پروژه‌های حرفه‌ای‌تر و کاربردی‌تری بسازید.

## ۲. یادگیری اصولی و مرحله‌به‌مرحله

یکی از اشتباهات رایج افراد مبتدی، یادگیری هم‌زمان چندین زبان و تکنولوژی است. بهتر است ابتدا یک مسیر مشخص انتخاب کنید و مفاهیم آن را به‌خوبی یاد بگیرید.

به‌جای اینکه فقط ویدئوهای آموزشی تماشا کنید، سعی کنید هر چیزی را که یاد می‌گیرید در قالب یک تمرین یا پروژه کوچک پیاده‌سازی کنید.

## ۳. ساخت پروژه‌های واقعی

بعد از یادگیری مفاهیم پایه، ساخت پروژه اهمیت زیادی پیدا می‌کند. پروژه‌هایی مانند وب‌سایت شخصی، فروشگاه اینترنتی، سیستم مدیریت وظایف و پنل کاربری می‌توانند تجربه عملی شما را افزایش دهند.

در این مرحله با مشکلات واقعی برنامه‌نویسی روبه‌رو می‌شوید و یاد می‌گیرید چگونه خطاها را پیدا و برطرف کنید.

## ۴. ساخت رزومه و نمونه‌کار

برای ورود به بازار کار، تنها دانستن زبان‌های برنامه‌نویسی کافی نیست. کارفرما یا مشتری باید بتواند توانایی شما را در پروژه‌های واقعی مشاهده کند.

پروژه‌های خود را در GitHub قرار دهید، نسخه آنلاین آن‌ها را منتشر کنید و برای هر پروژه توضیح مناسبی بنویسید.

## ۵. استمرار در یادگیری

برنامه‌نویسی حوزه‌ای است که دائماً در حال تغییر است. بنابراین یادگیری شما بعد از استخدام یا گرفتن اولین پروژه متوقف نمی‌شود.

بهترین روش این است که هر روز زمانی را به تمرین، مطالعه مستندات و ساخت پروژه اختصاص دهید.

در نهایت به یاد داشته باشید که برای تبدیل شدن به یک برنامه‌نویس حرفه‌ای لازم نیست همه چیز را از ابتدا بدانید. کافی است مسیر مشخصی داشته باشید، قدم‌به‌قدم پیش بروید و آموخته‌های خود را به تجربه عملی تبدیل کنید.
      `,
    },

    en: {
      title: "Programming Learning Roadmap in 2026",
      shortDescription: "How should you start learning programming?",
      description: "Learn how to choose the right programming path and which skills you should focus on when starting.",
      content: `
Starting programming can be confusing for many beginners. Different programming languages, tools, and career opportunities often make it difficult to know where to begin.

The first step is to define your goal. Do you want to build websites, develop applications, or work in artificial intelligence? Understanding your interests will help you choose a suitable learning path.

## 1. Choose the Right Path

Web development is one of the most popular ways to enter the programming world. You can begin with HTML and CSS to understand page structure and design, then learn JavaScript to add interactivity.

After mastering the fundamentals, you can move on to React and Next.js to build more advanced applications.

## 2. Learn Step by Step

One common mistake among beginners is trying to learn several technologies at the same time. Instead, choose one path and focus on understanding its fundamentals.

Do not only watch tutorials. Practice every concept by building small exercises and projects.

## 3. Build Real Projects

After learning the basics, start building practical projects. A personal website, online store, task management application, or user dashboard can help you gain valuable experience.

Real projects teach you how to solve problems, debug errors, and work with different technologies.

## 4. Build Your Portfolio

Knowing programming languages is not enough to enter the job market. Employers and clients need to see what you can actually build.

Publish your projects on GitHub, deploy their live versions, and provide clear descriptions of your work.

## 5. Keep Learning

Programming is constantly evolving. Your learning journey does not end after getting your first job or project.

Make time for practice, documentation, and building new applications.

Remember that you do not need to know everything from the beginning. Choose a clear direction, stay consistent, and turn your knowledge into practical experience.
      `,
    },
  },

  {
    id: 20003,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/fullstackprojects.jpeg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/fullstackprojects.jpeg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author2.jpg",

    fa: {
      title: "چطور اولین پروژه برنامه‌نویسی را بگیریم؟",
      shortDescription: "راهنمای شروع فریلنسینگ برای برنامه‌نویسان",
      description: "در این مقاله روش‌های ساخت رزومه، نمونه‌کار و جذب اولین مشتری را بررسی می‌کنیم.",
      content: `
گرفتن اولین پروژه برنامه‌نویسی یکی از مهم‌ترین و در عین حال چالش‌برانگیزترین مراحل ورود به بازار کار است. بسیاری از برنامه‌نویسان مهارت فنی مناسبی دارند، اما نمی‌دانند چگونه توانایی خود را به مشتری یا کارفرما نشان دهند.

برای گرفتن اولین پروژه، لازم نیست از همان ابتدا تجربه کاری زیادی داشته باشید. چیزی که اهمیت دارد، نشان دادن توانایی حل مسئله و ساخت محصولات کاربردی است.

## ۱. ساخت نمونه‌کارهای قابل ارائه

اولین قدم، ساخت چند پروژه کاربردی است. بهتر است به‌جای پروژه‌های بسیار ساده آموزشی، پروژه‌هایی بسازید که ساختار واقعی یک محصول را داشته باشند.

برای مثال می‌توانید یک فروشگاه اینترنتی، وب‌سایت آموزشی یا پنل مدیریت طراحی کنید.

## ۲. آماده کردن رزومه حرفه‌ای

رزومه شما باید به‌صورت واضح مهارت‌ها، تکنولوژی‌های مورد استفاده و پروژه‌هایی را که ساخته‌اید نمایش دهد.

برای هر پروژه توضیح دهید چه مشکلی را حل کرده‌اید، از چه تکنولوژی‌هایی استفاده کرده‌اید و چه بخش‌هایی را خودتان توسعه داده‌اید.

## ۳. فعالیت در GitHub

GitHub یکی از بهترین ابزارها برای نمایش مهارت‌های برنامه‌نویسی است. کد پروژه‌های خود را در مخازن مرتب قرار دهید و برای هر پروژه یک README مناسب بنویسید.

توضیحات پروژه باید شامل معرفی، تکنولوژی‌ها، روش اجرا و تصاویر یا لینک نسخه آنلاین باشد.

## ۴. پیدا کردن مشتری

برای شروع می‌توانید از شبکه‌های اجتماعی، سایت‌های فریلنسینگ، ارتباطات شخصی و شرکت‌های کوچک استفاده کنید.

به‌جای ارسال پیام‌های عمومی، برای هر مشتری توضیح دهید که چگونه می‌توانید به نیاز مشخص او پاسخ دهید.

## ۵. مذاکره و تعیین قیمت

قبل از شروع پروژه، محدوده کار، امکانات مورد نیاز، زمان تحویل و هزینه را مشخص کنید.

بهتر است توافق‌ها به‌صورت مکتوب باشند تا در ادامه پروژه اختلافی درباره امکانات یا تعهدات ایجاد نشود.

## ۶. تحویل حرفه‌ای پروژه

اولین پروژه فقط یک درآمد نیست؛ می‌تواند شروع ارتباط کاری بلندمدت باشد. کیفیت کد، ارتباط مناسب، تحویل به‌موقع و پشتیبانی مسئولانه می‌توانند باعث شوند مشتری شما را به دیگران معرفی کند.

در نهایت، منتظر کامل شدن تمام مهارت‌ها و نمونه‌کارهای خود نمانید. با آمادگی کافی شروع کنید، پروژه‌های کوچک بگیرید و هم‌زمان تجربه خود را افزایش دهید.
      `,
    },

    en: {
      title: "How to Get Your First Programming Project",
      shortDescription: "A guide to starting freelancing as a developer.",
      description: "Learn how to build a portfolio, present your skills and attract your first programming client.",
      content: `
Getting your first programming project is one of the most important and challenging steps in starting a career as a developer.

Many developers have good technical skills but do not know how to present their abilities to potential clients. You do not need years of professional experience to get started. What matters is demonstrating your ability to solve problems and build useful products.

## 1. Build a Practical Portfolio

Start by creating several practical projects. Instead of building only simple tutorial exercises, try to develop applications that resemble real products.

Examples include an online store, an educational website, or an administration dashboard.

## 2. Prepare a Professional Resume

Your resume should clearly present your skills, technologies, and completed projects.

For every project, explain the problem it solves, the technologies you used, and the parts you personally developed.

## 3. Use GitHub

GitHub is an excellent platform for showcasing your programming skills. Organize your repositories and create a useful README file for each project.

Include an introduction, technologies, setup instructions, screenshots, and a live demo link when available.

## 4. Find Potential Clients

You can start looking for clients through social media, freelance platforms, personal connections, and small businesses.

Avoid sending generic messages. Explain how your skills can solve a specific problem for each potential client.

## 5. Discuss Pricing and Requirements

Before starting a project, define its scope, required features, delivery timeline, and price.

Keep agreements in writing to avoid misunderstandings about responsibilities and expectations.

## 6. Deliver Professional Work

Your first project is more than a source of income. It can become the beginning of long-term professional relationships.

Good communication, clean code, on-time delivery, and responsible support can encourage clients to recommend your services.

You do not need to wait until every skill is perfect. Start with projects that match your current abilities and improve through real experience.
      `,
    },
  },

  {
    id: 20004,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/git.jpeg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/git.jpeg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author3.jpg",

    fa: {
      title: "چرا Git برای برنامه‌نویسان ضروری است؟",
      shortDescription: "اهمیت Git در پروژه‌های واقعی",
      description: "Git یکی از مهم‌ترین ابزارهای مدیریت کد و همکاری تیمی در پروژه‌های نرم‌افزاری است.",
      content: `
وقتی روی یک پروژه برنامه‌نویسی کار می‌کنید، تغییرات کد به‌مرور زیاد می‌شوند. ممکن است بخواهید به نسخه قبلی برگردید، چند قابلیت را هم‌زمان توسعه دهید یا با اعضای دیگر تیم همکاری کنید.

Git ابزاری است که این فرایندها را ساده‌تر و قابل مدیریت می‌کند.

## Git چیست؟

Git یک سیستم کنترل نسخه توزیع‌شده است که تغییرات فایل‌های پروژه را ثبت می‌کند. با استفاده از آن می‌توانید تاریخچه تغییرات را مشاهده کنید و در صورت نیاز به نسخه‌های قبلی برگردید.

## ۱. ثبت تغییرات با Commit

هر بار که یک بخش مشخص از کار را تکمیل می‌کنید، می‌توانید یک Commit ایجاد کنید.

Commit مانند یک نقطه ثبت‌شده در تاریخچه پروژه است و به شما کمک می‌کند بفهمید چه تغییراتی در چه زمانی انجام شده‌اند.

## ۲. کار با Branch

Branch به شما اجازه می‌دهد قابلیت جدیدی را بدون تغییر مستقیم شاخه اصلی پروژه توسعه دهید.

برای مثال، می‌توانید برای پیاده‌سازی سیستم ورود کاربران یک شاخه جداگانه ایجاد کنید و پس از تکمیل و تست، تغییرات را با شاخه اصلی ادغام کنید.

## ۳. همکاری تیمی

در پروژه‌های تیمی، اعضا می‌توانند روی بخش‌های مختلف پروژه کار کنند و تغییرات خود را از طریق Pull Request به اشتراک بگذارند.

این روش امکان بررسی کد، دریافت بازخورد و مدیریت بهتر تغییرات را فراهم می‌کند.

## ۴. دستورات پرکاربرد Git

برخی از دستورات مهم عبارت‌اند از:

- git init برای ایجاد مخزن جدید
- git add برای آماده‌سازی تغییرات
- git commit برای ثبت تغییرات
- git status برای مشاهده وضعیت فایل‌ها
- git push برای ارسال تغییرات به مخزن آنلاین
- git pull برای دریافت آخرین تغییرات
- git branch برای مدیریت شاخه‌ها

## ۵. Git و GitHub چه تفاوتی دارند؟

Git یک ابزار کنترل نسخه است، اما GitHub پلتفرمی آنلاین برای میزبانی مخازن Git و همکاری توسعه‌دهندگان است.

با استفاده از GitHub می‌توانید پروژه‌های خود را منتشر کنید، با دیگران همکاری کنید و نمونه‌کارهای خود را در معرض دید کارفرمایان قرار دهید.

در نهایت، یادگیری Git فقط برای پروژه‌های بزرگ نیست. حتی در پروژه‌های شخصی نیز استفاده از آن به شما کمک می‌کند کدهای خود را منظم‌تر و حرفه‌ای‌تر مدیریت کنید.
      `,
    },

    en: {
      title: "Why Git Is Essential for Developers",
      shortDescription: "Why Git matters in real-world projects.",
      description: "Git is one of the most important tools for version control and collaboration in software projects.",
      content: `
As you work on a programming project, code changes become more frequent. You may need to restore an earlier version, develop multiple features, or collaborate with other developers.

Git makes these tasks easier to manage.

## What Is Git?

Git is a distributed version control system that tracks changes in your project files. It allows you to review the history of your work and restore previous versions when necessary.

## 1. Track Changes with Commits

Whenever you complete a meaningful part of your work, you can create a commit.

A commit is a recorded point in your project's history. It helps you understand what changed and when the change was made.

## 2. Work with Branches

Branches allow you to develop new features without directly modifying the main branch.

For example, you can create a separate branch for implementing user authentication. After completing and testing the feature, you can merge it into the main branch.

## 3. Team Collaboration

In team projects, developers can work on different parts of the application and share their changes through pull requests.

This makes code reviews, feedback, and change management easier.

## 4. Useful Git Commands

Some important commands include:

- git init: Create a new repository.
- git add: Stage changes.
- git commit: Save changes to history.
- git status: Check the current repository state.
- git push: Upload local changes.
- git pull: Download the latest changes.
- git branch: Manage branches.

## 5. Git vs. GitHub

Git is a version control tool, while GitHub is an online platform for hosting Git repositories and collaborating with developers.

You can use GitHub to publish projects, work with other developers, and showcase your portfolio.

Learning Git is useful even for personal projects. It helps you manage code in a more organized and professional way.
      `,
    },
  },

  {
    id: 20005,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/api.jpeg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/api.jpeg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author4.jpg",

    fa: {
      title: "API چیست؟",
      shortDescription: "آشنایی ساده با API",
      description: "در این مقاله مفهوم API، نحوه ارتباط frontend و backend و ساختار درخواست‌های HTTP را بررسی می‌کنیم.",
      content: `
در دنیای توسعه نرم‌افزار، برنامه‌های مختلف برای تبادل اطلاعات به راهی استاندارد نیاز دارند. API یکی از مفاهیم اصلی است که این ارتباط را امکان‌پذیر می‌کند.

## API چیست؟

API مخفف Application Programming Interface است. API مجموعه‌ای از قوانین و روش‌هاست که به دو نرم‌افزار اجازه می‌دهد با یکدیگر ارتباط برقرار کنند.

برای مثال، وقتی در یک فروشگاه اینترنتی فهرست محصولات را مشاهده می‌کنید، فرانت‌اند اطلاعات محصولات را از طریق یک API از بک‌اند دریافت می‌کند.

## ۱. ارتباط Frontend و Backend

در یک برنامه وب، فرانت‌اند مسئول نمایش رابط کاربری و تعامل با کاربر است. بک‌اند نیز منطق اصلی برنامه، دسترسی به دیتابیس و پردازش درخواست‌ها را مدیریت می‌کند.

API مانند یک پل ارتباطی بین این دو بخش عمل می‌کند.

## ۲. درخواست‌های HTTP

برای ارتباط با API معمولاً از متدهای HTTP استفاده می‌شود:

- GET برای دریافت اطلاعات
- POST برای ایجاد اطلاعات جدید
- PUT برای جایگزینی اطلاعات
- PATCH برای ویرایش بخشی از اطلاعات
- DELETE برای حذف اطلاعات

## ۳. ساختار یک Endpoint

هر Endpoint آدرسی مشخص برای دسترسی به یک منبع یا عملیات است.

برای مثال:

GET /api/products

این درخواست می‌تواند فهرست محصولات را برگرداند.

همچنین:

POST /api/products

می‌تواند برای ایجاد محصول جدید استفاده شود.

## ۴. فرمت JSON

بسیاری از APIهای امروزی اطلاعات را با فرمت JSON ارسال و دریافت می‌کنند.

برای مثال:

{
  "id": 1,
  "name": "Laptop",
  "price": 1200
}

JSON ساختاری ساده و قابل استفاده در زبان‌های برنامه‌نویسی مختلف دارد.

## ۵. مدیریت خطا و Status Code

API باید نتیجه درخواست را به شکل مشخصی برگرداند. کدهای وضعیت HTTP به فرانت‌اند کمک می‌کنند نتیجه عملیات را تشخیص دهد.

برای مثال، کد 200 نشان‌دهنده موفقیت درخواست، 201 نشان‌دهنده ایجاد موفق منبع و 404 نشان‌دهنده پیدا نشدن منبع است.

در نهایت، درک API برای هر توسعه‌دهنده وب ضروری است؛ زیرا تقریباً تمام برنامه‌های مدرن برای تبادل اطلاعات به این ساختار وابسته هستند.
      `,
    },

    en: {
      title: "What Is an API?",
      shortDescription: "A simple introduction to APIs.",
      description: "Learn what APIs are and how frontend and backend applications communicate through HTTP requests.",
      content: `
Modern software applications need a standard way to exchange information. APIs provide one of the most important ways to make this communication possible.

## What Is an API?

API stands for Application Programming Interface. It is a set of rules and methods that allows different software applications to communicate.

For example, when you view products in an online store, the frontend retrieves product information from the backend through an API.

## 1. Frontend and Backend Communication

In a web application, the frontend handles the user interface and interactions. The backend manages business logic, database access, and request processing.

An API acts as a communication bridge between these two parts.

## 2. HTTP Methods

APIs commonly use HTTP methods to perform different operations:

- GET retrieves information.
- POST creates new information.
- PUT replaces an existing resource.
- PATCH updates part of a resource.
- DELETE removes a resource.

## 3. Understanding Endpoints

An endpoint is a specific URL used to access a resource or perform an operation.

For example:

GET /api/products

This request may return a list of products.

Another example:

POST /api/products

This endpoint may create a new product.

## 4. JSON Format

Many modern APIs exchange information using JSON.

For example:

{
  "id": 1,
  "name": "Laptop",
  "price": 1200
}

JSON is a simple data format supported by many programming languages.

## 5. Error Handling and Status Codes

An API should return a clear result for each request. HTTP status codes help the frontend understand what happened.

For example, 200 indicates success, 201 indicates successful resource creation, and 404 means the requested resource was not found.

Understanding APIs is essential for web developers because almost every modern application relies on them to exchange data.
      `,
    },
  },

  {
    id: 20006,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/jwt.png",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/jwt.png",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author5.jpg",

    fa: {
      title: "JWT چیست و چگونه کار می‌کند؟",
      shortDescription: "آشنایی با Authentication با JWT",
      description: "JWT یکی از روش‌های رایج برای پیاده‌سازی احراز هویت در APIهاست.",
      content: `
احراز هویت یکی از بخش‌های مهم هر برنامه وب است. کاربران باید بتوانند وارد حساب کاربری خود شوند و برنامه نیز باید بتواند هویت آن‌ها را در درخواست‌های بعدی تشخیص دهد.

JWT یکی از روش‌های متداول برای انتقال اطلاعات مربوط به هویت کاربر است.

## JWT چیست؟

JWT مخفف JSON Web Token است. این استاندارد روشی برای انتقال اطلاعاتی به نام Claim بین دو طرف فراهم می‌کند.

توکن معمولاً پس از ورود موفق کاربر توسط سرور ایجاد می‌شود و در درخواست‌های بعدی برای شناسایی کاربر ارسال می‌شود.

## ۱. ساختار JWT

یک JWT معمولاً از سه بخش تشکیل شده است:

- Header: اطلاعات مربوط به نوع توکن و الگوریتم امضا
- Payload: اطلاعات یا Claimهای مربوط به توکن
- Signature: امضایی برای بررسی اعتبار و یکپارچگی توکن

این سه بخش با نقطه از یکدیگر جدا می‌شوند.

## ۲. فرایند ورود با JWT

ابتدا کاربر اطلاعات ورود خود را ارسال می‌کند. سرور اطلاعات را بررسی می‌کند و در صورت معتبر بودن، یک توکن امضاشده تولید می‌کند.

سپس کلاینت توکن را در درخواست‌های بعدی ارسال می‌کند. سرور نیز امضای آن را بررسی می‌کند تا از اعتبار توکن مطمئن شود.

## ۳. ارسال توکن در درخواست‌ها

یکی از روش‌های رایج، ارسال توکن در هدر Authorization است:

Authorization: Bearer YOUR_TOKEN

سرور با بررسی این هدر می‌تواند درخواست را به کاربر احراز هویت‌شده مرتبط کند.

## ۴. نکات امنیتی

اطلاعات Payload به‌صورت معمول رمزنگاری نمی‌شوند و صرفاً با Base64URL کدگذاری شده‌اند. بنابراین نباید اطلاعات حساس مانند رمز عبور را داخل آن قرار دهید.

همچنین باید از کلید امضای امن استفاده کنید، زمان انقضای مناسبی تعیین کنید و روش نگهداری توکن را با توجه به مدل امنیتی برنامه انتخاب کنید.

## ۵. انقضای توکن و Refresh Token

توکن‌های دسترسی معمولاً عمر محدودی دارند. پس از انقضا، کاربر باید دوباره احراز هویت شود یا در صورت وجود مکانیزم Refresh Token، توکن دسترسی جدید دریافت کند.

در نهایت، JWT ابزار مفیدی برای پیاده‌سازی احراز هویت است؛ اما امنیت برنامه فقط به استفاده از JWT وابسته نیست و طراحی صحیح کل فرایند اهمیت دارد.
      `,
    },

    en: {
      title: "What Is JWT and How Does It Work?",
      shortDescription: "Learn authentication with JWT.",
      description: "JWT is a common approach for implementing authentication in modern APIs.",
      content: `
Authentication is an important part of every web application. Users need to sign in, and the application must recognize their identity in future requests.

JWT is a common method for transferring information related to user identity.

## What Is JWT?

JWT stands for JSON Web Token. It is a standard for securely transmitting information called claims between parties.

A token is usually created by the server after a successful login and sent with future requests.

## 1. JWT Structure

A JWT typically consists of three parts:

- Header: Contains information about the token type and signing algorithm.
- Payload: Contains claims and token information.
- Signature: Helps verify the token's integrity and authenticity.

These parts are separated by dots.

## 2. The Login Process

First, the user submits their login credentials. The server validates them and creates a signed token.

The client then sends this token with future requests. The server verifies its signature before accepting the request.

## 3. Sending the Token

A common approach is to send the token through the Authorization header:

Authorization: Bearer YOUR_TOKEN

The server can use this header to identify the authenticated user.

## 4. Security Considerations

JWT payloads are generally encoded, not encrypted. Therefore, you should never store sensitive information such as passwords inside them.

Use a secure signing key, set an appropriate expiration time, and choose a token storage strategy that matches your application's security requirements.

## 5. Token Expiration and Refresh Tokens

Access tokens usually have a limited lifetime. After expiration, users may need to authenticate again or use a refresh token to obtain a new access token.

JWT is a useful authentication tool, but application security depends on the design of the entire authentication process.
      `,
    },
  },

  {
    id: 20007,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/prisma.jpeg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/prisma.jpeg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author6.jpg",

    fa: {
      title: "Prisma چیست؟",
      shortDescription: "آشنایی با Prisma ORM",
      description: "Prisma یکی از ORMهای محبوب برای کار با دیتابیس در پروژه‌های TypeScript و Node.js است.",
      content: `
در پروژه‌های بک‌اند، ارتباط با دیتابیس یکی از بخش‌های اصلی توسعه نرم‌افزار است. برنامه‌نویسان برای خواندن، ایجاد، ویرایش و حذف اطلاعات به ابزارهایی نیاز دارند که کار با دیتابیس را ساده‌تر و قابل مدیریت‌تر کنند.

Prisma یکی از ابزارهای محبوب در اکوسیستم Node.js و TypeScript است.

## Prisma چیست؟

Prisma یک ORM مدرن است که به توسعه‌دهندگان اجازه می‌دهد با استفاده از کد TypeScript و JavaScript با دیتابیس ارتباط برقرار کنند.

به‌جای نوشتن مستقیم تمام Queryهای SQL، می‌توانید از Prisma Client برای اجرای عملیات دیتابیس استفاده کنید.

## ۱. تعریف مدل‌ها با Prisma Schema

در Prisma ساختار داده‌ها در فایلی به نام schema.prisma تعریف می‌شود.

برای مثال:

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}

این مدل ساختار جدول کاربران را مشخص می‌کند.

## ۲. Prisma Client

Prisma Client ابزاری است که از روی Schema تولید می‌شود و امکان اجرای Queryهای Type-safe را فراهم می‌کند.

برای مثال:

const users = await prisma.user.findMany();

این دستور تمام کاربران را از دیتابیس دریافت می‌کند.

## ۳. Migration چیست؟

وقتی ساختار مدل‌های دیتابیس را تغییر می‌دهید، باید تغییرات را در دیتابیس نیز اعمال کنید.

Migrationها تاریخچه تغییرات ساختار دیتابیس را نگهداری می‌کنند و امکان مدیریت نسخه‌های مختلف Schema را فراهم می‌کنند.

## ۴. ارتباط بین مدل‌ها

Prisma از ارتباط‌های مختلف مانند One-to-One، One-to-Many و Many-to-Many پشتیبانی می‌کند.

برای مثال، یک کاربر می‌تواند چندین سفارش داشته باشد. این ارتباط را می‌توان با تعریف Relation بین مدل User و Order پیاده‌سازی کرد.

## ۵. مزایای Prisma

- پشتیبانی مناسب از TypeScript
- کاهش خطاهای مرتبط با Queryها
- مدیریت ساختار دیتابیس با Migration
- خوانایی بهتر کدهای دیتابیس
- پشتیبانی از چندین دیتابیس رابطه‌ای

در نهایت، Prisma می‌تواند فرایند توسعه بک‌اند را سریع‌تر و منظم‌تر کند؛ البته آشنایی با SQL و مفاهیم دیتابیس همچنان ضروری است.
      `,
    },

    en: {
      title: "What Is Prisma?",
      shortDescription: "An introduction to Prisma ORM.",
      description: "Prisma is a popular ORM for working with databases in TypeScript and Node.js applications.",
      content: `
Database access is an essential part of backend development. Applications need tools to create, read, update, and delete data efficiently.

Prisma is a popular tool in the Node.js and TypeScript ecosystem.

## What Is Prisma?

Prisma is a modern ORM that allows developers to interact with databases using JavaScript and TypeScript.

Instead of writing every SQL query manually, you can use Prisma Client to perform database operations.

## 1. Define Models with Prisma Schema

Prisma uses a file called schema.prisma to define your data models.

For example:

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}

This model describes the structure of a user table.

## 2. Prisma Client

Prisma Client is generated from your schema and provides type-safe database queries.

For example:

const users = await prisma.user.findMany();

This query retrieves all users from the database.

## 3. What Are Migrations?

When you change your database models, those changes must also be applied to the actual database.

Migrations keep track of schema changes and help manage different versions of your database structure.

## 4. Model Relationships

Prisma supports One-to-One, One-to-Many, and Many-to-Many relationships.

For example, one user can have multiple orders. You can represent this relationship by defining relations between User and Order models.

## 5. Benefits of Prisma

- Strong TypeScript support
- Fewer query-related errors
- Database schema management through migrations
- More readable database code
- Support for multiple relational databases

Prisma can make backend development faster and more organized. However, understanding SQL and database fundamentals is still important.
      `,
    },
  },

  {
    id: 20008,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/postgresql.jpg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/postgresql.jpg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author7.jpg",

    fa: {
      title: "چرا PostgreSQL انتخاب خوبی است؟",
      shortDescription: "مزایای PostgreSQL برای پروژه‌های واقعی",
      description: "PostgreSQL یک دیتابیس قدرتمند و قابل اعتماد برای بسیاری از پروژه‌های نرم‌افزاری است.",
      content: `
انتخاب دیتابیس مناسب یکی از تصمیم‌های مهم در طراحی بک‌اند است. دیتابیس باید بتواند اطلاعات را به شکل قابل اعتماد ذخیره کند و در زمان نیاز آن‌ها را در اختیار برنامه قرار دهد.

PostgreSQL یکی از سیستم‌های مدیریت دیتابیس رابطه‌ای قدرتمند و متن‌باز است که در پروژه‌های کوچک و بزرگ استفاده می‌شود.

## PostgreSQL چیست؟

PostgreSQL یک سیستم مدیریت دیتابیس رابطه‌ای است که از SQL برای مدیریت و جست‌وجوی داده‌ها استفاده می‌کند.

این دیتابیس امکانات پیشرفته‌ای برای مدیریت اطلاعات، تعریف ارتباط بین جدول‌ها و اجرای Queryهای پیچیده ارائه می‌دهد.

## ۱. یکپارچگی اطلاعات

یکی از ویژگی‌های مهم PostgreSQL پشتیبانی از Constraintها و کلیدهای خارجی است.

این قابلیت‌ها کمک می‌کنند ارتباط بین اطلاعات حفظ شود و داده‌های نامعتبر وارد دیتابیس نشوند.

## ۲. پشتیبانی از Transaction

Transaction مجموعه‌ای از عملیات دیتابیس است که می‌توان آن‌ها را به‌صورت یک واحد منطقی اجرا کرد.

برای مثال، هنگام انتقال موجودی بین دو حساب، لازم است هر دو عملیات با موفقیت انجام شوند؛ در غیر این صورت باید تغییرات بازگردانده شوند.

## ۳. امنیت و مدیریت دسترسی

PostgreSQL امکاناتی برای تعریف کاربران، نقش‌ها و سطح دسترسی ارائه می‌دهد.

با تنظیم صحیح دسترسی‌ها می‌توان مشخص کرد هر کاربر یا سرویس اجازه انجام چه عملیاتی روی اطلاعات را دارد.

## ۴. کار با داده‌های متنوع

PostgreSQL علاوه بر داده‌های رابطه‌ای، امکاناتی مانند JSONB را نیز ارائه می‌دهد.

JSONB برای ذخیره و جست‌وجوی داده‌های ساختاریافته JSON کاربرد دارد.

## ۵. چه زمانی از PostgreSQL استفاده کنیم؟

این دیتابیس برای فروشگاه‌های اینترنتی، سامانه‌های آموزشی، سیستم‌های مالی، پنل‌های مدیریتی و بسیاری از برنامه‌های وب انتخاب مناسبی است.

البته انتخاب دیتابیس باید با توجه به نیاز پروژه، حجم اطلاعات، نوع Queryها و شرایط نگهداری انجام شود.

در نهایت، PostgreSQL ترکیبی از قابلیت‌های قدرتمند، پایداری و انعطاف‌پذیری را در اختیار توسعه‌دهندگان قرار می‌دهد.
      `,
    },

    en: {
      title: "Why Choose PostgreSQL?",
      shortDescription: "Why PostgreSQL is great for real-world projects.",
      description: "PostgreSQL is a powerful and reliable relational database for many types of software applications.",
      content: `
Choosing the right database is an important decision in backend development. A database must store information reliably and make it available whenever an application needs it.

PostgreSQL is a powerful open-source relational database management system used in projects of many different sizes.

## What Is PostgreSQL?

PostgreSQL is a relational database management system that uses SQL to manage and query data.

It provides advanced features for storing information, defining relationships, and executing complex queries.

## 1. Data Integrity

PostgreSQL supports constraints and foreign keys.

These features help maintain relationships between records and prevent invalid data from entering the database.

## 2. Transaction Support

A transaction is a group of database operations treated as one logical unit.

For example, transferring money between two accounts requires both operations to succeed. Otherwise, the changes should be rolled back.

## 3. Security and Access Control

PostgreSQL provides tools for managing users, roles, and permissions.

With proper configuration, you can control which operations each user or service is allowed to perform.

## 4. Working with Different Data Types

Besides relational data, PostgreSQL supports features such as JSONB.

JSONB is useful for storing and querying structured JSON data.

## 5. When Should You Use PostgreSQL?

PostgreSQL is suitable for online stores, educational platforms, financial systems, administration dashboards, and many web applications.

However, database selection should depend on project requirements, data volume, query patterns, and maintenance needs.

PostgreSQL offers a strong combination of reliability, flexibility, and advanced database capabilities.
      `,
    },
  },

  {
    id: 20009,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/resume.png",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/resume.png",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author8.png",

    fa: {
      title: "چطور یک رزومه برنامه‌نویسی حرفه‌ای بسازیم؟",
      shortDescription: "ساخت رزومه مناسب برای استخدام و فریلنسینگ",
      description: "در این مقاله مهم‌ترین بخش‌های یک رزومه حرفه‌ای برنامه‌نویسی را بررسی می‌کنیم.",
      content: `
رزومه یکی از اولین راه‌های معرفی شما به کارفرما یا مشتری است. یک رزومه مناسب باید در مدت کوتاهی نشان دهد که چه مهارت‌هایی دارید، روی چه پروژه‌هایی کار کرده‌اید و چه ارزشی می‌توانید ایجاد کنید.

برای ساخت رزومه برنامه‌نویسی، لازم نیست طراحی پیچیده‌ای داشته باشید. مهم‌تر از ظاهر، وضوح اطلاعات و ارتباط آن‌ها با موقعیت شغلی مورد نظر است.

## ۱. اطلاعات و معرفی کوتاه

در ابتدای رزومه، نام، اطلاعات تماس، لینک GitHub و در صورت وجود لینک وب‌سایت شخصی خود را قرار دهید.

یک معرفی کوتاه بنویسید که تخصص، حوزه علاقه‌مندی و مسیر حرفه‌ای شما را مشخص کند.

## ۲. مهارت‌های فنی

مهارت‌های خود را دسته‌بندی کنید تا خواندن آن‌ها آسان باشد.

برای مثال:

- Frontend: HTML, CSS, JavaScript, React, Next.js
- Backend: Node.js, Express
- Database: PostgreSQL, Prisma
- Tools: Git, GitHub, Postman

فقط مهارت‌هایی را وارد کنید که واقعاً با آن‌ها کار کرده‌اید.

## ۳. معرفی پروژه‌ها

بخش پروژه‌ها یکی از مهم‌ترین قسمت‌های رزومه برنامه‌نویس است.

برای هر پروژه نام، توضیح کوتاه، تکنولوژی‌های استفاده‌شده و لینک مشاهده یا کد پروژه را قرار دهید.

بهتر است توضیحات به‌جای بیان کلی، روی کاری که انجام داده‌اید و مشکلی که حل کرده‌اید تمرکز داشته باشند.

## ۴. تجربه کاری

اگر تجربه کاری رسمی ندارید، می‌توانید پروژه‌های شخصی، همکاری‌های مستقل و فعالیت‌های آموزشی مرتبط را معرفی کنید.

درباره تجربه‌ها صادق باشید و پروژه تمرینی را به‌عنوان سابقه استخدام رسمی معرفی نکنید.

## ۵. نکات مهم در طراحی رزومه

- از متن‌های طولانی و غیرضروری پرهیز کنید.
- اطلاعات تماس و لینک‌ها را قابل مشاهده قرار دهید.
- رزومه را متناسب با موقعیت شغلی تنظیم کنید.
- از غلط‌های املایی و نگارشی جلوگیری کنید.
- نسخه PDF نهایی را بررسی کنید.

## ۶. به‌روزرسانی مداوم

رزومه یک سند ثابت نیست. با یادگیری مهارت‌های جدید و تکمیل پروژه‌ها باید آن را به‌روزرسانی کنید.

در نهایت، یک رزومه حرفه‌ای قرار نیست تمام توانایی‌های شما را توضیح دهد؛ بلکه باید کارفرما را ترغیب کند تا نمونه‌کارها را ببیند و برای گفت‌وگو با شما اقدام کند.
      `,
    },

    en: {
      title: "How to Build a Professional Developer Resume",
      shortDescription: "Build a resume for jobs and freelancing.",
      description: "Learn which sections and projects can make a developer resume stronger for jobs and freelance work.",
      content: `
A resume is one of the first ways to introduce yourself to an employer or client. A good resume should quickly explain your skills, projects, and the value you can provide.

You do not need a complicated design. Clear and relevant information is more important than visual effects.

## 1. Contact Information and Summary

Start with your name, contact details, GitHub profile, and personal website if available.

Write a short professional summary that describes your skills, interests, and career direction.

## 2. Technical Skills

Organize your technical skills into categories to make them easier to read.

For example:

- Frontend: HTML, CSS, JavaScript, React, Next.js
- Backend: Node.js, Express
- Database: PostgreSQL, Prisma
- Tools: Git, GitHub, Postman

Only include technologies you have actually worked with.

## 3. Project Portfolio

The projects section is one of the most important parts of a developer resume.

For each project, include its name, a short description, the technologies used, and a link to the live version or source code.

Focus on what you built and the problems you solved instead of using vague descriptions.

## 4. Work Experience

If you do not have formal work experience, you can include personal projects, freelance collaborations, and relevant educational activities.

Be honest about your experience and do not present practice projects as formal employment.

## 5. Resume Design Tips

- Avoid unnecessary long descriptions.
- Make contact details and links easy to find.
- Tailor your resume to the position.
- Check spelling and grammar.
- Review the final PDF before sending it.

## 6. Keep It Updated

A resume should evolve as you gain new skills and complete projects.

A professional resume does not need to explain everything about you. Its purpose is to encourage employers to review your work and contact you for an interview.
      `,
    },
  },

  {
    id: 20010,
    coverImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/fullstackdeveloper.jpeg",
    blogImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/fullstackdeveloper.jpeg",
    author: "تیم تحریریه هگزا اسکواد",
    authorImage: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/blogs/author9.jpg",

    fa: {
      title: "Full Stack Developer چیست؟",
      shortDescription: "مسیر تبدیل شدن به یک برنامه‌نویس Full Stack",
      description: "در این مقاله مهارت‌های مورد نیاز یک Full Stack Developer و مسیر یادگیری آن را بررسی می‌کنیم.",
      content: `
در دنیای توسعه وب، یک وب‌سایت یا اپلیکیشن معمولاً از دو بخش اصلی تشکیل می‌شود: فرانت‌اند و بک‌اند. هرکدام از این بخش‌ها وظایف متفاوتی دارند و برای ساخت یک محصول کامل باید با یکدیگر هماهنگ باشند.

Full Stack Developer توسعه‌دهنده‌ای است که می‌تواند در هر دو بخش فرانت‌اند و بک‌اند فعالیت کند.

## ۱. توسعه Frontend

فرانت‌اند بخشی از برنامه است که کاربر آن را مشاهده می‌کند و با آن تعامل دارد.

توسعه‌دهنده فرانت‌اند با HTML، CSS و JavaScript ساختار و رفتار رابط کاربری را پیاده‌سازی می‌کند.

ابزارهایی مانند React و Next.js نیز برای ساخت رابط‌های کاربری پیچیده و برنامه‌های مدرن استفاده می‌شوند.

## ۲. توسعه Backend

بک‌اند مسئول منطق اصلی برنامه، مدیریت کاربران، پردازش درخواست‌ها و ارتباط با دیتابیس است.

در این بخش می‌توانید از Node.js و Express برای ساخت API استفاده کنید.

همچنین باید با مفاهیمی مانند احراز هویت، اعتبارسنجی اطلاعات، مدیریت خطا و امنیت آشنا باشید.

## ۳. آشنایی با دیتابیس

هر برنامه کاربردی برای ذخیره و مدیریت اطلاعات به دیتابیس نیاز دارد.

یادگیری SQL و کار با دیتابیس‌هایی مانند PostgreSQL به شما کمک می‌کند ساختار اطلاعات و ارتباط بین داده‌ها را بهتر طراحی کنید.

ابزارهایی مانند Prisma نیز می‌توانند ارتباط بین برنامه و دیتابیس را ساده‌تر کنند.

## ۴. اتصال Frontend و Backend

یکی از مهم‌ترین وظایف یک Full Stack Developer، اتصال درست دو بخش برنامه است.

فرانت‌اند از طریق API درخواست ارسال می‌کند و بک‌اند پس از پردازش، پاسخ مناسب را برمی‌گرداند.

در این مرحله باید مدیریت Loading، Error، Authentication و داده‌های دریافتی را به‌درستی انجام دهید.

## ۵. مهارت‌های تکمیلی

علاوه بر مهارت‌های اصلی، آشنایی با Git، GitHub، تست نرم‌افزار، Docker و مفاهیم Deployment می‌تواند به شما در توسعه و نگهداری پروژه‌های واقعی کمک کند.

## ۶. چگونه Full Stack Developer شویم؟

بهتر است ابتدا مبانی وب را یاد بگیرید، سپس در یکی از بخش‌های فرانت‌اند یا بک‌اند مهارت عمیق‌تری کسب کنید و در ادامه بخش دیگر را یاد بگیرید.

پس از آن با ساخت یک پروژه کامل، تمام بخش‌ها را به یکدیگر متصل کنید.

در نهایت، Full Stack Developer بودن به معنی حفظ کردن تعداد زیادی تکنولوژی نیست؛ بلکه توانایی درک ساختار یک محصول و توسعه بخش‌های مختلف آن برای حل یک مسئله واقعی است.
      `,
    },

    en: {
      title: "What Is a Full Stack Developer?",
      shortDescription: "A roadmap to becoming a full-stack developer.",
      description: "Learn what skills a full-stack developer needs and how to build a practical learning roadmap.",
      content: `
A web application usually consists of two main parts: frontend and backend. Each part has different responsibilities, and they must work together to create a complete product.

A Full Stack Developer is a developer who can work on both frontend and backend development.

## 1. Frontend Development

The frontend is the part of an application that users see and interact with.

Frontend developers use HTML, CSS, and JavaScript to build the structure, design, and behavior of user interfaces.

Tools such as React and Next.js are commonly used to build modern and complex interfaces.

## 2. Backend Development

The backend manages application logic, users, request processing, and database communication.

You can use Node.js and Express to build APIs.

You should also understand authentication, validation, error handling, and security.

## 3. Understanding Databases

Applications need databases to store and manage information.

Learning SQL and working with databases such as PostgreSQL helps you design data structures and relationships.

Tools such as Prisma can simplify communication between your application and database.

## 4. Connecting Frontend and Backend

One of the most important responsibilities of a Full Stack Developer is connecting both parts of an application.

The frontend sends requests through APIs, and the backend processes them and returns appropriate responses.

You should understand loading states, error handling, authentication, and data management.

## 5. Additional Skills

In addition to core development skills, learning Git, GitHub, software testing, Docker, and deployment concepts can help you build and maintain real-world applications.

## 6. How to Become a Full Stack Developer

Start with web fundamentals, then build stronger skills in either frontend or backend development before learning the other side.

After that, create a complete project that connects all these technologies.

Being a Full Stack Developer is not about memorizing many technologies. It is about understanding how a product works and being able to develop different parts of it to solve real problems.
      `,
    },
  },
];



async function createCourseContent(
  courseId: number,
  faCourseTitle: string,
  enCourseTitle: string
) {
  const sections = [
    {
      faTitle: "مقدماتی",
      enTitle: "Fundamentals",

      lessons: [
        {
          faTitle: `آشنایی با ${faCourseTitle}`,
          enTitle: `Introduction to ${enCourseTitle}`,
          duration: 20,
        },
        {
          faTitle: "مفاهیم پایه",
          enTitle: "Core Concepts",
          duration: 25,
        },
        {
          faTitle: "راه‌اندازی محیط پروژه",
          enTitle: "Project Setup",
          duration: 18,
        },
      ],
    },

    {
      faTitle: "مفاهیم کاربردی",
      enTitle: "Practical Concepts",

      lessons: [
        {
          faTitle: "کار با مفاهیم اصلی",
          enTitle: "Working With Core Concepts",
          duration: 30,
        },
        {
          faTitle: "ساخت یک پروژه عملی",
          enTitle: "Building a Practical Project",
          duration: 35,
        },
        {
          faTitle: "بهترین روش‌های توسعه",
          enTitle: "Development Best Practices",
          duration: 25,
        },
      ],
    },

    {
      faTitle: "پروژه نهایی",
      enTitle: "Final Project",

      lessons: [
        {
          faTitle: "شروع پروژه نهایی",
          enTitle: "Starting the Final Project",
          duration: 30,
        },
        {
          faTitle: "تکمیل پروژه",
          enTitle: "Completing the Project",
          duration: 40,
        },
      ],
    },
  ];

  await prisma.section.deleteMany({
    where: {
      courseId,
    },
  });

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const sectionData = sections[sectionIndex];

    if(!sectionData){
      throw new Error(`section data not found at index ${sectionIndex}`)
    }

    const section = await prisma.section.create({
      data: {
        courseId,
        order: sectionIndex + 1,

        translations: {
          create: [
            {
              language: Language.FA,
              title: sectionData.faTitle,
            },
            {
              language: Language.EN,
              title: sectionData.enTitle,
            },
          ],
        },
      },
    });

    for (
      let lessonIndex = 0;
      lessonIndex < sectionData.lessons.length;
      lessonIndex++
    ) {
      const lessonData = sectionData.lessons[lessonIndex];

      if (!lessonData) {
          throw new Error(
              `Lesson data not found at index ${lessonIndex}`
          );
      }

      await prisma.lesson.create({
        data: {
          sectionId: section.id,
          order: lessonIndex + 1,
          duration: lessonData.duration,

          translations: {
            create: [
              {
                language: Language.FA,
                title: lessonData.faTitle,
              },
              {
                language: Language.EN,
                title: lessonData.enTitle,
              },
            ],
          },
        },
      });
    }
  }
}


async function main() {
  

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const studentUser = await prisma.user.upsert({
    where: {
      email: "student@hexasquad.com",
    },

    update: {
      name: "Nazanin Student",
      password: hashedPassword,
      role: Role.STUDENT,
      avatar: "https://i.pravatar.cc/150?img=47",
    },

    create: {
      name: "Nazanin Student",
      email: "student@hexasquad.com",
      password: hashedPassword,
      role: Role.STUDENT,
      avatar: "https://i.pravatar.cc/150?img=47",
    },
  });

type TeacherSeed = {
  email: string
  nameFa: string
  nameEn: string
  bioFa: string
  bioEn: string
  avatar: string
}

const teacherSeeds: TeacherSeed[] = [
  {
    email: "teacher@hexasquad.com",
    nameFa: "علی امینی",
    nameEn: "Ali Amini",
    bioFa: "مدرس و توسعه‌دهنده Full Stack با تجربه در ساخت پروژه‌های واقعی وب.",
    bioEn: "Full-stack developer and instructor experienced in building real-world web applications.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/ali.jpg",
  },
  {
    email: "teacher2@hexasquad.com",
    nameFa: "سارا احمدی",
    nameEn: "Sara Ahmadi",
    bioFa: "توسعه‌دهنده و مدرس حوزه برنامه‌نویسی وب و نرم‌افزار.",
    bioEn: "Web and software developer and instructor.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/sara.jpg",
  },
  {
    email: "teacher3@hexasquad.com",
    nameFa: "رضا محمدی",
    nameEn: "Reza Mohammadi",
    bioFa: "متخصص توسعه نرم‌افزار و آموزش برنامه‌نویسی کاربردی.",
    bioEn: "Software developer specializing in practical programming education.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/reza.jpg",
  },
  {
    email: "teacher4@hexasquad.com",
    nameFa: "مریم حسینی",
    nameEn: "Maryam Hosseini",
    bioFa: "مدرس و توسعه‌دهنده نرم‌افزار با تمرکز بر پروژه‌های واقعی.",
    bioEn: "Software developer and instructor focused on real-world projects.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/maryam.jpg",
  },
  {
    email: "teacher5@hexasquad.com",
    nameFa: "امیر کریمی",
    nameEn: "Amir Karimi",
    bioFa: "توسعه‌دهنده Full Stack و مدرس مباحث پیشرفته وب.",
    bioEn: "Full-stack developer and instructor focused on advanced web development.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/amir.jpg",
  },
  {
    email: "teacher6@hexasquad.com",
    nameFa: "نیلوفر رحیمی",
    nameEn: "Niloofar Rahimi",
    bioFa: "مدرس و متخصص تحلیل داده و برنامه‌نویسی پایتون.",
    bioEn: "Instructor specializing in data analysis and Python programming.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/nilufar.jpg",
  },
  {
    email: "teacher7@hexasquad.com",
    nameFa: "آرمان جعفری",
    nameEn: "Arman Jafari",
    bioFa: "توسعه‌دهنده نرم‌افزار و مدرس مباحث مهندسی نرم‌افزار.",
    bioEn: "Software developer and instructor focused on software engineering.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/arman.jpg",
  },
  {
    email: "teacher8@hexasquad.com",
    nameFa: "سحر مرادی",
    nameEn: "Sahar Moradi",
    bioFa: "مدرس طراحی و توسعه اپلیکیشن‌های مدرن وب.",
    bioEn: "Instructor specializing in modern web application development.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/sahar.jpg",
  },
  {
    email: "teacher9@hexasquad.com",
    nameFa: "محمد رضایی",
    nameEn: "Mohammad Rezaei",
    bioFa: "توسعه‌دهنده Backend و مدرس معماری نرم‌افزار.",
    bioEn: "Backend developer and instructor specializing in software architecture.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/mohammad.jpg",
  },
  {
    email: "teacher10@hexasquad.com",
    nameFa: "الهه احمدی",
    nameEn: "Elahe Ahmadi",
    bioFa: "مدرس برنامه‌نویسی و توسعه نرم‌افزارهای کاربردی.",
    bioEn: "Programming instructor focused on practical software development.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/elahe.jpg",
  },
  {
    email: "teacher11@hexasquad.com",
    nameFa: "پارسا کاظمی",
    nameEn: "Parsa Kazemi",
    bioFa: "توسعه‌دهنده Full Stack و مدرس تکنولوژی‌های مدرن وب.",
    bioEn: "Full-stack developer and instructor focused on modern web technologies.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/parsa.jpg",
  },
  {
    email: "teacher12@hexasquad.com",
    nameFa: "تارا حسینی",
    nameEn: "Tara Hosseini",
    bioFa: "مدرس توسعه وب و متخصص ساخت محصولات نرم‌افزاری.",
    bioEn: "Web development instructor and software product specialist.",
    avatar: "https://hexasquad-storage.s3.ir-central1.arvanstorage.ir/teacher/tara.jpg",
  },
]

const teacherUsers: Array<{ id: number }> = []
const teachers: Array<{ id: number }> = []

for (const teacherSeed of teacherSeeds) {
  const teacherUser = await prisma.user.upsert({
    where: {
      email: teacherSeed.email,
    },
    update: {
      name: teacherSeed.nameEn,
      password: hashedPassword,
      role: Role.TEACHER,
      avatar: teacherSeed.avatar,
    },
    create: {
      name: teacherSeed.nameEn,
      email: teacherSeed.email,
      password: hashedPassword,
      role: Role.TEACHER,
      avatar: teacherSeed.avatar,
    },
  })

  const teacher = await prisma.teacher.upsert({
    where: {
      userId: teacherUser.id,
    },
    update: {
      avatar: teacherSeed.avatar,
    },
    create: {
      userId: teacherUser.id,
      avatar: teacherSeed.avatar,
    },
  })

  await prisma.teacherTranslation.upsert({
    where: {
      teacherId_language: {
        teacherId: teacher.id,
        language: Language.FA,
      },
    },
    update: {
      name: teacherSeed.nameFa,
      bio: teacherSeed.bioFa,
    },
    create: {
      teacherId: teacher.id,
      language: Language.FA,
      name: teacherSeed.nameFa,
      bio: teacherSeed.bioFa,
    },
  })

  await prisma.teacherTranslation.upsert({
    where: {
      teacherId_language: {
        teacherId: teacher.id,
        language: Language.EN,
      },
    },
    update: {
      name: teacherSeed.nameEn,
      bio: teacherSeed.bioEn,
    },
    create: {
      teacherId: teacher.id,
      language: Language.EN,
      name: teacherSeed.nameEn,
      bio: teacherSeed.bioEn,
    },
  })

  teacherUsers.push({ id: teacherUser.id })
  teachers.push({ id: teacher.id })
}

const primaryTeacherUser = teacherUsers[0]

if (!primaryTeacherUser) {
  throw new Error("Primary teacher user not found")
}

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        id: category.id,
      },

      update: {},

      create: {
        id: category.id,
      },
    });

    await prisma.categoryTranslation.upsert({
      where: {
        categoryId_language: {
          categoryId: category.id,
          language: Language.FA,
        },
      },

      update: {
        name: category.fa,
      },

      create: {
        categoryId: category.id,
        language: Language.FA,
        name: category.fa,
      },
    });

    await prisma.categoryTranslation.upsert({
      where: {
        categoryId_language: {
          categoryId: category.id,
          language: Language.EN,
        },
      },

      update: {
        name: category.en,
      },

      create: {
        categoryId: category.id,
        language: Language.EN,
        name: category.en,
      },
    });
  }


  for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
    const course = courses[courseIndex]

    if (!course) {
      throw new Error(`Course not found at index ${courseIndex}`)
    }

    const teacher = teachers[courseIndex % teachers.length]

    if (!teacher) {
      throw new Error(`Teacher not found for course index ${courseIndex}`)
    }

    const existingCourse = await prisma.course.upsert({
      where: {
        id: course.id,
      },

      update: {
        categoryId: course.categoryId,
        teacherId: teacher.id,
        status: CourseStatus.COMPLETED,
        courseTime: course.courseTime,
        price: course.price,
        thumbnail:course.thumbnail,
        studentCount: 0,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        uploadDate: new Date("2026-01-01"),
      },

      create: {
        id: course.id,
        categoryId: course.categoryId,
        teacherId: teacher.id,
        status: CourseStatus.COMPLETED,
        courseTime: course.courseTime,
        price: course.price,
        thumbnail: course.thumbnail,
        studentCount: 0,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        uploadDate: new Date("2026-01-01"),
      },
    });

    await prisma.courseTranslation.upsert({
      where: {
        courseId_language: {
          courseId: existingCourse.id,
          language: Language.FA,
        },
      },

      update: {
        title: course.fa.title,
        shortDescription: course.fa.shortDescription,
        description: course.fa.description,
      },

      create: {
        courseId: existingCourse.id,
        language: Language.FA,
        title: course.fa.title,
        shortDescription: course.fa.shortDescription,
        description: course.fa.description,
      },
    });

    await prisma.courseTranslation.upsert({
      where: {
        courseId_language: {
          courseId: existingCourse.id,
          language: Language.EN,
        },
      },

      update: {
        title: course.en.title,
        shortDescription: course.en.shortDescription,
        description: course.en.description,
      },

      create: {
        courseId: existingCourse.id,
        language: Language.EN,
        title: course.en.title,
        shortDescription: course.en.shortDescription,
        description: course.en.description,
      },
    });

    await createCourseContent(
      existingCourse.id,
      course.fa.title,
      course.en.title
    );
  }


  for (const blog of blogs) {
    const existingBlog = await prisma.blog.upsert({
      where: {
        id: blog.id,
      },

      update: {
        coverImage: blog.coverImage,
        blogImage: blog.blogImage,
        author: blog.author,
        authorImage: blog.authorImage
      },

      create: {
        id: blog.id,
        coverImage: blog.coverImage,
        blogImage: blog.blogImage,
        author: blog.author,
        authorImage: blog.authorImage,
        viewCount: 0,
      },
    });

    await prisma.blogTranslation.upsert({
      where: {
        blogId_language: {
          blogId: existingBlog.id,
          language: Language.FA,
        },
      },

      update: {
        title: blog.fa.title,
        shortDescription: blog.fa.shortDescription,
        content: blog.fa.content,
      },

      create: {
        blogId: existingBlog.id,
        language: Language.FA,
        title: blog.fa.title,
        shortDescription: blog.fa.shortDescription,
        content: blog.fa.content,
      },
    });

    await prisma.blogTranslation.upsert({
      where: {
        blogId_language: {
          blogId: existingBlog.id,
          language: Language.EN,
        },
      },

      update: {
        title: blog.en.title,
        shortDescription: blog.en.shortDescription,
        content: blog.en.content,
      },

      create: {
        blogId: existingBlog.id,
        language: Language.EN,
        title: blog.en.title,
        shortDescription: blog.en.shortDescription,
        content: blog.en.content,
      },
    });
  }


  await prisma.favorite.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: 10001,
      },
    },

    update: {},

    create: {
      userId: studentUser.id,
      courseId: 10001,
    },
  });

  await prisma.favorite.upsert({
    where: {
      userId_blogId: {
        userId: studentUser.id,
        blogId: 20001,
      },
    },

    update: {},

    create: {
      userId: studentUser.id,
      blogId: 20001,
    },
  });


  await prisma.courseReaction.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: 10001,
      },
    },

    update: {
      type: ReactionType.LIKE,
    },

    create: {
      userId: studentUser.id,
      courseId: 10001,
      type: ReactionType.LIKE,
    },
  });


  await prisma.blogReaction.upsert({
    where: {
      userId_blogId: {
        userId: studentUser.id,
        blogId: 20001,
      },
    },

    update: {
      type: ReactionType.LIKE,
    },

    create: {
      userId: studentUser.id,
      blogId: 20001,
      type: ReactionType.LIKE,
    },
  });


  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: 10001,
      },
    },

    update: {
      rating: 5,
    },

    create: {
      userId: studentUser.id,
      courseId: 10001,
      rating: 5,
    },
  });

  console.log("Review created");


  const purchasedCourseIds = [10001, 10002];

  for (const courseId of purchasedCourseIds) {
    await prisma.purchasedCourse.upsert({
      where: {
        userId_courseId: {
          userId: studentUser.id,
          courseId,
        },
      },

      update: {},

      create: {
        userId: studentUser.id,
        courseId,
      },
    });
  }

  await prisma.course.updateMany({
    where: {
      id: {
        in: purchasedCourseIds,
      },
    },

    data: {
      studentCount: 1,
    },
  });

  console.log("Purchased courses created");


  const order = await prisma.order.findFirst({
    where: {
      userId: studentUser.id,
      status: OrderStatus.PAID,
    },
  });

  let paidOrder = order;

  if (!paidOrder) {
    paidOrder = await prisma.order.create({
      data: {
        userId: studentUser.id,
        totalPrice: 1_950_000,
        status: OrderStatus.PAID,
      },
    });
  }

  for (const courseId of purchasedCourseIds) {
    const course = courses.find((item) => item.id === courseId);

    if (!course) {
      continue;
    }

    await prisma.orderItem.upsert({
      where: {
        orderId_courseId: {
          orderId: paidOrder.id,
          courseId,
        },
      },

      update: {
        price: course.price,
      },

      create: {
        orderId: paidOrder.id,
        courseId,
        price: course.price,
      },
    });
  }

  console.log("Order created");


  const courseComments = [
    {
      userId: studentUser.id,
      courseId: 10001,
      content: "دوره خیلی خوب و کاربردی بود.",
    },
    {
      userId: studentUser.id,
      courseId: 10002,
      content: "توضیحات مدرس خیلی واضح بود.",
    },
    {
      userId: studentUser.id,
      courseId: 10003,
      content: "پروژه‌های دوره خیلی مفید بودند.",
    },
  ];

  await prisma.comment.deleteMany({
    where: {
      OR: courseComments.map((comment) => ({
        userId: comment.userId,
        courseId: comment.courseId,
        content: comment.content,
      })),
    },
  });

  const createdCourseComments: number[] = [];

  for (const commentData of courseComments) {
    const comment = await prisma.comment.create({
      data: commentData,
    });

    createdCourseComments.push(comment.id);
  }

  console.log("Course comments created");


  if (createdCourseComments[0]) {
    await prisma.comment.create({
      data: {
        userId: primaryTeacherUser.id,
        courseId: 10001,
        parentId: createdCourseComments[0],
        content: "خوشحالم که دوره برای شما مفید بوده.",
      },
    });
  }


  if (createdCourseComments[0]) {
    await prisma.commentLike.upsert({
      where: {
        userId_commentId: {
          userId: primaryTeacherUser.id,
          commentId: createdCourseComments[0],
        },
      },

      update: {},

      create: {
        userId: primaryTeacherUser.id,
        commentId: createdCourseComments[0],
      },
    });
  }

  console.log("Comment reply + like created");

  const blogComments = [
    {
      userId: studentUser.id,
      blogId: 20001,
      content: "مقاله خیلی مفید بود.",
    },
    {
      userId: studentUser.id,
      blogId: 20002,
      content: "توضیحات کاملاً قابل فهم بود.",
    },
  ];

  await prisma.comment.deleteMany({
    where: {
      OR: blogComments.map((comment) => ({
        userId: comment.userId,
        blogId: comment.blogId,
        content: comment.content,
      })),
    },
  });

  const createdBlogComments: number[] = [];

  for (const commentData of blogComments) {
    const comment = await prisma.comment.create({
      data: commentData,
    });

    createdBlogComments.push(comment.id);
  }

  console.log("Blog comments created");


  if (createdBlogComments[0]) {
    await prisma.comment.create({
      data: {
        userId: primaryTeacherUser.id,
        blogId: 20001,
        parentId: createdBlogComments[0],
        content: "ممنون از نظر شما.",
      },
    });
  }


  for (let i = 0; i < blogs.length; i++) {

      const blog = blogs[i]

      if (!blog) {
        throw new Error(`Blog not found at index ${i}`);
      }

    await prisma.blog.update({
      where: {
        id: blog.id,
      },

      data: {
        viewCount: (i + 1) * 25,
      },
    });
  }

  console.log("Blog view counts updated");


  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Category"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Category"), 1),
      true
    );
  `);

  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Course"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Course"), 1),
      true
    );
  `);

  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Blog"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Blog"), 1),
      true
    );
  `);

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });