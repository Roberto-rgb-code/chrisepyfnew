import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  success: boolean;
  url?: string;
  storagePath?: string;
  error?: string;
}

/**
 * Sube una imagen al Firebase Storage
 * @param file - Archivo de imagen o blob
 * @param userId - ID del usuario
 * @returns URL pública de la imagen
 */
export async function uploadDesignImage(
  file: File | Blob,
  userId: string
): Promise<UploadResult> {
  try {
    console.log('🔧 uploadDesignImage iniciado');
    console.log('📦 Storage disponible:', !!storage);
    console.log('👤 User ID:', userId);
    
    if (!storage) {
      console.error('❌ Firebase Storage no está inicializado');
      throw new Error('Firebase Storage no está inicializado');
    }

    // Crear ruta: custom_images/{userId}/design_{timestamp}.jpg
    const timestamp = Date.now();
    const fileExtension = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const fileName = `design_${timestamp}_${uuidv4()}.${fileExtension}`;
    const storagePath = `custom_images/${userId}/${fileName}`;

    console.log('📁 Ruta de almacenamiento:', storagePath);

    // Crear referencia en Storage
    const storageRef = ref(storage, storagePath);
    console.log('📤 Referencia creada:', storageRef);

    // Subir archivo
    console.log('🚀 Iniciando uploadBytes...');
    await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        userId: userId,
        uploadedAt: new Date().toISOString(),
        originalName: file instanceof File ? file.name : 'custom_design'
      }
    });

    console.log('✅ uploadBytes completado');

    // Obtener URL pública
    console.log('🔗 Obteniendo URL de descarga...');
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('✅ URL obtenida:', downloadUrl);

    return {
      success: true,
      url: downloadUrl,
      storagePath: storagePath
    };
  } catch (error: any) {
    console.error('💥 Error subiendo imagen:', error);
    console.error('📋 Detalles del error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return {
      success: false,
      error: error.message
    };
  }
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
