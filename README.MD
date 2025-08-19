
## File and folder structure 

```
└─ .
   ├─ .env
   ├─ .env.example
   ├─ app.ts
   ├─ index.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ controllers
   │  │  └─ auth.controllers.ts
   │  ├─ db
   │  │  └─ connectDB.ts
   │  ├─ docs
   │  │  ├─ health-docs.ts
   │  │  ├─ home-docs.ts
   │  │  └─ swagger.ts
   │  ├─ middlewares
   │  │  ├─ auth.middleware.ts
   │  │  ├─ error.middleware.ts
   │  │  ├─ limiter.middleware.ts
   │  │  ├─ multer.middleware.ts
   │  │  └─ validate.middleware.ts
   │  ├─ routes
   │  │  ├─ index.ts
   │  │  └─ user.route.ts
   │  ├─ schemas
   │  │  └─ user.schema.ts
   │  ├─ services
   │  │  └─ auth.service.ts
   │  └─ utils
   │     ├─ api.error.ts
   │     ├─ auth.helper.ts
   │     ├─ catch.async.ts
   │     └─ success.response.ts
   └─ tsconfig.json

   ```