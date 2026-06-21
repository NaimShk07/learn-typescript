## Steps

1. Initialize a project

   ```
   npm init -y
   ```

2. Install TypeScript

   ```
   npm install --save-dev typescript @types/node
   ```

3. Create a TypeScript configuration
   Generate a `tsconfig.json`:

   ```
   npx tsc --init
   ```

   ```js
   {
      "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true
      }
   }
   ```

4. Compile TypeScript
   ```
   npx tsc
   ```
5. Run TypeScript

   ```
   node dist/index.js
   ```

6. have to install library and type as well
7. To run code automatically
   ```
   "dev": "tsx watch src/server.ts"
   ```
