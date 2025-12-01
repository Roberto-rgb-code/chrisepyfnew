interface UploadResult {
  success: boolean;
  url?: string;
  base64?: string;
  error?: string;
}

/**
 * Convierte un archivo a base64 (sin guardar en Firestore)
 * @param file - Archivo de imagen o blob
 * @param userId - ID del usuario (opcional, solo para logging)
 * @returns URL base64 de la imagen
 */
export async function uploadDesignImage(
  file: File | Blob,
  userId?: string
): Promise<UploadResult> {
  try {
    console.log('🔧 uploadDesignImage iniciado (usando base64)');
    if (userId) {
      console.log('👤 User ID:', userId);
    } else {
      console.log('👤 Usuario no autenticado - modo local');
    }
    
    // Validar que sea un archivo de imagen
    if (file instanceof File) {
      if (!file.type || !file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen válida');
      }
    }
    
    // Validar tamaño del archivo (máximo 4MB para base64 en Firestore)
    // Base64 aumenta el tamaño ~33%, así que 4MB original = ~5.3MB en base64
    const maxSize = 4 * 1024 * 1024; // 4MB
    const fileSize = file instanceof File ? file.size : (file as Blob).size;
    
    if (!fileSize || fileSize === 0) {
      throw new Error('El archivo está vacío');
    }
    
    if (fileSize > maxSize) {
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      throw new Error(`La imagen es demasiado grande (${sizeMB}MB). Máximo 4MB.`);
    }

    // Convertir archivo a base64
    console.log('🔄 Convirtiendo archivo a base64...');
    const base64 = await fileToBase64(file);
    
    if (!base64 || base64.length === 0) {
      throw new Error('Error al convertir la imagen a base64');
    }
    
    const imageType = getImageType(file);
    const base64Url = `data:image/${imageType};base64,${base64}`;
    
    console.log('✅ Imagen convertida a base64');
    console.log('📊 Tipo de imagen:', imageType);
    console.log('📏 Tamaño base64:', (base64.length / 1024).toFixed(2), 'KB');

    return {
      success: true,
      url: base64Url,
      base64: base64
    };
  } catch (error: any) {
    console.error('💥 Error procesando imagen:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al procesar la imagen'
    };
  }
}

/**
 * Convierte un archivo a base64
 */
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const result = reader.result as string;
        if (!result || !result.includes(',')) {
          reject(new Error('Error al leer el archivo'));
          return;
        }
        // Remover el prefijo data:image/...;base64,
        const base64 = result.split(',')[1];
        if (!base64 || base64.length === 0) {
          reject(new Error('Error al extraer datos base64'));
          return;
        }
        resolve(base64);
      } catch (error) {
        reject(new Error('Error al procesar el resultado: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.onabort = () => {
      reject(new Error('Lectura del archivo cancelada'));
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error('Error al iniciar la lectura del archivo: ' + (error as Error).message));
    }
  });
}

/**
 * Obtiene el tipo de imagen del archivo
 */
function getImageType(file: File | Blob): string {
  // Primero intentar usar el tipo MIME del archivo
  if (file.type) {
    if (file.type.includes('png')) return 'png';
    if (file.type.includes('gif')) return 'gif';
    if (file.type.includes('webp')) return 'webp';
    if (file.type.includes('jpeg') || file.type.includes('jpg')) return 'jpeg';
  }
  
  // Si no hay tipo MIME, usar la extensión del nombre del archivo
  if (file instanceof File && file.name) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'png') return 'png';
    if (extension === 'gif') return 'gif';
    if (extension === 'webp') return 'webp';
    if (extension === 'jpg' || extension === 'jpeg') return 'jpeg';
  }
  
  // Default a jpeg
  return 'jpeg';
}

/**
 * Convierte base64 a Blob para subirlo
 * @param base64 - String en formato data:image/...;base64,...
 * @returns Blob
 */
export function base64ToBlob(base64: string): Blob {
  // Extraer el tipo de imagen y los datos
  const parts = base64.split(',');
  const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const raw = atob(parts[1]);
  const array = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }

  return new Blob([array], { type: contentType });
}
