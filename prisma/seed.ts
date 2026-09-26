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

  fa: Translation;
  en: Translation;
};

type BlogSeed = {
  id: number;
  coverImage: string;
  blogImage: string;
  author: string;

  fa: Translation;
  en: Translation;
};

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

/* =========================================================
   COURSES
========================================================= */

const courses: CourseSeed[] = [
  {
    id: 10001,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 18,
    price: 850000,

    fa: {
      title: "آموزش HTML و CSS",
      shortDescription: "یادگیری اصول طراحی صفحات وب از پایه",
      description:
        "در این دوره با HTML و CSS آشنا می‌شوید و می‌توانید صفحات وب مدرن و واکنش‌گرا طراحی کنید.",
    },

    en: {
      title: "HTML & CSS Course",
      shortDescription: "Learn the fundamentals of modern web page design.",
      description:
        "Learn HTML and CSS fundamentals and build modern, responsive web pages from scratch.",
    },
  },

  {
    id: 10002,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 24,
    price: 1100000,

    fa: {
      title: "آموزش JavaScript",
      shortDescription: "یادگیری کامل JavaScript از پایه تا سطح کاربردی",
      description:
        "در این دوره مفاهیم اصلی JavaScript، توابع، آرایه‌ها، آبجکت‌ها، DOM و مفاهیم مدرن این زبان را یاد می‌گیرید.",
    },

    en: {
      title: "JavaScript Course",
      shortDescription:
        "Learn JavaScript from fundamentals to practical development.",
      description:
        "Learn JavaScript fundamentals, functions, arrays, objects, DOM manipulation and modern JavaScript concepts.",
    },
  },

  {
    id: 10003,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 30,
    price: 1450000,

    fa: {
      title: "آموزش React",
      shortDescription: "ساخت رابط‌های کاربری مدرن با React",
      description:
        "در این دوره ساخت کامپوننت، state، props، hooks و معماری پروژه‌های React را یاد می‌گیرید.",
    },

    en: {
      title: "React Course",
      shortDescription: "Build modern user interfaces with React.",
      description:
        "Learn components, state, props, hooks and practical architecture for building React applications.",
    },
  },

  {
    id: 10004,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 32,
    price: 1650000,

    fa: {
      title: "آموزش Next.js",
      shortDescription: "ساخت پروژه‌های حرفه‌ای با Next.js",
      description:
        "در این دوره با Next.js، routing، rendering، server components و ساخت پروژه‌های واقعی آشنا می‌شوید.",
    },

    en: {
      title: "Next.js Course",
      shortDescription: "Build professional web applications with Next.js.",
      description:
        "Learn Next.js routing, rendering, server components and practical patterns for production-ready applications.",
    },
  },

  {
    id: 10005,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 28,
    price: 1550000,

    fa: {
      title: "آموزش TypeScript",
      shortDescription: "یادگیری TypeScript برای پروژه‌های حرفه‌ای",
      description:
        "در این دوره TypeScript را از مفاهیم پایه تا استفاده در پروژه‌های واقعی یاد می‌گیرید.",
    },

    en: {
      title: "TypeScript Course",
      shortDescription: "Learn TypeScript for professional applications.",
      description:
        "Learn TypeScript from the basics to advanced patterns and use it effectively in real-world projects.",
    },
  },

  {
    id: 10006,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 34,
    price: 1750000,

    fa: {
      title: "آموزش Node.js",
      shortDescription: "ساخت Backend با Node.js",
      description:
        "در این دوره با Node.js و مفاهیم اصلی توسعه سمت سرور آشنا می‌شوید.",
    },

    en: {
      title: "Node.js Course",
      shortDescription: "Build backend applications with Node.js.",
      description:
        "Learn Node.js fundamentals and build practical server-side applications.",
    },
  },

  {
    id: 10007,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 36,
    price: 1850000,

    fa: {
      title: "آموزش Express.js",
      shortDescription: "ساخت APIهای حرفه‌ای با Express",
      description:
        "در این دوره routing، middleware، controller، service و ساخت APIهای حرفه‌ای با Express را یاد می‌گیرید.",
    },

    en: {
      title: "Express.js Course",
      shortDescription: "Build professional REST APIs with Express.",
      description:
        "Learn routing, middleware, controllers, services and practical REST API architecture with Express.",
    },
  },

  {
    id: 10008,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 40,
    price: 2100000,

    fa: {
      title: "آموزش PostgreSQL",
      shortDescription: "یادگیری دیتابیس PostgreSQL",
      description:
        "در این دوره با طراحی دیتابیس، جدول‌ها، رابطه‌ها، queryها و مفاهیم مهم PostgreSQL آشنا می‌شوید.",
    },

    en: {
      title: "PostgreSQL Course",
      shortDescription: "Learn PostgreSQL and relational database design.",
      description:
        "Learn relational database design, tables, relationships, queries and important PostgreSQL concepts.",
    },
  },

  {
    id: 10009,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 38,
    price: 2200000,

    fa: {
      title: "آموزش Prisma",
      shortDescription: "کار با Prisma ORM در پروژه‌های واقعی",
      description:
        "در این دوره Prisma، مدل‌سازی دیتابیس، relationها، queryها و transactionها را یاد می‌گیرید.",
    },

    en: {
      title: "Prisma ORM Course",
      shortDescription: "Work with Prisma ORM in real-world projects.",
      description:
        "Learn Prisma schema design, relations, queries, transactions and practical database workflows.",
    },
  },

  {
    id: 10010,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 42,
    price: 2500000,

    fa: {
      title: "آموزش Full Stack",
      shortDescription: "ساخت پروژه کامل Full Stack",
      description:
        "در این دوره یک پروژه کامل از frontend تا backend، دیتابیس، احراز هویت و deployment ساخته می‌شود.",
    },

    en: {
      title: "Full Stack Development",
      shortDescription: "Build a complete full-stack application.",
      description:
        "Build a complete project covering frontend, backend, database, authentication and deployment.",
    },
  },

  {
    id: 10011,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 20,
    price: 900000,

    fa: {
      title: "Git و GitHub",
      shortDescription: "یادگیری Git و مدیریت پروژه با GitHub",
      description:
        "در این دوره branch، merge، pull request، conflict و workflowهای حرفه‌ای Git را یاد می‌گیرید.",
    },

    en: {
      title: "Git & GitHub",
      shortDescription: "Learn Git and professional GitHub workflows.",
      description:
        "Learn branches, merges, pull requests, conflicts and professional Git workflows.",
    },
  },

  {
    id: 10012,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 25,
    price: 1250000,

    fa: {
      title: "آموزش Tailwind CSS",
      shortDescription: "طراحی سریع و مدرن با Tailwind CSS",
      description:
        "در این دوره با utility classes، responsive design و ساخت رابط‌های مدرن با Tailwind آشنا می‌شوید.",
    },

    en: {
      title: "Tailwind CSS",
      shortDescription: "Build modern interfaces quickly with Tailwind CSS.",
      description:
        "Learn utility classes, responsive design and modern UI development with Tailwind CSS.",
    },
  },

  {
    id: 10013,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 22,
    price: 1000000,

    fa: {
      title: "آموزش REST API",
      shortDescription: "ساخت APIهای استاندارد و قابل توسعه",
      description:
        "در این دوره اصول طراحی REST API، status codeها، validation و ساختار مناسب API را یاد می‌گیرید.",
    },

    en: {
      title: "REST API Development",
      shortDescription: "Design scalable and maintainable REST APIs.",
      description:
        "Learn REST principles, HTTP status codes, validation and scalable API architecture.",
    },
  },

  {
    id: 10014,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 27,
    price: 1300000,

    fa: {
      title: "احراز هویت در Backend",
      shortDescription: "ساخت سیستم Authentication حرفه‌ای",
      description:
        "در این دوره JWT، password hashing، middleware و authorization را پیاده‌سازی می‌کنید.",
    },

    en: {
      title: "Backend Authentication",
      shortDescription: "Build a professional authentication system.",
      description:
        "Learn JWT authentication, password hashing, middleware and authorization for backend applications.",
    },
  },

  {
    id: 10015,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 26,
    price: 1350000,

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

    fa: {
      title: "ساخت فروشگاه اینترنتی",
      shortDescription: "ساخت یک فروشگاه آنلاین واقعی",
      description:
        "در این دوره ساخت محصولات، سبد خرید، سفارش، پرداخت و بخش کاربری یک فروشگاه اینترنتی را یاد می‌گیرید.",
    },

    en: {
      title: "E-commerce Development",
      shortDescription: "Build a complete online store.",
      description:
        "Learn how to build products, cart, orders, payments and customer features for an e-commerce application.",
    },
  },

  {
    id: 10017,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 29,
    price: 1500000,

    fa: {
      title: "React Query",
      shortDescription: "مدیریت حرفه‌ای server state در React",
      description:
        "در این دوره fetching، caching، mutations و مدیریت server state با React Query را یاد می‌گیرید.",
    },

    en: {
      title: "React Query",
      shortDescription: "Master server-state management in React.",
      description:
        "Learn fetching, caching, mutations and practical server-state management with React Query.",
    },
  },

  {
    id: 10018,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 24,
    price: 1150000,

    fa: {
      title: "Zustand",
      shortDescription: "مدیریت state با Zustand",
      description:
        "در این دوره ساخت store و مدیریت stateهای مختلف پروژه‌های React را یاد می‌گیرید.",
    },

    en: {
      title: "Zustand State Management",
      shortDescription: "Manage React state with Zustand.",
      description:
        "Learn how to build stores and manage application state effectively with Zustand.",
    },
  },

  {
    id: 10019,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 21,
    price: 950000,

    fa: {
      title: "React Hook Form و Zod",
      shortDescription: "ساخت فرم‌های حرفه‌ای و validation",
      description:
        "در این دوره فرم‌های React را با React Hook Form و Zod به شکل حرفه‌ای مدیریت می‌کنید.",
    },

    en: {
      title: "React Hook Form & Zod",
      shortDescription: "Build professional forms with validation.",
      description:
        "Learn form management and schema validation using React Hook Form and Zod.",
    },
  },

  {
    id: 10020,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 31,
    price: 1700000,

    fa: {
      title: "WebSocket و Socket.IO",
      shortDescription: "ساخت برنامه‌های Real-Time",
      description:
        "در این دوره ارتباط real-time، eventها و ساخت قابلیت‌هایی مانند chat را یاد می‌گیرید.",
    },

    en: {
      title: "WebSocket & Socket.IO",
      shortDescription: "Build real-time web applications.",
      description:
        "Learn real-time communication, events and practical features such as live chat.",
    },
  },

  {
    id: 10021,
    categoryId: CATEGORY_IDS.PROGRAMMING,
    courseTime: 23,
    price: 1050000,

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

    fa: {
      title: "Deployment پروژه‌های وب",
      shortDescription: "انتشار پروژه‌های واقعی روی اینترنت",
      description:
        "در این دوره deployment، environment variables، production build و hosting را یاد می‌گیرید.",
    },

    en: {
      title: "Web Deployment",
      shortDescription: "Deploy real-world web applications.",
      description:
        "Learn production builds, environment variables, hosting and deployment workflows.",
    },
  },

  {
    id: 10023,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 28,
    price: 1450000,

    fa: {
      title: "مبانی تحلیل داده",
      shortDescription: "آشنایی با مفاهیم تحلیل داده",
      description:
        "در این دوره مفاهیم اصلی تحلیل داده و روش تبدیل داده خام به اطلاعات قابل استفاده را یاد می‌گیرید.",
    },

    en: {
      title: "Data Analysis Fundamentals",
      shortDescription: "Learn the fundamentals of data analysis.",
      description:
        "Learn core data analysis concepts and how to turn raw data into useful information.",
    },
  },

  {
    id: 10024,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 30,
    price: 1550000,

    fa: {
      title: "Python برای تحلیل داده",
      shortDescription: "استفاده از Python در تحلیل داده",
      description:
        "در این دوره Python و کتابخانه‌های کاربردی آن برای تحلیل داده را یاد می‌گیرید.",
    },

    en: {
      title: "Python for Data Analysis",
      shortDescription: "Use Python for practical data analysis.",
      description:
        "Learn Python and useful libraries for analyzing and working with real-world datasets.",
    },
  },

  {
    id: 10025,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 32,
    price: 1650000,

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

    fa: {
      title: "Data Visualization",
      shortDescription: "نمایش حرفه‌ای داده‌ها",
      description:
        "در این دوره با اصول visualization و ساخت نمودارهای کاربردی آشنا می‌شوید.",
    },

    en: {
      title: "Data Visualization",
      shortDescription: "Present data using effective visualizations.",
      description:
        "Learn visualization principles and create useful charts for communicating data clearly.",
    },
  },

  {
    id: 10027,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 34,
    price: 1750000,

    fa: {
      title: "SQL برای تحلیل داده",
      shortDescription: "کار با SQL برای تحلیل داده",
      description:
        "در این دوره queryهای SQL و تکنیک‌های کاربردی برای تحلیل داده را یاد می‌گیرید.",
    },

    en: {
      title: "SQL for Data Analysis",
      shortDescription: "Use SQL for practical data analysis.",
      description:
        "Learn SQL queries and practical techniques for analyzing relational datasets.",
    },
  },

  {
    id: 10028,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 36,
    price: 1950000,

    fa: {
      title: "مبانی هوش مصنوعی",
      shortDescription: "آشنایی با مفاهیم پایه AI",
      description:
        "در این دوره با مفاهیم پایه هوش مصنوعی و کاربردهای آن آشنا می‌شوید.",
    },

    en: {
      title: "Artificial Intelligence Fundamentals",
      shortDescription: "Learn the fundamentals of artificial intelligence.",
      description:
        "Explore core AI concepts and understand practical applications of artificial intelligence.",
    },
  },

  {
    id: 10029,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 40,
    price: 2200000,

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

    fa: {
      title: "Excel برای تحلیل داده",
      shortDescription: "تحلیل داده با Excel",
      description:
        "در این دوره ابزارهای مهم Excel برای مدیریت و تحلیل داده را یاد می‌گیرید.",
    },

    en: {
      title: "Excel for Data Analysis",
      shortDescription: "Analyze data effectively with Excel.",
      description:
        "Learn useful Excel tools and techniques for managing and analyzing datasets.",
    },
  },

  {
    id: 10031,
    categoryId: CATEGORY_IDS.DATA_ANALYSIS,
    courseTime: 29,
    price: 1500000,

    fa: {
      title: "Power BI",
      shortDescription: "ساخت داشبوردهای حرفه‌ای با Power BI",
      description:
        "در این دوره ساخت داشبورد و visualization با Power BI را یاد می‌گیرید.",
    },

    en: {
      title: "Power BI",
      shortDescription: "Build professional dashboards with Power BI.",
      description:
        "Learn how to build interactive dashboards and data visualizations with Power BI.",
    },
  },

  {
    id: 10032,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 35,
    price: 1850000,

    fa: {
      title: "مبانی امنیت شبکه",
      shortDescription: "آشنایی با اصول امنیت شبکه",
      description:
        "در این دوره مفاهیم پایه امنیت شبکه، تهدیدها و روش‌های دفاعی را یاد می‌گیرید.",
    },

    en: {
      title: "Network Security Fundamentals",
      shortDescription: "Learn the fundamentals of network security.",
      description:
        "Understand common network threats, security concepts and defensive techniques.",
    },
  },

  {
    id: 10033,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 38,
    price: 2050000,

    fa: {
      title: "Ethical Hacking",
      shortDescription: "آشنایی با تست نفوذ و Ethical Hacking",
      description:
        "در این دوره با مفاهیم تست نفوذ و روش‌های ارزیابی امنیت سیستم‌ها آشنا می‌شوید.",
    },

    en: {
      title: "Ethical Hacking",
      shortDescription: "Learn ethical hacking and penetration testing concepts.",
      description:
        "Understand penetration testing concepts and practical approaches to evaluating system security.",
    },
  },

  {
    id: 10034,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 31,
    price: 1700000,

    fa: {
      title: "امنیت وب",
      shortDescription: "آشنایی با آسیب‌پذیری‌های رایج وب",
      description:
        "در این دوره با مفاهیم مهم امنیت برنامه‌های وب و روش‌های محافظت از آن‌ها آشنا می‌شوید.",
    },

    en: {
      title: "Web Security",
      shortDescription: "Learn common web application security concepts.",
      description:
        "Understand common web vulnerabilities and practical ways to protect web applications.",
    },
  },

  {
    id: 10035,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 24,
    price: 1200000,

    fa: {
      title: "Linux برای امنیت",
      shortDescription: "استفاده از Linux در امنیت",
      description:
        "در این دوره ابزارها و مفاهیم Linux مورد استفاده در حوزه امنیت را یاد می‌گیرید.",
    },

    en: {
      title: "Linux for Security",
      shortDescription: "Use Linux tools for security workflows.",
      description:
        "Learn Linux fundamentals and useful tools for security-focused workflows.",
    },
  },

  {
    id: 10036,
    categoryId: CATEGORY_IDS.NETWORK_SECURITY,
    courseTime: 28,
    price: 1450000,

    fa: {
      title: "امنیت API و Backend",
      shortDescription: "محافظت از APIها و Backend",
      description:
        "در این دوره روش‌های مهم افزایش امنیت API و backend را بررسی می‌کنیم.",
    },

    en: {
      title: "API & Backend Security",
      shortDescription: "Protect backend applications and APIs.",
      description:
        "Learn practical techniques for improving the security of backend applications and APIs.",
    },
  },

  {
    id: 10037,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 34,
    price: 1800000,

    fa: {
      title: "مبانی بازی‌سازی",
      shortDescription: "آشنایی با اصول ساخت بازی",
      description:
        "در این دوره با مفاهیم پایه طراحی و توسعه بازی آشنا می‌شوید.",
    },

    en: {
      title: "Game Development Fundamentals",
      shortDescription: "Learn the fundamentals of game development.",
      description:
        "Explore the core concepts of designing and developing games.",
    },
  },

  {
    id: 10038,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 42,
    price: 2300000,

    fa: {
      title: "Unity",
      shortDescription: "ساخت بازی با Unity",
      description:
        "در این دوره با محیط Unity و ساخت پروژه‌های بازی آشنا می‌شوید.",
    },

    en: {
      title: "Unity Game Development",
      shortDescription: "Build games with Unity.",
      description:
        "Learn the Unity environment and build practical game projects.",
    },
  },

  {
    id: 10039,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 36,
    price: 2000000,

    fa: {
      title: "C# برای Unity",
      shortDescription: "یادگیری C# برای بازی‌سازی",
      description:
        "در این دوره مفاهیم C# مورد نیاز برای توسعه بازی با Unity را یاد می‌گیرید.",
    },

    en: {
      title: "C# for Unity",
      shortDescription: "Learn C# for Unity game development.",
      description:
        "Learn the C# concepts needed to build games and interactive experiences with Unity.",
    },
  },

  {
    id: 10040,
    categoryId: CATEGORY_IDS.GAME,
    courseTime: 30,
    price: 1650000,

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
    coverImage: "https://picsum.photos/seed/blog1/1200/700",
    blogImage: "https://picsum.photos/seed/blog1/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "مسیر یادگیری برنامه‌نویسی در سال ۱۴۰۵",
      shortDescription: "چطور مسیر یادگیری برنامه‌نویسی را شروع کنیم؟",
      description:
        "در این مقاله درباره انتخاب مسیر مناسب برای شروع برنامه‌نویسی و مهارت‌هایی که باید یاد بگیرید صحبت می‌کنیم.",
    },

    en: {
      title: "Programming Learning Roadmap in 2026",
      shortDescription: "How should you start learning programming?",
      description:
        "Learn how to choose the right programming path and which skills you should focus on when starting.",
    },
  },

  {
    id: 20002,
    coverImage: "https://picsum.photos/seed/blog2/1200/700",
    blogImage: "https://picsum.photos/seed/blog2/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "Frontend یا Backend؟",
      shortDescription: "کدام مسیر برای شما مناسب‌تر است؟",
      description:
        "در این مقاله تفاوت‌های Frontend و Backend و مهارت‌های مورد نیاز هر مسیر را بررسی می‌کنیم.",
    },

    en: {
      title: "Frontend or Backend?",
      shortDescription: "Which development path is right for you?",
      description:
        "Compare frontend and backend development and learn which skills are required for each path.",
    },
  },

  {
    id: 20003,
    coverImage: "https://picsum.photos/seed/blog3/1200/700",
    blogImage: "https://picsum.photos/seed/blog3/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "چطور اولین پروژه برنامه‌نویسی را بگیریم؟",
      shortDescription: "راهنمای شروع فریلنسینگ برای برنامه‌نویسان",
      description:
        "در این مقاله روش‌های ساخت رزومه، نمونه‌کار و جذب اولین مشتری را بررسی می‌کنیم.",
    },

    en: {
      title: "How to Get Your First Programming Project",
      shortDescription: "A guide to starting freelancing as a developer.",
      description:
        "Learn how to build a portfolio, present your skills and attract your first programming client.",
    },
  },

  {
    id: 20004,
    coverImage: "https://picsum.photos/seed/blog4/1200/700",
    blogImage: "https://picsum.photos/seed/blog4/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "چرا Git برای برنامه‌نویسان ضروری است؟",
      shortDescription: "اهمیت Git در پروژه‌های واقعی",
      description:
        "Git یکی از مهم‌ترین ابزارهای مدیریت کد و همکاری تیمی در پروژه‌های نرم‌افزاری است.",
    },

    en: {
      title: "Why Git Is Essential for Developers",
      shortDescription: "Why Git matters in real-world projects.",
      description:
        "Git is one of the most important tools for version control and collaboration in software projects.",
    },
  },

  {
    id: 20005,
    coverImage: "https://picsum.photos/seed/blog5/1200/700",
    blogImage: "https://picsum.photos/seed/blog5/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "API چیست؟",
      shortDescription: "آشنایی ساده با API",
      description:
        "در این مقاله مفهوم API، نحوه ارتباط frontend و backend و ساختار درخواست‌های HTTP را بررسی می‌کنیم.",
    },

    en: {
      title: "What Is an API?",
      shortDescription: "A simple introduction to APIs.",
      description:
        "Learn what APIs are and how frontend and backend applications communicate through HTTP requests.",
    },
  },

  {
    id: 20006,
    coverImage: "https://picsum.photos/seed/blog6/1200/700",
    blogImage: "https://picsum.photos/seed/blog6/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "JWT چیست و چگونه کار می‌کند؟",
      shortDescription: "آشنایی با Authentication با JWT",
      description:
        "JWT یکی از روش‌های رایج برای پیاده‌سازی احراز هویت در APIهاست.",
    },

    en: {
      title: "What Is JWT and How Does It Work?",
      shortDescription: "Learn authentication with JWT.",
      description:
        "JWT is a common approach for implementing authentication in modern APIs.",
    },
  },

  {
    id: 20007,
    coverImage: "https://picsum.photos/seed/blog7/1200/700",
    blogImage: "https://picsum.photos/seed/blog7/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "Prisma چیست؟",
      shortDescription: "آشنایی با Prisma ORM",
      description:
        "Prisma یکی از ORMهای محبوب برای کار با دیتابیس در پروژه‌های TypeScript و Node.js است.",
    },

    en: {
      title: "What Is Prisma?",
      shortDescription: "An introduction to Prisma ORM.",
      description:
        "Prisma is a popular ORM for working with databases in TypeScript and Node.js applications.",
    },
  },

  {
    id: 20008,
    coverImage: "https://picsum.photos/seed/blog8/1200/700",
    blogImage: "https://picsum.photos/seed/blog8/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "چرا PostgreSQL انتخاب خوبی است؟",
      shortDescription: "مزایای PostgreSQL برای پروژه‌های واقعی",
      description:
        "PostgreSQL یک دیتابیس قدرتمند و قابل اعتماد برای بسیاری از پروژه‌های نرم‌افزاری است.",
    },

    en: {
      title: "Why Choose PostgreSQL?",
      shortDescription: "Why PostgreSQL is great for real-world projects.",
      description:
        "PostgreSQL is a powerful and reliable relational database for many types of software applications.",
    },
  },

  {
    id: 20009,
    coverImage: "https://picsum.photos/seed/blog9/1200/700",
    blogImage: "https://picsum.photos/seed/blog9/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "چطور یک رزومه برنامه‌نویسی حرفه‌ای بسازیم؟",
      shortDescription: "ساخت رزومه مناسب برای استخدام و فریلنسینگ",
      description:
        "در این مقاله مهم‌ترین بخش‌های یک رزومه حرفه‌ای برنامه‌نویسی را بررسی می‌کنیم.",
    },

    en: {
      title: "How to Build a Professional Developer Resume",
      shortDescription: "Build a resume for jobs and freelancing.",
      description:
        "Learn which sections and projects can make a developer resume stronger for jobs and freelance work.",
    },
  },

  {
    id: 20010,
    coverImage: "https://picsum.photos/seed/blog10/1200/700",
    blogImage: "https://picsum.photos/seed/blog10/800/500",
    author: "تیم تحریریه هگزا اسکواد",

    fa: {
      title: "Full Stack Developer چیست؟",
      shortDescription: "مسیر تبدیل شدن به یک برنامه‌نویس Full Stack",
      description:
        "در این مقاله مهارت‌های مورد نیاز یک Full Stack Developer و مسیر یادگیری آن را بررسی می‌کنیم.",
    },

    en: {
      title: "What Is a Full Stack Developer?",
      shortDescription: "A roadmap to becoming a full-stack developer.",
      description:
        "Learn what skills a full-stack developer needs and how to build a practical learning roadmap.",
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
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    email: "teacher2@hexasquad.com",
    nameFa: "سارا احمدی",
    nameEn: "Sara Ahmadi",
    bioFa: "توسعه‌دهنده و مدرس حوزه برنامه‌نویسی وب و نرم‌افزار.",
    bioEn: "Web and software developer and instructor.",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    email: "teacher3@hexasquad.com",
    nameFa: "رضا محمدی",
    nameEn: "Reza Mohammadi",
    bioFa: "متخصص توسعه نرم‌افزار و آموزش برنامه‌نویسی کاربردی.",
    bioEn: "Software developer specializing in practical programming education.",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    email: "teacher4@hexasquad.com",
    nameFa: "مریم حسینی",
    nameEn: "Maryam Hosseini",
    bioFa: "مدرس و توسعه‌دهنده نرم‌افزار با تمرکز بر پروژه‌های واقعی.",
    bioEn: "Software developer and instructor focused on real-world projects.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    email: "teacher5@hexasquad.com",
    nameFa: "امیر کریمی",
    nameEn: "Amir Karimi",
    bioFa: "توسعه‌دهنده Full Stack و مدرس مباحث پیشرفته وب.",
    bioEn: "Full-stack developer and instructor focused on advanced web development.",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    email: "teacher6@hexasquad.com",
    nameFa: "نیلوفر رحیمی",
    nameEn: "Niloofar Rahimi",
    bioFa: "مدرس و متخصص تحلیل داده و برنامه‌نویسی پایتون.",
    bioEn: "Instructor specializing in data analysis and Python programming.",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    email: "teacher7@hexasquad.com",
    nameFa: "آرمان جعفری",
    nameEn: "Arman Jafari",
    bioFa: "توسعه‌دهنده نرم‌افزار و مدرس مباحث مهندسی نرم‌افزار.",
    bioEn: "Software developer and instructor focused on software engineering.",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    email: "teacher8@hexasquad.com",
    nameFa: "سحر مرادی",
    nameEn: "Sahar Moradi",
    bioFa: "مدرس طراحی و توسعه اپلیکیشن‌های مدرن وب.",
    bioEn: "Instructor specializing in modern web application development.",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    email: "teacher9@hexasquad.com",
    nameFa: "محمد رضایی",
    nameEn: "Mohammad Rezaei",
    bioFa: "توسعه‌دهنده Backend و مدرس معماری نرم‌افزار.",
    bioEn: "Backend developer and instructor specializing in software architecture.",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    email: "teacher10@hexasquad.com",
    nameFa: "الهه احمدی",
    nameEn: "Elahe Ahmadi",
    bioFa: "مدرس برنامه‌نویسی و توسعه نرم‌افزارهای کاربردی.",
    bioEn: "Programming instructor focused on practical software development.",
    avatar: "https://i.pravatar.cc/150?img=48",
  },
  {
    email: "teacher11@hexasquad.com",
    nameFa: "پارسا کاظمی",
    nameEn: "Parsa Kazemi",
    bioFa: "توسعه‌دهنده Full Stack و مدرس تکنولوژی‌های مدرن وب.",
    bioEn: "Full-stack developer and instructor focused on modern web technologies.",
    avatar: "https://i.pravatar.cc/150?img=16",
  },
  {
    email: "teacher12@hexasquad.com",
    nameFa: "تارا حسینی",
    nameEn: "Tara Hosseini",
    bioFa: "مدرس توسعه وب و متخصص ساخت محصولات نرم‌افزاری.",
    bioEn: "Web development instructor and software product specialist.",
    avatar: "https://i.pravatar.cc/150?img=49",
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
      },

      create: {
        id: blog.id,
        coverImage: blog.coverImage,
        blogImage: blog.blogImage,
        author: blog.author,
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
        content: blog.fa.description,
      },

      create: {
        blogId: existingBlog.id,
        language: Language.FA,
        title: blog.fa.title,
        shortDescription: blog.fa.shortDescription,
        content: blog.fa.description,
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
        content: blog.en.description,
      },

      create: {
        blogId: existingBlog.id,
        language: Language.EN,
        title: blog.en.title,
        shortDescription: blog.en.shortDescription,
        content: blog.en.description,
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