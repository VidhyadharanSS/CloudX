class Compressor {
    constructor(file, options = {}) {
      this.file = file;
      this.options = options;
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.compress();
    }
  
    compress() {
      let {
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        success,
        outputType = 'image/jpeg',
        quality = 1,
        error,
        progress,
      } = this.options;
  
      const URL = window.URL || window.webkitURL;
      const image = new Image();
      const src = URL.createObjectURL(this.file);
      image.src = src;
  
      image.onload = () => {
        const imageWidth = image.width;
        const imageHeight = image.height;
  
        let canvasWidth = width || imageWidth;
        let canvasHeight = height || imageHeight;
  
        if (maxHeight && imageHeight > maxHeight) canvasHeight = maxHeight;
        if (minHeight && imageHeight < minHeight) canvasHeight = minHeight;
  
        if (maxWidth && imageWidth > maxWidth) canvasWidth = maxWidth;
        if (minWidth && imageWidth < minWidth) canvasWidth = minWidth;
  
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
  
        this.ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  
        const totalSteps = 100;
        let currentStep = 0;
  
        const processImage = () => {
          if (currentStep < totalSteps) {
            this.ctx.drawImage(
              this.canvas,
              0,
              0,
              canvasWidth,
              canvasHeight,
              0,
              0,
              canvasWidth,
              canvasHeight
            );
            currentStep++;
            if (typeof progress === "function") {
              progress((currentStep / totalSteps) * 100);
            }
            requestAnimationFrame(processImage);
          } else {
            this.canvas.toBlob(
              (blob) => {
                if (blob) {
                  blob.name = this.file.name;
                  if (typeof success === "function") {
                    success(blob);
                  }
                } else if (typeof error === "function") {
                  error(new Error("Compression failed"));
                }
              },
              outputType,
              quality
            );
          }
        };
  
        processImage();
        URL.revokeObjectURL(src);
      };
    }
  }
  
  export default Compressor;