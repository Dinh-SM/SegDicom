<div align="center">
  <h1>SegDicom</h1>
  <p>Small and lightweight web app learning project for case creation with DICOM series that can be segmented with image processing algorithms.</p>
  <img src="https://static.vecteezy.com/system/resources/thumbnails/012/634/664/small/art-deco-outline-stroke-in-golden-color-for-classy-and-luxury-style-premium-vintage-line-art-design-element-free-png.png" style="height: 75px; width:400px; object-fit: cover;">
</div>

### Modules
* <img height="15" src="https://user-images.githubusercontent.com/25181517/183890595-779a7e64-3f43-4634-bad2-eceef4e80268.png"> Angular web app
* <img height="15" src="https://user-images.githubusercontent.com/25181517/121405754-b4f48f80-c95d-11eb-8893-fc325bde617f.png"> .NET API
* <img height="15" src="https://miro.medium.com/v2/resize:fit:512/1*FNzg3F-qM6zhMSjwqfKVwA.png"> Python Azure Function
* <img height="15" src="https://mcr.microsoft.com/api/v1/catalog/productimage/813767ad40f7fdb7f48d6440d0df36e22893f0f2bf23c24893163b7a826cd33f"> Azurite Blob Storage

## Technology Stack

* <img height="15" src="https://user-images.githubusercontent.com/25181517/183890595-779a7e64-3f43-4634-bad2-eceef4e80268.png"> [**Angular 17**](https://angular.dev/) for the frontend web app
  * <img height="15" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png"> [**TypeScript**](https://www.typescriptlang.org/) for strongly typed <img height="15" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png"> [**JavaScript**](https://www.javascript.com/)
  * <img height="15" src="https://github.com/marwin1991/profile-technology-icons/assets/62091613/b40892ef-efb8-4b0e-a6b5-d1cfc2f3fc35"> [**Vite**](https://vitejs.dev/) for optimized builds and efficient HMR
  * 🌐 [**ngx-translate**](https://github.com/ngx-translate/core) for maintainable internationalization in:
    * 🇨🇦 English
    * 🇫🇷 French
    * 🇯🇵 Japanese
    * 🇻🇳 Vietnamese
  * 🩻 [**dicom.ts**](https://github.com/wearemothership/dicom.ts) for lightning fast DICOM rendering
  * 🌑 Dark mode support
* <img height="15" src="https://user-images.githubusercontent.com/25181517/121405754-b4f48f80-c95d-11eb-8893-fc325bde617f.png"> [**.NET 8.0**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview) for the C# backend API
  * <img height="15" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCDx1Gq9OhPHbGCw4K83O6b5jhBHRXmYLeMQ&usqp=CAU"> [**Entity Framework**](https://learn.microsoft.com/en-us/ef/) for in-memory database
  * <img height="15" src="https://seeklogo.com/images/O/openapi-logo-3E54DE56CD-seeklogo.com.png"> [**OpenAPI**](https://www.openapis.org/) for an comprehensible API description.
  * <img height="15" src="https://camo.githubusercontent.com/4a4aaf8672f1b530473d3f168504399b4572b1d8f89f268cadb8974c7655e53e/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f2d4671336e696752556f37552f5666614950754a4d6a66492f4141414141414141414c6f2f376f614c72725442686e772f73313630302f46656c6c6f772532424f616b2532425371756172652532425472616e73702e706e67"> [**Fellow Oak DICOM**](https://fo-dicom.github.io/stable/v5/index.html) for effortless DICOM tag parsing
* <img height="15" src="https://user-images.githubusercontent.com/25181517/183911544-95ad6ba7-09bf-4040-ac44-0adafedb9616.png"> [**Azure**](https://azure.microsoft.com/en-us) for cloud computing
  * <img height="15" src="https://mcr.microsoft.com/api/v1/catalog/productimage/813767ad40f7fdb7f48d6440d0df36e22893f0f2bf23c24893163b7a826cd33f"> [**Azurite**](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio%2Cblob-storage) for Azure Blob Storage emulation
  * <img height="15" src="https://miro.medium.com/v2/resize:fit:512/1*FNzg3F-qM6zhMSjwqfKVwA.png"> [**Azure Function**](https://azure.microsoft.com/en-us/products/functions) to execute event-driven serverless python code
    * <img height="15" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png"> [**Python 3.11**](https://www.python.org/) for DICOM segmentation with Image Processing techniques
      * <img height="15" src="https://imageio.readthedocs.io/en/stable/_static/imageio_logo.png"> [**imageio**](https://imageio.readthedocs.io/en/stable/) for image read and write operations with various format
      * <img height="15" src="https://numpy.org/images/logo.svg"> [**NumPy**](https://numpy.org/) for n-dimensional image data array manipulation
      * <img height="15" src="https://pydicom.github.io/images/logo/logo.png"> [**Pydicom**](https://pydicom.github.io/) for DICOM image open/read operations
      * <img height="15" src="https://scikit-image.org/docs/stable/_static/logo.png"> [**scikit-image**](https://scikit-image.org/) for modern image processing
      * Segmentation Algorithm Source: [**Visualizing and Analyzing DICOMs in Python**](https://www.kaggle.com/code/redwankarimsony/visualizing-and-analyzing-dicoms-in-python)
* ✨ README Template Inspiration: [**Full Stack FastAPI Template**](https://github.com/tiangolo/full-stack-fastapi-template)

## How to Use it

### Requirements

* <img height="15" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png"> [**Node**](https://nodejs.org/en/download/current)
* <img height="15" src="https://user-images.githubusercontent.com/25181517/121401671-49102800-c959-11eb-9f6f-74d49a5e1774.png"> [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* <img height="15" src="https://user-images.githubusercontent.com/25181517/121405754-b4f48f80-c95d-11eb-8893-fc325bde617f.png"> [**.NET SDK**](https://dotnet.microsoft.com/en-us/download/dotnet)
* <img height="15" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png"> [**Python**](https://www.python.org/downloads/release/python-3118/)
* <img height="15" src="https://user-images.githubusercontent.com/25181517/192108891-d86b6220-e232-423a-bf5f-90903e6887c3.png"> [**Visual Studio Code**](https://code.visualstudio.com)
* <img height="15" src="https://user-images.githubusercontent.com/25181517/183911544-95ad6ba7-09bf-4040-ac44-0adafedb9616.png"> [**Azure Storage Explorer**](https://azure.microsoft.com/en-us/products/storage/storage-explorer)

Do not forget to add angular, node and python paths to PATH environment variables.

Add the following lines in the user secrets of the .NET project:

```json
{
  "AzureDicomStorage": "UseDevelopmentStorage=true",
  "AzureDicomStorage:blob": "UseDevelopmentStorage=true"
}
```

### Installation

To install all necessary dependencies and libraries, please execute the following command in the project directory:

```bash
./install.sh
```

**Note**: Each module necessary dependencies and libraries can be installed individually by executing the corresponding scripts in the the `scripts/install` folder

### Start

To start the application, please execute the following command in the project directory:

```bash
./run.sh
```

**Note**:

* Each module can be run individually by executing the corresponding scripts in the the `scripts/run` folder
* The <img height="15" src="https://user-images.githubusercontent.com/25181517/183890595-779a7e64-3f43-4634-bad2-eceef4e80268.png"> **Angular** app will run on http://localhost:4200
* The <img height="15" src="https://user-images.githubusercontent.com/25181517/121405754-b4f48f80-c95d-11eb-8893-fc325bde617f.png"> **.NET** API will run on https://localhost:6900 (with  <img height="15" src="https://user-images.githubusercontent.com/25181517/186711335-a3729606-5a78-4496-9a36-06efcc74f800.png"> [**Swagger**](https://swagger.io/) on https://localhost:6900/swagger)
* The <img height="15" src="https://miro.medium.com/v2/resize:fit:512/1*FNzg3F-qM6zhMSjwqfKVwA.png"> **Python Azure Function** will run on http://localhost:6660/api/segment
* The <img height="15" src="https://mcr.microsoft.com/api/v1/catalog/productimage/813767ad40f7fdb7f48d6440d0df36e22893f0f2bf23c24893163b7a826cd33f"> **Azurite Blob Storage** content can be monitored with <img height="15" src="https://user-images.githubusercontent.com/25181517/183911544-95ad6ba7-09bf-4040-ac44-0adafedb9616.png"> **Azure Storage Explorer**