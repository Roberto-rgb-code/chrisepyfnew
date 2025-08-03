// Datos de los teléfonos
const phoneData = [
    { "id": "ip11promax", "modelName": "iPhone 11 Pro Max", "colorURL": "downloaded_images/ip11promax_c002_color.png", "maskURL": "downloaded_images/ip11promax_c002_mask.png" },
    { "id": "ip11pro", "modelName": "iPhone 11 Pro", "colorURL": "downloaded_images/ip11pro_c002_color.png", "maskURL": "downloaded_images/ip11pro_c002_mask.png" },
    { "id": "ip11", "modelName": "iPhone 11", "colorURL": "downloaded_images/ip11_c002_color.png", "maskURL": "downloaded_images/ip11_c002_mask.png" },
    { "id": "ip12mini", "modelName": "iPhone 12 Mini", "colorURL": "downloaded_images/ip12mini_c002_color.png", "maskURL": "downloaded_images/ip12mini_c002_mask.png" },
    { "id": "ip12promax", "modelName": "iPhone 12 Pro Max", "colorURL": "downloaded_images/ip12promax_c002_color.png", "maskURL": "downloaded_images/ip12promax_c002_mask.png" },
    { "id": "ip12pro", "modelName": "iPhone 12 Pro", "colorURL": "downloaded_images/ip12pro_c002_color.png", "maskURL": "downloaded_images/ip12pro_c002_mask.png" },
    { "id": "ip12", "modelName": "iPhone 12", "colorURL": "downloaded_images/ip12_c002_color.png", "maskURL": "downloaded_images/ip12_c002_mask.png" },
    { "id": "ip13mini", "modelName": "iPhone 13 Mini", "colorURL": "downloaded_images/ip13mini_c002_color.png", "maskURL": "downloaded_images/ip13mini_c002_mask.png" },
    { "id": "ip13promax", "modelName": "iPhone 13 Pro Max", "colorURL": "downloaded_images/ip13promax_c002_color.png", "maskURL": "downloaded_images/ip13promax_c002_mask.png" },
    { "id": "ip13pro", "modelName": "iPhone 13 Pro", "colorURL": "downloaded_images/ip13pro_c002_color.png", "maskURL": "downloaded_images/ip13pro_c002_mask.png" },
    { "id": "ip13", "modelName": "iPhone 13", "colorURL": "downloaded_images/ip13_c002_color.png", "maskURL": "downloaded_images/ip13_c002_mask.png" },
    { "id": "ip14max", "modelName": "iPhone 14 Plus", "colorURL": "downloaded_images/ip14max_c002_color.png", "maskURL": "downloaded_images/ip14max_c002_mask.png" },
    { "id": "ip14promax", "modelName": "iPhone 14 Pro Max", "colorURL": "downloaded_images/ip14promax_c002_color.png", "maskURL": "downloaded_images/ip14promax_c002_mask.png" },
    { "id": "ip14pro", "modelName": "iPhone 14 Pro", "colorURL": "downloaded_images/ip14pro_c002_color.png", "maskURL": "downloaded_images/ip14pro_c002_mask.png" },
    { "id": "ip14", "modelName": "iPhone 14", "colorURL": "downloaded_images/ip14_c002_color.png", "maskURL": "downloaded_images/ip14_c002_mask.png" },
    { "id": "ip15plus", "modelName": "iPhone 15 Plus", "colorURL": "downloaded_images/ip15plus_c002_color.png", "maskURL": "downloaded_images/ip15plus_c002_mask.png" },
    { "id": "ip15promax", "modelName": "iPhone 15 Pro Max", "colorURL": "downloaded_images/ip15promax_c002_color.png", "maskURL": "downloaded_images/ip15promax_c002_mask.png" },
    { "id": "ip15pro", "modelName": "iPhone 15 Pro", "colorURL": "downloaded_images/ip15pro_c002_color.png", "maskURL": "downloaded_images/ip15pro_c002_mask.png" },
    { "id": "ip15", "modelName": "iPhone 15", "colorURL": "downloaded_images/ip15_c002_color.png", "maskURL": "downloaded_images/ip15_c002_mask.png" },
    { "id": "ip16plus", "modelName": "iPhone 16 Plus", "colorURL": "downloaded_images/ip16plus_c002_color.png", "maskURL": "downloaded_images/ip16plus_c002_mask.png" },
    { "id": "ip16pro", "modelName": "iPhone 16 Pro", "colorURL": "downloaded_images/ip16pro_c002_color.png", "maskURL": "downloaded_images/ip16pro_c002_mask.png" },
    { "id": "ip16", "modelName": "iPhone 16", "colorURL": "downloaded_images/ip16_c002_color.png", "maskURL": "downloaded_images/ip16_c002_mask.png" },
    { "id": "ip7p", "modelName": "iPhone 7 Plus", "colorURL": "downloaded_images/ip7p_c002_color.png", "maskURL": "downloaded_images/ip7p_c002_mask.png" },
    { "id": "ip7", "modelName": "iPhone 7", "colorURL": "downloaded_images/ip7_c002_color.png", "maskURL": "downloaded_images/ip7_c002_mask.png" },
    { "id": "ip8p", "modelName": "iPhone 8 Plus", "colorURL": "downloaded_images/ip8p_c002_color.png", "maskURL": "downloaded_images/ip8p_c002_mask.png" },
    { "id": "ip8", "modelName": "iPhone 8", "colorURL": "downloaded_images/ip8_c002_color.png", "maskURL": "downloaded_images/ip8_c002_mask.png" },
    { "id": "ipse2", "modelName": "iPhone SE 2", "colorURL": "downloaded_images/ipse2_c002_color.png", "maskURL": "downloaded_images/ipse2_c002_mask.png" },
    { "id": "ipse3", "modelName": "iPhone SE 3", "colorURL": "downloaded_images/ipse3_c002_color.png", "maskURL": "downloaded_images/ipse3_c002_mask.png" },
    { "id": "ipse4", "modelName": "iPhone SE 4", "colorURL": "downloaded_images/ipse4_c118_color.jpg", "maskURL": "downloaded_images/ipse4_c118_mask.png" },
    { "id": "ipxr", "modelName": "iPhone XR", "colorURL": "downloaded_images/ipxr_c002_color.png", "maskURL": "downloaded_images/ipxr_c002_mask.png" },
    { "id": "ipxsmax", "modelName": "iPhone XS Max", "colorURL": "downloaded_images/ipxsmax_c002_color.png", "maskURL": "downloaded_images/ipxsmax_c002_mask.png" },
    { "id": "ipxs", "modelName": "iPhone XS", "colorURL": "downloaded_images/ipxs_c002_color.png", "maskURL": "downloaded_images/ipxs_c002_mask.png" },
    { "id": "ipx", "modelName": "iPhone X", "colorURL": "downloaded_images/ipx_c002_color.png", "maskURL": "downloaded_images/ipx_c002_mask.png" },
    { "id": "s24u", "modelName": "Samsung Galaxy S24 Ultra", "colorURL": "downloaded_images/s24u_c002_color.png", "maskURL": "downloaded_images/s24u_c002_mask.png" },
    { "id": "s24p", "modelName": "Samsung Galaxy S24+", "colorURL": "downloaded_images/s24p_c002_color.png", "maskURL": "downloaded_images/s24p_c002_mask.png" },
    { "id": "s24", "modelName": "Samsung Galaxy S24", "colorURL": "downloaded_images/s24_c002_color.png", "maskURL": "downloaded_images/s24_c002_mask.png" },
    { "id": "s24fe", "modelName": "Samsung Galaxy S24 FE", "colorURL": "downloaded_images/s24fe_c002_color.png", "maskURL": "downloaded_images/s24fe_c002_mask.png" },
    { "id": "s23u", "modelName": "Samsung Galaxy S23 Ultra", "colorURL": "downloaded_images/s23u_c002_color.png", "maskURL": "downloaded_images/s23u_c002_mask.png" },
    { "id": "s23p", "modelName": "Samsung Galaxy S23+", "colorURL": "downloaded_images/s23p_c002_color.png", "maskURL": "downloaded_images/s23p_c002_mask.png" },
    { "id": "s23", "modelName": "Samsung Galaxy S23", "colorURL": "downloaded_images/s23_c002_color.png", "maskURL": "downloaded_images/s23_c002_mask.png" },
    { "id": "s23fe", "modelName": "Samsung Galaxy S23 FE", "colorURL": "downloaded_images/s23fe_c002_color.png", "maskURL": "downloaded_images/s23fe_c002_mask.png" },
    { "id": "s22u", "modelName": "Samsung Galaxy S22 Ultra", "colorURL": "downloaded_images/s22u_c002_color.png", "maskURL": "downloaded_images/s22u_c002_mask.png" },
    { "id": "s22p", "modelName": "Samsung Galaxy S22+", "colorURL": "downloaded_images/s22p_c002_color.png", "maskURL": "downloaded_images/s22p_c002_mask.png" },
    { "id": "s22", "modelName": "Samsung Galaxy S22", "colorURL": "downloaded_images/s22_c002_color.png", "maskURL": "downloaded_images/s22_c002_mask.png" },
    { "id": "s21u", "modelName": "Samsung Galaxy S21 Ultra", "colorURL": "downloaded_images/s21u_c002_color.png", "maskURL": "downloaded_images/s21u_c002_mask.png" },
    { "id": "s21p", "modelName": "Samsung Galaxy S21+", "colorURL": "downloaded_images/s21p_c002_color.png", "maskURL": "downloaded_images/s21p_c002_mask.png" },
    { "id": "s21", "modelName": "Samsung Galaxy S21", "colorURL": "downloaded_images/s21_c002_color.png", "maskURL": "downloaded_images/s21_c002_mask.png" },
    { "id": "s21fe", "modelName": "Samsung Galaxy S21 FE", "colorURL": "downloaded_images/s21fe_c002_color.png", "maskURL": "downloaded_images/s21fe_c002_mask.png" },
    { "id": "zflip6", "modelName": "Samsung Galaxy Z Flip 6", "colorURL": "downloaded_images/zflip6_c105_color.png", "maskURL": "downloaded_images/zflip6_c105_mask.png" },
    { "id": "zflip5", "modelName": "Samsung Galaxy Z Flip 5", "colorURL": "downloaded_images/zflip5_c105_color.png", "maskURL": "downloaded_images/zflip5_c105_mask.png" },
    { "id": "zflip4", "modelName": "Samsung Galaxy Z Flip 4", "colorURL": "downloaded_images/zflip4_c105_color.png", "maskURL": "downloaded_images/zflip4_c105_mask.png" },
    { "id": "zflip3", "modelName": "Samsung Galaxy Z Flip 3", "colorURL": "downloaded_images/zflip3_c002_color.png", "maskURL": "downloaded_images/zflip3_c002_mask.png" },
    { "id": "zflip", "modelName": "Samsung Galaxy Z Flip", "colorURL": "downloaded_images/zflip_c004_color.png", "maskURL": "downloaded_images/zflip_c004_mask.png" },
    { "id": "galaxyzf6", "modelName": "Samsung Galaxy Z Fold 6", "colorURL": "downloaded_images/galaxyzf6_c105_color.png", "maskURL": "downloaded_images/galaxyzf6_c105_mask.png" },
    { "id": "galaxyzf5", "modelName": "Samsung Galaxy Z Fold 5", "colorURL": "downloaded_images/galaxyzf5_c105_color.png", "maskURL": "downloaded_images/galaxyzf5_c105_mask.png" },
    { "id": "galaxyzf4", "modelName": "Samsung Galaxy Z Fold 4", "colorURL": "downloaded_images/galaxyzf4_c105_color.png", "maskURL": "downloaded_images/galaxyzf4_c105_mask.png" },
    { "id": "galaxyzf3", "modelName": "Samsung Galaxy Z Fold 3", "colorURL": "downloaded_images/galaxyzf3_c004_color.png", "maskURL": "downloaded_images/galaxyzf3_c004_mask.png" },
    { "id": "galaxyzf2", "modelName": "Samsung Galaxy Z Fold 2", "colorURL": "downloaded_images/galaxyzf2_c004_color.png", "maskURL": "downloaded_images/galaxyzf2_c004_mask.png" },
    { "id": "pixel9pxl", "modelName": "Google Pixel 9 Pro XL", "colorURL": "downloaded_images/pixel9pxl_c002_color.png", "maskURL": "downloaded_images/pixel9pxl_c002_mask.png" },
    { "id": "pixel9prof", "modelName": "Google Pixel 9 Pro Fold", "colorURL": "downloaded_images/pixel9prof_c004_color.png", "maskURL": "downloaded_images/pixel9prof_c004_mask.png" },
    { "id": "pixel9p", "modelName": "Google Pixel 9 Pro", "colorURL": "downloaded_images/pixel9p_c002_color.png", "maskURL": "downloaded_images/pixel9p_c002_mask.png" },
    { "id": "a90", "modelName": "Samsung Galaxy A90", "colorURL": "downloaded_images/a90_c002_color.png", "maskURL": "downloaded_images/a90_c002_mask.png" },
    { "id": "a825g", "modelName": "Samsung Galaxy A82 5G", "colorURL": "downloaded_images/a825g_c002_color.png", "maskURL": "downloaded_images/a825g_c002_mask.png" },
    { "id": "a81", "modelName": "Samsung Galaxy A81", "colorURL": "downloaded_images/a81_c002_color.png", "maskURL": "downloaded_images/a81_c002_mask.png" }
  ];
  
  // Estado de la aplicación
  let selectedModel = phoneData[0];
  let userImageSrc = null;
  let imageControls = {
    scale: 1,
    rotation: 0,
    flipX: 1,
    flipY: 1,
    position: { x: 0, y: 0 }
  };
  let showCheckoutForm = false;
  let clientData = {
    name: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    state: "",
    country: "",
    exteriorNumber: "",
    interiorNumber: ""
  };
  
  // Referencias a elementos del DOM
  const modelSelect = document.getElementById('model-select');
  const imageUpload = document.getElementById('image-upload');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const clearImageBtn = document.getElementById('clear-image');
  const baseImage = document.getElementById('base-image');
  const customImageContainer = document.getElementById('custom-image-container');
  const customImageWrapper = document.getElementById('custom-image-wrapper');
  const customImage = document.getElementById('custom-image');
  const addToCartBtn = document.getElementById('add-to-cart');
  const checkoutFormContainer = document.getElementById('checkout-form-container');
  const mainControls = document.getElementById('main-controls');
  const removeImageBtn = document.getElementById('remove-image');
  
  // Inicialización
  function init() {
    // Llenar selector de modelos
    modelSelect.innerHTML = phoneData.map(item => 
      `<option value="${item.modelName}">${item.modelName}</option>`
    ).join('');
  
    // Configurar modelo inicial
    updateModel();
  
    // Event listeners
    setupEventListeners();
  
    // Inicializar iconos de Lucide
    lucide.createIcons();
  }
  
  function setupEventListeners() {
    // Cambio de modelo
    modelSelect.addEventListener('change', handleModelChange);
  
    // Upload de imagen
    imageUpload.addEventListener('change', handleUpload);
  
    // Limpiar imagen
    clearImageBtn.addEventListener('click', clearImage);
    removeImageBtn.addEventListener('click', clearImage);
  
    // Add to cart
    addToCartBtn.addEventListener('click', handleAddToCart);
  
    // Checkout
    document.getElementById('proceed-payment').addEventListener('click', handleCheckout);
    document.getElementById('cancel-checkout').addEventListener('click', () => {
      showCheckoutForm = false;
      updateCheckoutVisibility();
    });
  
    // Controles de imagen
    document.getElementById('scale-up').addEventListener('click', () => handleScale(0.1));
    document.getElementById('scale-down').addEventListener('click', () => handleScale(-0.1));
    document.getElementById('rotate-left').addEventListener('click', () => handleRotation(-90));
    document.getElementById('rotate-right').addEventListener('click', () => handleRotation(90));
    document.getElementById('flip-horizontal').addEventListener('click', () => handleFlip('x'));
    document.getElementById('flip-vertical').addEventListener('click', () => handleFlip('y'));
  
    // Controles de movimiento
    document.getElementById('move-up').addEventListener('click', () => handleMove('up'));
    document.getElementById('move-down').addEventListener('click', () => handleMove('down'));
    document.getElementById('move-left').addEventListener('click', () => handleMove('left'));
    document.getElementById('move-right').addEventListener('click', () => handleMove('right'));
  
    // Reset transform
    document.getElementById('reset-transform').addEventListener('click', resetTransform);
  }
  
  function handleModelChange(e) {
    const selected = phoneData.find(item => item.modelName === e.target.value);
    selectedModel = selected;
    updateModel();
    // Reiniciar controles al cambiar modelo
    imageControls = { scale: 1, rotation: 0, flipX: 1, flipY: 1, position: { x: 0, y: 0 } };
    if (userImageSrc) {
      updateCustomImageTransform();
    }
  }
  
  function handleUpload(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        userImageSrc = ev.target.result;
        imageControls = {
          scale: 1,
          rotation: 0,
          flipX: 1,
          flipY: 1,
          position: { x: 0, y: 0 }
        };
        updateCustomImage();
        updateImagePreview();
      };
      reader.readAsDataURL(file);
    }
  }
  
  function clearImage() {
    userImageSrc = null;
    updateCustomImage();
    updateImagePreview();
  }
  
  function handleAddToCart() {
    if (!userImageSrc) {
      alert("Por favor sube una imagen antes de agregar al carrito.");
      return;
    }
    showCheckoutForm = true;
    updateCheckoutVisibility();
  }
  
  function handleCheckout(e) {
    e.preventDefault();
  
    // Obtener datos del formulario
    clientData = {
      name: document.getElementById('client-name').value,
      phone: document.getElementById('client-phone').value,
      email: document.getElementById('client-email').value,
      address: document.getElementById('client-address').value,
      postalCode: document.getElementById('client-postal-code').value,
      state: document.getElementById('client-state').value,
      country: document.getElementById('client-country').value,
      exteriorNumber: document.getElementById('client-exterior-number').value,
      interiorNumber: document.getElementById('client-interior-number').value,
    };
  
    // Validar campos requeridos
    if (!clientData.name || !clientData.phone || !clientData.email || 
        !clientData.address || !clientData.postalCode || !clientData.state || 
        !clientData.country || !clientData.exteriorNumber) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
  
    // Crear item del carrito
    const cartItem = {
      id: selectedModel.id,
      modelName: selectedModel.modelName,
      colorURL: selectedModel.colorURL,
      maskURL: selectedModel.maskURL,
      customImage: userImageSrc,
      price: 299, // 299 MXN
      quantity: 1,
      imageControls: { ...imageControls },
      clientData
    };
  
    console.log("Cart item with client data:", cartItem);
  
    // Simular proceso de pago exitoso
    alert("¡Compra completada con éxito! Recibirás un email de confirmación.");
  
    // Resetear formulario
    resetForm();
  }
  
  function handleScale(delta) {
    imageControls.scale = Math.max(0.5, Math.min(2, imageControls.scale + delta));
    updateCustomImageTransform();
  }
  
  function handleRotation(angle) {
    imageControls.rotation = (imageControls.rotation + angle) % 360;
    updateCustomImageTransform();
  }
  
  function handleFlip(axis) {
    if (axis === 'x') {
      imageControls.flipX *= -1;
    } else {
      imageControls.flipY *= -1;
    }
    updateCustomImageTransform();
  }
  
  function handleMove(direction) {
    const STEP = 10;
    switch(direction) {
      case 'up':
        imageControls.position.y -= STEP;
        break;
      case 'down':
        imageControls.position.y += STEP;
        break;
      case 'left':
        imageControls.position.x -= STEP;
        break;
      case 'right':
        imageControls.position.x += STEP;
        break;
    }
    updateCustomImageTransform();
  }
  
  function resetTransform() {
    imageControls = {
      scale: 1,
      rotation: 0,
      flipX: 1,
      flipY: 1,
      position: { x: 0, y: 0 }
    };
    updateCustomImageTransform();
  }
  
  function updateModel() {
    // Actualizar imagen base
    baseImage.src = selectedModel.colorURL;
  
    // Actualizar máscara
    if (userImageSrc) {
      customImageWrapper.style.maskImage = `url(${selectedModel.maskURL})`;
      customImageWrapper.style.WebkitMaskImage = `url(${selectedModel.maskURL})`;
      customImageWrapper.style.maskSize = "contain";
      customImageWrapper.style.WebkitMaskSize = "contain";
      customImageWrapper.style.maskRepeat = "no-repeat";
      customImageWrapper.style.WebkitMaskRepeat = "no-repeat";
      customImageWrapper.style.maskPosition = "center";
      customImageWrapper.style.WebkitMaskPosition = "center";
    }
  }
  
  function updateCustomImage() {
    if (userImageSrc) {
      // Mostrar imagen personalizada
      customImage.src = userImageSrc;
      customImageContainer.style.display = 'block';
  
      // Aplicar máscara
      customImageWrapper.style.maskImage = `url(${selectedModel.maskURL})`;
      customImageWrapper.style.WebkitMaskImage = `url(${selectedModel.maskURL})`;
      customImageWrapper.style.maskSize = "contain";
      customImageWrapper.style.WebkitMaskSize = "contain";
      customImageWrapper.style.maskRepeat = "no-repeat";
      customImageWrapper.style.WebkitMaskRepeat = "no-repeat";
      customImageWrapper.style.maskPosition = "center";
      customImageWrapper.style.WebkitMaskPosition = "center";
  
      updateCustomImageTransform();
    } else {
      customImageContainer.style.display = 'none';
    }
  }
  
  function updateCustomImageTransform() {
    if (customImage && userImageSrc) {
      const transform = `translate(${imageControls.position.x}px, ${imageControls.position.y}px) scale(${imageControls.scale * imageControls.flipX}, ${imageControls.scale * imageControls.flipY}) rotate(${imageControls.rotation}deg)`;
      customImage.style.transform = transform;
      customImage.style.transformOrigin = "center";
    }
  }
  
  function updateImagePreview() {
    if (userImageSrc) {
      imagePreview.src = userImageSrc;
      imagePreviewContainer.style.display = 'block';
    } else {
      imagePreviewContainer.style.display = 'none';
    }
  }
  
  function updateCheckoutVisibility() {
    if (showCheckoutForm) {
      checkoutFormContainer.style.display = 'block';
      mainControls.style.display = 'none';
    } else {
      checkoutFormContainer.style.display = 'none';
      mainControls.style.display = 'block';
    }
  }
  
  function resetForm() {
    // Limpiar formulario
    document.getElementById('client-name').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-address').value = '';
    document.getElementById('client-postal-code').value = '';
    document.getElementById('client-state').value = '';
    document.getElementById('client-country').value = '';
    document.getElementById('client-exterior-number').value = '';
    document.getElementById('client-interior-number').value = '';
  
    // Resetear estado
    clientData = {
      name: "",
      phone: "",
      email: "",
      address: "",
      postalCode: "",
      state: "",
      country: "",
      exteriorNumber: "",
      interiorNumber: ""
    };
  
    showCheckoutForm = false;
    updateCheckoutVisibility();
  }
  
  // Atajos de teclado
  document.addEventListener('keydown', (e) => {
    if (!userImageSrc) return;
  
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handleMove('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleMove('right');
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleMove('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleMove('down');
        break;
      case '+':
      case '=':
        e.preventDefault();
        handleScale(0.1);
        break;
      case '-':
        e.preventDefault();
        handleScale(-0.1);
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        handleRotation(90);
        break;
    }
  });
  
  // Soporte para arrastrar la imagen
  let isDragging = false;
  let startPos = { x: 0, y: 0 };
  let initialPos = { x: 0, y: 0 };
  
  document.getElementById('case-container').addEventListener('mousedown', (e) => {
    if (userImageSrc) {
      isDragging = true;
      startPos.x = e.clientX;
      startPos.y = e.clientY;
      initialPos = { ...imageControls.position };
      e.preventDefault();
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging && userImageSrc) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
  
      imageControls.position.x = initialPos.x + deltaX;
      imageControls.position.y = initialPos.y + deltaY;
  
      updateCustomImageTransform();
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Soporte táctil para móviles
  document.getElementById('case-container').addEventListener('touchstart', (e) => {
    if (userImageSrc) {
      isDragging = true;
      const touch = e.touches[0];
      startPos.x = touch.clientX;
      startPos.y = touch.clientY;
      initialPos = { ...imageControls.position };
      e.preventDefault();
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging && userImageSrc) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.x;
      const deltaY = touch.clientY - startPos.y;
  
      imageControls.position.x = initialPos.x + deltaX;
      imageControls.position.y = initialPos.y + deltaY;
  
      updateCustomImageTransform();
      e.preventDefault();
    }
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  // Inicializar la aplicación cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', init);