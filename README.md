
<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/1a07f601-0e3b-43f0-90c0-264c0109f3cb" alt="Boxtrac" width="200">
  <br>
  Boxtrac
  <br>
</h1>



<h4 align="center">Boxtrac is a delivery and order management system.</h4>
<p align="center">I built it for my friend who is struggling to manage their business.</p>


## Managed your Inventory and Orders in One Platform

<video width="100%" controls autoPlay mute src="https://github.com/user-attachments/assets/272305c8-c374-4f1f-88a2-126f0e75a482"></video>


## ✨ Main Features of Boxtrac ✨
| <div style="width:285px">**Feature**</div> | **Description** |
|---|---|
| **1. Privacy Workspace** | A secure, personalized environment where users can manage their inventory and orders, with end-to-end encryption powered by Clerk. |
| **2. Real-Time Update** | Create, View, Update, and Delete in an instant made it possible by Convex. |
| **3. Team Management** | Invite your coworkers or staff to work and delegate tasks together and only you and them can access the data. |
| **4. Role Base Access System** | If you're the owner you can assign a role to your staff to have them controlled access. |
| **5. Clean, Modern UI using TailwindCSS and Shadcn-UI** | A visually appealing and user-friendly interface that provides a seamless experience across devices, built with cutting-edge technologies for optimal performance and responsiveness. |


## 📚 Tech Stack 📚

| <div style="width:140px">**Category**</div> | <div style="width:100px">**Choice**</div> | **Descriptions** |
|---|---|---|
| **Frontend** | [React](https://github.com/facebook/react) | Building a performant, interactive, and visually appealing interface. |
| **Web Framework** | [Next.js](https://github.com/vercel/next.js) | Building a performant, interactive, and visually appealing interface. |
| **Language** | [TypeScript](https://github.com/microsoft/TypeScript) | Building a performant, interactive, and visually appealing interface. |
| **CSS Framework** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Building a performant, interactive, and visually appealing interface. |
| **UI Library** | [Shadcn-UI](https://github.com/shadcn-ui/ui) | Building a performant, interactive, and visually appealing interface. |
| **Backend** | [Convex-DB](https://github.com/get-convex/convex-backend) | Real-time data management, serverless functions, and efficient queries. |
| **Authentication** | [Clerk](https://github.com/clerk/clerk-docs) | Seamless user authentication and authorization. |
| **Lucide Icon** | [Lucide-Icon](https://github.com/lucide-icons/lucide) | Intuitive and minimalist icons |
| **Zod** | [Zod](https://github.com/colinhacks/zod) | TypeScript-first schema validation with static type inference |
| **React-Hook-Form** | [React-Hook-Form](https://github.com/react-hook-form/react-hook-form) | React Hooks for form state management and validation. |

## Getting started

To clone and run this application, you'll need [Git](https://github.com/achris-alonzo30/hireme.git) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone [https://github.com/achris-alonzo30/hireme.git](https://github.com/achris-alonzo30/boxtrac.git)

# Go into the repository
$ cd boxtrac

# Install dependencies
$ npm install or bun install

# Run the app
$ npm run dev or bun run dev
```

## **Prerequisites**

> [Convex](https://docs.convex.dev/quickstart/nextjs) Create your account on Convex for free and get your API keys by following the instructions on the given link.

> [Clerk](https://clerk.com/docs/quickstarts/nextjs?_gl=1*16h2u9o*_gcl_au*MTA1NjE5MjEyNS4xNzAzNDYxNjMx*_ga*NjUzNTQzNzQ2LjE3MDM0NjE2MzE.*_ga_1WMF5X234K*MTcwMzQ2MTYzMC4xLjEuMTcwMzQ2MTc4Ny4wLjAuMA..) Create your account on Clerk for free and get your API keys by following the instructions on the given link.

Copy this and paste it in your .env or .env.local.
```
// run @npx convex init on terminal
CONVEX_DEPLOYMENT=<AUTO_GENERATED_BY_CONVEX>
NEXT_PUBLIC_CONVEX_URL=<AUTO_GENERATED_BY_CONVEX>

// Signin to Clerk: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2FwaXRhbC1zYXdmaXNoLTExLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_1gAeR4zzF764gPLcZhAkXvDK8NUyjAj2mN98UiUjr6

// This is for connecting Clerk with your database. You can start reading the docs: https://clerk.com/docs/integrations/webhooks/overview#webhooks-overview
CLERK_WEBHOOK_SECRET=whsec_v0BHtEbLesq2O/2NbZZmivQpWgvrz9B4
```
