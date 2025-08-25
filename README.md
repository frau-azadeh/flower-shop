# 💐 Flower Shop

Minimal, fast e-commerce starter for selling flowers. Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

State is handled by **Redux Toolkit** , and forms by , **React Hook Form + Zod**. RTL-ready.

Live Demo: https://flower-shop-beta-taupe.vercel.app/

Repo: https://github.com/frau-azadeh/flower-shop

---
✨ Features

⚡ Blazing fast performance with SSR/ISR via App Router

🧩 Type-safe forms powered by React Hook Form + Zod

🎯 Scalable global state with Redux Toolkit + local persistence

🌍 Right-to-Left support out of the box

🧱 Accessible UI components with Headless UI & Lucide Icons

💨 Modular styling with Tailwind CSS

🧼 Consistent code formatting with Prettier

---
## 🖼️ UI Preview

![Hero section](https://raw.githubusercontent.com/frau-azadeh/flower-shop/master/public/7.png)
![Product section](https://raw.githubusercontent.com/frau-azadeh/flower-shop/master/public/8.png)
![User Panel](https://raw.githubusercontent.com/frau-azadeh/flower-shop/master/public/3.png)
![Admin Panel](https://raw.githubusercontent.com/frau-azadeh/flower-shop/master/public/4.png)
![Admin Panel](https://raw.githubusercontent.com/frau-azadeh/flower-shop/master/public/5.png)
![Admin Panel](https://raw.githubusercontent.com/frau-azadeh/flower-shop/master/public/6.png)

---

## 🚀 Tech Stack

- ⚛️ **React (TypeScript)** – Component-based UI development

- 💨 **Tailwind CSS** – Utility-first styling framework

- 🧩 **React Hook Form + Zod** – Form state management and schema validation

- 🎯 **Redux Toolkit** – Global state with local persistence

- 🧼 **Prettier** – Code formatting and consistency
  
- 🐘 **Supabase** – Postgres DB, Auth, (optional Storage)

- 🧱 **Headless UI & Lucide** – Accessible components & icons

---

## 💻 Getting Started

1.Clone the repository:

        git clone https://github.com/faru-azadeh/Flower-Shop.git

        cd flower-shop

2.Install dependencies:

        npm i

3.Start the development server:

        npm run dev

---

## 📁 Project Structure

```
.
├─ .github/                     # CI/CD workflows, issue templates, etc.
├─ public/                      # Static assets served as-is (images, meta, robots, etc.)
├─ src/
│  ├─ app/                      # Next.js App Router: routes, layouts, and route handlers
│  │  ├─ admin-login/           # Admin sign-in route (pages, actions, UI)
│  │  ├─ admin/                 # Admin dashboard & management routes (products, orders, users)
│  │  ├─ api/                   # Route Handlers (Next.js API) e.g. /api/*
│  │  ├─ auth/                  # Auth flows (login/register/reset) and related views
│  │  ├─ blog/                  # Marketing/blog routes
│  │  ├─ cart/                  # Cart & checkout routes
│  │  ├─ components/            # Route-scoped components for app/ (server/client as needed)
│  │  ├─ products/              # Catalog, product detail pages, filtering, pagination
│  │  ├─ user/                  # User area (profile, orders, addresses)
│  │  ├─ AuthBootstrap.tsx      # Auth/session initializer (client boundary)
│  │  ├─ ReduxProvider.tsx      # RTK Provider + persistence gate
│  │  ├─ SiteChrome.tsx         # App shell (header, footer, containers)
│  │  ├─ favicon.ico
│  │  ├─ globals.css            # Global styles (Tailwind layers, CSS vars)
│  │  ├─ layout.tsx             # Root layout (metadata, fonts, providers)
│  │  └─ page.tsx               # Home page (hero, featured products)
│  │
│  ├─ lib/                      # App utilities & singletons
│  │  ├─ store.ts               # RTK store configuration (slices, middleware)
│  │  ├─ persist.ts             # Client-side persistence helpers (e.g., localStorage)
│  │  ├─ fetcher.ts             # Data fetching helpers (server/client)
│  │  └─ utils.ts               # Shared helpers (formatters, guards)
│  │
│  ├─ schemas/                  # Zod schemas (validation + inference)
│  │  ├─ product.schema.ts      # Product create/update
│  │  ├─ cart.schema.ts         # Cart & checkout payloads
│  │  └─ auth.schema.ts         # Login/register/reset
│  │
│  ├─ store/                    # Redux “features” (RTK slices)
│  │  ├─ cart/                  # cart.slice.ts, selectors, thunks
│  │  ├─ products/              # products.slice.ts (catalog, filters)
│  │  ├─ user/                  # user.slice.ts (profile, session mirror)
│  │  └─ ui/                    # ui.slice.ts (modals, toasts, theme)
│  │
│  ├─ styles/                   # Styling assets beyond globals
│  │  ├─ fonts.css              # Local font faces (e.g., Vazir)
│  │  └─ tailwind.css           # Tailwind entry (base/components/utilities)
│  │
│  ├─ types/                    # Global TypeScript types & API contracts
│  │  ├─ product.d.ts
│  │  ├─ cart.d.ts
│  │  └─ index.d.ts
│  │
│  └─ components/               # App-wide reusable UI components
│     ├─ ui/                    # Headless UI wrappers, primitives (Button, Input, Modal)
│     ├─ forms/                 # RHF-controlled inputs, form layouts
│     ├─ product/               # ProductCard, ProductGrid, Price, Rating
│     ├─ cart/                  # CartDrawer, CartItem, Summary
│     └─ layout/                # Navbar, Footer, Breadcrumbs
│
├─ .gitignore
└─ .prettierrc.json             # Code style (kept in sync with ESLint)


```

---
## 🧪 Code Quality

Fully typed with TypeScript

Enforced code style via ESLint & Prettier

Follows Redux Toolkit best practices
---

## 🤝 Contributing

Contributions are warmly welcomed!

Feel free to fork this repo, create a feature branch, and submit a pull request.

---

## 🌻Developed by

Azadeh Sharifi Soltani
