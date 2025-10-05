# Deploying the Application

This application is built with Vite and can be deployed to any static hosting service (such as Vercel, Netlify, or GitHub Pages).

## Build Process

The build process bundles all the application's assets into a `dist` directory, which is optimized for production.

1.  **Install Dependencies**: If you haven't already, install the project dependencies.
    ```bash
    npm install
    ```

2.  **Build for Production**: Run the build command to generate the production-ready files.
    ```bash
    npm run build
    ```
    This command will create a `dist` folder in the root of your project. This is the folder you will deploy.

## Local Preview

After building, you can preview the production build locally to ensure everything is working as expected.

```bash
npm run preview
```

This command will start a local static web server that serves the files from the `dist` directory.

## Deployment Instructions

To deploy the application, you need to upload the contents of the `dist` directory to your hosting provider.

### General Steps for Hosting Providers (Vercel, Netlify, etc.)

1.  **Connect your Git repository** to the hosting provider.
2.  **Configure the build settings**:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
3.  **Deploy**: The provider will automatically run the build command and deploy the contents of the `dist` directory.

The project is now ready for deployment. Just follow the steps in the `DEPLOYMENT.md` file to build and deploy the application.