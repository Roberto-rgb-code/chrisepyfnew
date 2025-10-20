/**
 * Genera una imagen pre-renderizada del case personalizado
 * para mostrar en Stripe checkout
 */
export async function generateCaseImage(
  colorURL: string,
  maskURL: string,
  customImage: string,
  imageControls: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('No se pudo obtener contexto del canvas'));
      return;
    }

    // Crear imagen base del teléfono
    const phoneImg = new Image();
    phoneImg.crossOrigin = 'anonymous';
    
    phoneImg.onload = () => {
      // Crear imagen de la máscara
      const maskImg = new Image();
      maskImg.crossOrigin = 'anonymous';
      
      maskImg.onload = () => {
        // Crear imagen personalizada
        const customImg = new Image();
        customImg.crossOrigin = 'anonymous';
        
        customImg.onload = () => {
          // Configurar canvas
          canvas.width = phoneImg.width;
          canvas.height = phoneImg.height;
          
          // Dibujar imagen base del teléfono
          ctx.drawImage(phoneImg, 0, 0);
          
          // Aplicar máscara y imagen personalizada
          ctx.globalCompositeOperation = 'source-over';
          
          // Crear un canvas temporal para la imagen personalizada con transformaciones
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          if (!tempCtx) {
            reject(new Error('No se pudo crear canvas temporal'));
            return;
          }
          
          tempCanvas.width = phoneImg.width;
          tempCanvas.height = phoneImg.height;
          
          // Aplicar transformaciones
          tempCtx.save();
          tempCtx.translate(phoneImg.width / 2, phoneImg.height / 2);
          tempCtx.scale(imageControls.scale, imageControls.scale);
          tempCtx.rotate((imageControls.rotation * Math.PI) / 180);
          tempCtx.scale(imageControls.flipX, imageControls.flipY);
          tempCtx.translate(imageControls.position.x, imageControls.position.y);
          tempCtx.translate(-phoneImg.width / 2, -phoneImg.height / 2);
          
          tempCtx.drawImage(customImg, 0, 0, phoneImg.width, phoneImg.height);
          tempCtx.restore();
          
          // Aplicar máscara
          ctx.globalCompositeOperation = 'source-atop';
          ctx.drawImage(maskImg, 0, 0, phoneImg.width, phoneImg.height);
          
          // Restaurar modo de composición
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(tempCanvas, 0, 0);
          
          // Convertir a URL
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        };
        
        customImg.onerror = () => reject(new Error('Error cargando imagen personalizada'));
        customImg.src = customImage;
      };
      
      maskImg.onerror = () => reject(new Error('Error cargando máscara'));
      maskImg.src = maskURL;
    };
    
    phoneImg.onerror = () => reject(new Error('Error cargando imagen del teléfono'));
    phoneImg.src = colorURL;
  });
}
