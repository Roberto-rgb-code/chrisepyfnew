export const emailTemplates = {
  // Email de confirmación de compra
  orderConfirmation: (orderData: any) => ({
    subject: `✅ Confirmación de Pedido #${orderData.id}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Pedido</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Pedido Confirmado!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Gracias por elegirnos</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Hola ${orderData.customerName},</h2>
            <p>¡Excelente noticia! Tu pedido ha sido confirmado y está siendo procesado.</p>

            <!-- Order Details -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📋 Detalles del Pedido</h3>
              <p><strong>Número de Pedido:</strong> #${orderData.id}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-MX')}</p>
              <p><strong>Total:</strong> $${orderData.total} MXN</p>
            </div>

            <!-- Products -->
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">🛍️ Productos</h3>
              ${orderData.items.map((item: any) => `
                <div style="border: 1px solid #e0e0e0; padding: 15px; margin: 10px 0; border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 15px;">
                    ${item.customImage ? `
                      <img src="${item.customImage}" alt="Diseño personalizado" style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px; border: 1px solid #ddd;">
                    ` : ''}
                    <div style="flex: 1;">
                      <h4 style="margin: 0 0 10px 0; color: #333;">${item.modelName}</h4>
                      <p style="margin: 5px 0; color: #666;">Cantidad: ${item.quantity}</p>
                      <p style="margin: 5px 0; color: #666;">Precio: $${item.price} MXN</p>
                      ${item.customImage ? '<p style="margin: 5px 0; color: #28a745; font-weight: bold;">🎨 Con diseño personalizado</p>' : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Next Steps -->
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin-top: 0;">🚀 Próximos Pasos</h3>
              <ul style="color: #2d5a2d;">
                <li>Procesaremos tu pedido en las próximas 24 horas</li>
                <li>Te enviaremos un email cuando esté listo para envío</li>
                <li>Recibirás el tracking number para seguir tu paquete</li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; margin: 30px 0;">
              <p>¿Tienes alguna pregunta?</p>
              <p>📧 Email: soporte@empaquesyfundas.com</p>
              <p>📱 WhatsApp: +52 33 1149 3852</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              © 2024 Empaques & Fundas. Todos los derechos reservados.
            </p>
          </div>
        </body>
      </html>
    `
  }),

  // Email de procesamiento
  orderProcessing: (orderData: any) => ({
    subject: `🔄 Tu Pedido #${orderData.id} está siendo procesado`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pedido en Procesamiento</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⚡ Procesando tu Pedido</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Estamos trabajando en tu funda personalizada</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Hola ${orderData.customerName},</h2>
            <p>¡Buenas noticias! Tu pedido #${orderData.id} está siendo procesado por nuestro equipo de producción.</p>

            <!-- Status -->
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">📦 Estado del Pedido</h3>
              <p style="color: #856404; margin: 0;">🔄 En Procesamiento - Personalizando tu funda</p>
            </div>

            <!-- Timeline -->
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">📅 Timeline Estimado</h3>
              <div style="display: flex; justify-content: space-between; margin: 15px 0;">
                <div style="text-align: center; flex: 1;">
                  <div style="background: #28a745; color: white; border-radius: 50%; width: 30px; height: 30px; line-height: 30px; margin: 0 auto 10px;">✓</div>
                  <p style="font-size: 12px; margin: 0;">Confirmado</p>
                </div>
                <div style="text-align: center; flex: 1;">
                  <div style="background: #ffc107; color: white; border-radius: 50%; width: 30px; height: 30px; line-height: 30px; margin: 0 auto 10px;">⚡</div>
                  <p style="font-size: 12px; margin: 0;">Procesando</p>
                </div>
                <div style="text-align: center; flex: 1;">
                  <div style="background: #6c757d; color: white; border-radius: 50%; width: 30px; height: 30px; line-height: 30px; margin: 0 auto 10px;">📦</div>
                  <p style="font-size: 12px; margin: 0;">Enviado</p>
                </div>
                <div style="text-align: center; flex: 1;">
                  <div style="background: #6c757d; color: white; border-radius: 50%; width: 30px; height: 30px; line-height: 30px; margin: 0 auto 10px;">🏠</div>
                  <p style="font-size: 12px; margin: 0;">Entregado</p>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c5460; margin-top: 0;">⏰ Tiempo Estimado</h3>
              <p style="color: #0c5460; margin: 0;">Tu funda personalizada estará lista en 1-2 días hábiles.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              © 2024 Empaques & Fundas. Todos los derechos reservados.
            </p>
          </div>
        </body>
      </html>
    `
  }),

  // Email de envío
  orderShipped: (orderData: any) => ({
    subject: `🚚 Tu Pedido #${orderData.id} ha sido enviado`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pedido Enviado</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚚 ¡En Camino!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Tu funda personalizada está en camino</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Hola ${orderData.customerName},</h2>
            <p>¡Excelente! Tu pedido #${orderData.id} ha sido enviado y está en camino a tu dirección.</p>

            <!-- Tracking Info -->
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin-top: 0;">📦 Información de Envío</h3>
              <p><strong>Número de Rastreo:</strong> ${orderData.trackingNumber || 'Se asignará próximamente'}</p>
              <p><strong>Empresa de Envío:</strong> ${orderData.shippingCompany || 'Paquetexpress'}</p>
              <p><strong>Tiempo Estimado:</strong> 2-3 días hábiles</p>
            </div>

            <!-- Tracking Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${orderData.trackingUrl || '#'}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                🔍 Rastrear Mi Paquete
              </a>
            </div>

            <!-- Delivery Info -->
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">📋 Información de Entrega</h3>
              <p style="color: #856404; margin: 0;">Asegúrate de estar disponible en la dirección de envío. Si no estás presente, el paquete se dejará en un lugar seguro o se programará una nueva entrega.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              © 2024 Empaques & Fundas. Todos los derechos reservados.
            </p>
          </div>
        </body>
      </html>
    `
  })
};
