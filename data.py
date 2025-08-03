import os
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Ocultar el aviso de la conexión insegura.
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Lista de datos de los productos, incluyendo las URLs de color y máscara.
# Esta estructura de datos es más robusta y fácil de manejar.
products = [
    {
      "id": "ip16pro_c002",
      "modelName": "iPhone 16 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip16pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip16pro_c002/mask.png"
    },
    {
      "id": "ip16plus_c002",
      "modelName": "iPhone 16 Plus",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip16plus_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip16plus_c002/mask.png"
    },
    {
      "id": "ip16_c002",
      "modelName": "iPhone 16",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip16_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip16_c002/mask.png"
    },
    {
      "id": "ip15promax_c002",
      "modelName": "iPhone 15 Pro Max",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip15promax_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip15promax_c002/mask.png"
    },
    {
      "id": "ip15pro_c002",
      "modelName": "iPhone 15 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip15pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip15pro_c002/mask.png"
    },
    {
      "id": "ip15plus_c002",
      "modelName": "iPhone 15 Plus",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip15plus_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip15plus_c002/mask.png"
    },
    {
      "id": "ip15_c002",
      "modelName": "iPhone 15",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip15_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip15_c002/mask.png"
    },
    {
      "id": "ip14promax_c002",
      "modelName": "iPhone 14 Pro Max",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip14promax_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip14promax_c002/mask.png"
    },
    {
      "id": "ip14pro_c002",
      "modelName": "iPhone 14 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip14pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip14pro_c002/mask.png"
    },
    {
      "id": "ip14max_c002",
      "modelName": "iPhone 14 Plus",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip14max_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip14max_c002/mask.png"
    },
    {
      "id": "ip14_c002",
      "modelName": "iPhone 14",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip14_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip14_c002/mask.png"
    },
    {
      "id": "ip13promax_c002",
      "modelName": "iPhone 13 Pro Max",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip13promax_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip13promax_c002/mask.png"
    },
    {
      "id": "ip13pro_c002",
      "modelName": "iPhone 13 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip13pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip13pro_c002/mask.png"
    },
    {
      "id": "ip13_c002",
      "modelName": "iPhone 13",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip13_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip13_c002/mask.png"
    },
    {
      "id": "ip13mini_c002",
      "modelName": "iPhone 13 Mini",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip13mini_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip13mini_c002/mask.png"
    },
    {
      "id": "ip12promax_c002",
      "modelName": "iPhone 12 Pro Max",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip12promax_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip12promax_c002/mask.png"
    },
    {
      "id": "ip12pro_c002",
      "modelName": "iPhone 12 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip12pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip12pro_c002/mask.png"
    },
    {
      "id": "ip12_c002",
      "modelName": "iPhone 12",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip12_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip12_c002/mask.png"
    },
    {
      "id": "ip12mini_c002",
      "modelName": "iPhone 12 Mini",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip12mini_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip12mini_c002/mask.png"
    },
    {
      "id": "ip11promax_c002",
      "modelName": "iPhone 11 Pro Max",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip11promax_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip11promax_c002/mask.png"
    },
    {
      "id": "ip11pro_c002",
      "modelName": "iPhone 11 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip11pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip11pro_c002/mask.png"
    },
    {
      "id": "ip11_c002",
      "modelName": "iPhone 11",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip11_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip11_c002/mask.png"
    },
    {
      "id": "ipxr_c002",
      "modelName": "iPhone XR",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipxr_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipxr_c002/mask.png"
    },
    {
      "id": "ipxsmax_c002",
      "modelName": "iPhone XS Max",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipxsmax_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipxsmax_c002/mask.png"
    },
    {
      "id": "ipxs_c002",
      "modelName": "iPhone XS",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipxs_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipxs_c002/mask.png"
    },
    {
      "id": "ipx_c002",
      "modelName": "iPhone X",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipx_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipx_c002/mask.png"
    },
    {
      "id": "ipse4_c118",
      "modelName": "iPhone SE 4",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipse4_c118/color/Black.jpg",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipse4_c118/mask.png"
    },
    {
      "id": "ipse3_c002",
      "modelName": "iPhone SE (3rd Gen)",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipse3_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipse3_c002/mask.png"
    },
    {
      "id": "ipse2_c002",
      "modelName": "iPhone SE (2nd Gen)",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ipse2_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ipse2_c002/mask.png"
    },
    {
      "id": "ip8p_c002",
      "modelName": "iPhone 8 Plus",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip8p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip8p_c002/mask.png"
    },
    {
      "id": "ip8_c002",
      "modelName": "iPhone 8",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip8_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip8_c002/mask.png"
    },
    {
      "id": "ip7p_c002",
      "modelName": "iPhone 7 Plus",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip7p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip7p_c002/mask.png"
    },
    {
      "id": "ip7_c002",
      "modelName": "iPhone 7",
      "colorURL": "https://img1.styletify.com/sysres/proimg/ip7_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/ip7_c002/mask.png"
    },
    {
      "id": "zflip6_c105",
      "modelName": "Galaxy Z Flip6",
      "colorURL": "https://img1.styletify.com/sysres/proimg/zflip6_c105/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/zflip6_c105/mask.png"
    },
    {
      "id": "zflip5_c105",
      "modelName": "Galaxy Z Flip5",
      "colorURL": "https://img1.styletify.com/sysres/proimg/zflip5_c105/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/zflip5_c105/mask.png"
    },
    {
      "id": "zflip4_c105",
      "modelName": "Galaxy Z Flip4",
      "colorURL": "https://img1.styletify.com/sysres/proimg/zflip4_c105/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/zflip4_c105/mask.png"
    },
    {
      "id": "zflip3_c002",
      "modelName": "Galaxy Z Flip3",
      "colorURL": "https://img1.styletify.com/sysres/proimg/zflip3_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/zflip3_c002/mask.png"
    },
    {
      "id": "zflip_c004",
      "modelName": "Galaxy Z Flip",
      "colorURL": "https://img1.styletify.com/sysres/proimg/zflip_c004/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/zflip_c004/mask.png"
    },
    {
      "id": "galaxyzf6_c105",
      "modelName": "Galaxy Z Fold6",
      "colorURL": "https://img1.styletify.com/sysres/proimg/galaxyzf6_c105/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/galaxyzf6_c105/mask.png"
    },
    {
      "id": "galaxyzf5_c105",
      "modelName": "Galaxy Z Fold5",
      "colorURL": "https://img1.styletify.com/sysres/proimg/galaxyzf5_c105/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/galaxyzf5_c105/mask.png"
    },
    {
      "id": "galaxyzf4_c105",
      "modelName": "Galaxy Z Fold4",
      "colorURL": "https://img1.styletify.com/sysres/proimg/galaxyzf4_c105/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/galaxyzf4_c105/mask.png"
    },
    {
      "id": "galaxyzf3_c004",
      "modelName": "Galaxy Z Fold3",
      "colorURL": "https://img1.styletify.com/sysres/proimg/galaxyzf3_c004/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/galaxyzf3_c004/mask.png"
    },
    {
      "id": "galaxyzf2_c004",
      "modelName": "Galaxy Z Fold2",
      "colorURL": "https://img1.styletify.com/sysres/proimg/galaxyzf2_c004/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/galaxyzf2_c004/mask.png"
    },
    {
      "id": "s24fe_c002",
      "modelName": "Galaxy S24 FE",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s24fe_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s24fe_c002/mask.png"
    },
    {
      "id": "s24u_c002",
      "modelName": "Galaxy S24 Ultra",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s24u_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s24u_c002/mask.png"
    },
    {
      "id": "s24p_c002",
      "modelName": "Galaxy S24+",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s24p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s24p_c002/mask.png"
    },
    {
      "id": "s24_c002",
      "modelName": "Galaxy S24",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s24_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s24_c002/mask.png"
    },
    {
      "id": "s23fe_c002",
      "modelName": "Galaxy S23 FE",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s23fe_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s23fe_c002/mask.png"
    },
    {
      "id": "s23u_c002",
      "modelName": "Galaxy S23 Ultra",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s23u_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s23u_c002/mask.png"
    },
    {
      "id": "s23p_c002",
      "modelName": "Galaxy S23+",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s23p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s23p_c002/mask.png"
    },
    {
      "id": "s23_c002",
      "modelName": "Galaxy S23",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s23_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s23_c002/mask.png"
    },
    {
      "id": "s22u_c002",
      "modelName": "Galaxy S22 Ultra",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s22u_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s22u_c002/mask.png"
    },
    {
      "id": "s22p_c002",
      "modelName": "Galaxy S22+",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s22p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s22p_c002/mask.png"
    },
    {
      "id": "s22_c002",
      "modelName": "Galaxy S22",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s22_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s22_c002/mask.png"
    },
    {
      "id": "s21fe_c002",
      "modelName": "Galaxy S21 FE",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s21fe_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s21fe_c002/mask.png"
    },
    {
      "id": "s21u_c002",
      "modelName": "Galaxy S21 Ultra",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s21u_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s21u_c002/mask.png"
    },
    {
      "id": "s21p_c002",
      "modelName": "Galaxy S21+",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s21p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s21p_c002/mask.png"
    },
    {
      "id": "s21_c002",
      "modelName": "Galaxy S21",
      "colorURL": "https://img1.styletify.com/sysres/proimg/s21_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/s21_c002/mask.png"
    },
    {
      "id": "a90_c002",
      "modelName": "Galaxy A90",
      "colorURL": "https://img1.styletify.com/sysres/proimg/a90_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/a90_c002/mask.png"
    },
    {
      "id": "a825g_c002",
      "modelName": "Galaxy A82 5G",
      "colorURL": "https://img1.styletify.com/sysres/proimg/a825g_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/a825g_c002/mask.png"
    },
    {
      "id": "a81_c002",
      "modelName": "Galaxy A81",
      "colorURL": "https://img1.styletify.com/sysres/proimg/a81_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/a81_c002/mask.png"
    },
    {
      "id": "mototp5g_c002",
      "modelName": "Moto ThinkPhone 5G",
      "colorURL": "https://img1.styletify.com/sysres/proimg/mototp5g_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/mototp5g_c002/mask.png"
    },
    {
      "id": "motodefy2021_c002",
      "modelName": "Moto Defy 2021",
      "colorURL": "https://img1.styletify.com/sysres/proimg/motodefy2021_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/motodefy2021_c002/mask.png"
    },
    {
      "id": "motodefy2_c002",
      "modelName": "Moto Defy 2",
      "colorURL": "https://img1.styletify.com/sysres/proimg/motodefy2_c002/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/motodefy2_c002/mask.png"
    },
    {
      "id": "lgwing_c004",
      "modelName": "LG Wing",
      "colorURL": "https://img1.styletify.com/sysres/proimg/lgwing_c004/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/lgwing_c004/mask.png"
    },
    {
      "id": "lgvelvet_c005",
      "modelName": "LG Velvet",
      "colorURL": "https://img1.styletify.com/sysres/proimg/lgvelvet_c005/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/lgvelvet_c005/mask.png"
    },
    {
      "id": "lgv60_c002",
      "modelName": "LG V60",
      "colorURL": "https://img1.styletify.com/sysres/proimg/lgv60_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/lgv60_c002/mask.png"
    },
    {
      "id": "pixel9prof_c004",
      "modelName": "Google Pixel 9 Pro Fold",
      "colorURL": "https://img1.styletify.com/sysres/proimg/pixel9prof_c004/color/Transparent.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/pixel9prof_c004/mask.png"
    },
    {
      "id": "pixel9pxl_c002",
      "modelName": "Google Pixel 9 Pro XL",
      "colorURL": "https://img1.styletify.com/sysres/proimg/pixel9pxl_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/pixel9pxl_c002/mask.png"
    },
    {
      "id": "pixel9p_c002",
      "modelName": "Google Pixel 9 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/pixel9p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/pixel9p_c002/mask.png"
    },
    {
      "id": "pococ65_c002",
      "modelName": "Poco C65",
      "colorURL": "https://img1.styletify.com/sysres/proimg/pococ65_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/pococ65_c002/mask.png"
    },
    {
      "id": "xmbs3p_c002",
      "modelName": "Xiaomi Black Shark 3 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/xmbs3p_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/xmbs3p_c002/mask.png"
    },
    {
      "id": "mate40prop_c002",
      "modelName": "Huawei Mate 40 Pro+",
      "colorURL": "https://img1.styletify.com/sysres/proimg/mate40prop_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/mate40prop_c002/mask.png"
    },
    {
      "id": "mate40pro_c002",
      "modelName": "Huawei Mate 40 Pro",
      "colorURL": "https://img1.styletify.com/sysres/proimg/mate40pro_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/mate40pro_c002/mask.png"
    },
    {
      "id": "mate40_c002",
      "modelName": "Huawei Mate 40",
      "colorURL": "https://img1.styletify.com/sysres/proimg/mate40_c002/color/Black.png",
      "maskURL": "https://img1.styletify.com/sysres/proimg/mate40_c002/mask.png"
    }
]

# Directorio donde se guardarán las imágenes
output_dir = "downloaded_images"

# Crear el directorio si no existe
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Directorio creado: {output_dir}")

def download_image(url, filename, output_dir):
    """
    Descarga una imagen de una URL y la guarda en el directorio especificado.
    Se utiliza el nombre de archivo proporcionado para guardar la imagen.
    Se añade la opción `verify=False` para ignorar los errores de certificado SSL.
    """
    try:
        response = requests.get(url, verify=False)
        response.raise_for_status()  # Lanza una excepción para códigos de estado de error

        filepath = os.path.join(output_dir, filename)

        # Guardar la imagen
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Imagen descargada: {filename}")
    except requests.exceptions.RequestException as e:
        print(f"Error al descargar {url}: {e}")

# Descargar cada imagen de la lista de productos
for product in products:
    product_id = product["id"]
    
    # Obtener la extensión del archivo de color y crear un nombre descriptivo
    color_url = product["colorURL"]
    color_extension = os.path.splitext(color_url)[1]
    color_filename = f"{product_id}_color{color_extension}"
    download_image(color_url, color_filename, output_dir)
    
    # Obtener la extensión del archivo de máscara y crear un nombre descriptivo
    mask_url = product["maskURL"]
    mask_extension = os.path.splitext(mask_url)[1]
    mask_filename = f"{product_id}_mask{mask_extension}"
    download_image(mask_url, mask_filename, output_dir)

