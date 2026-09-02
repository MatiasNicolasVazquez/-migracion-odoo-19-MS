import type { ModuleDef } from "@/lib/types";

export const MODULES: ModuleDef[] = [
  // ─── P0: camino crítico ───────────────────────────────────────────
  {
    id: "website_settings",
    technicalName: "website_settings",
    displayName: "Website Settings",
    version: "1.0",
    depends: [],
    category: "ecommerce",
    priority: "P0",
    importance: 95,
    summary:
      "Configuraciones custom del sitio web. Base de website_sale_custom, theme y product zones.",
    testPlan: [
      {
        id: "ws-1",
        title: "Instalar módulo sin errores",
        detail: "Actualizar lista de apps e instalar website_settings en Odoo 19.",
      },
      {
        id: "ws-2",
        title: "Abrir menú de settings",
        detail: "Verificar que aparece el menú Website Settings y se puede crear un registro.",
      },
      {
        id: "ws-3",
        title: "CRUD de WebsiteSetting",
        detail: "Crear, editar y guardar valores de configuración usados por otros módulos.",
      },
      {
        id: "ws-4",
        title: "Lectura desde website",
        detail: "Confirmar que el frontend/otros módulos leen los settings correctamente.",
      },
    ],
  },
  {
    id: "website_payment_filter_by_product",
    technicalName: "website_payment_filter_by_product",
    displayName: "Payment Methods per Product",
    version: "17.0.1.1.5",
    depends: [],
    category: "payments",
    priority: "P0",
    importance: 94,
    summary:
      "Filtra métodos de pago en checkout según producto, familias principales y loyalty.",
    testPlan: [
      {
        id: "wpf-1",
        title: "Instalar con loyalty / sale_loyalty",
        detail: "Verificar dependencias nativas Odoo 19 e instalar sin errores.",
      },
      {
        id: "wpf-2",
        title: "Configurar provider_ids en producto",
        detail: "Asignar métodos de pago permitidos en un producto y guardar.",
      },
      {
        id: "wpf-3",
        title: "Familias principales",
        detail: "Crear/editar familias (Mac, iPhone, etc.) en Sitio web > Configuración.",
      },
      {
        id: "wpf-4",
        title: "Checkout una familia + accesorios",
        detail: "Carrito con producto principal + accesorio: debe unir métodos.",
      },
      {
        id: "wpf-5",
        title: "Checkout multi-familia",
        detail: "Carrito con dos familias: debe intersectar métodos.",
      },
      {
        id: "wpf-6",
        title: "Loyalty / descuento",
        detail: "Con cupón loyalty, verificar intersección con métodos del producto loyalty.",
      },
      {
        id: "wpf-7",
        title: "Fallback transferencia",
        detail: "Sin métodos comunes, debe mostrar transferencia bancaria.",
      },
    ],
  },
  {
    id: "website_sale_custom",
    technicalName: "website_sale_custom",
    displayName: "Website Sale Custom",
    version: "17.0.1.0.13",
    depends: ["website_settings", "website_payment_filter_by_product"],
    category: "ecommerce",
    priority: "P0",
    importance: 100,
    summary:
      "Núcleo ecommerce MacStation: checkout, stock web, portal, configurador y pagos.",
    testPlan: [
      {
        id: "wsc-1",
        title: "Instalar (deps + l10n_ar_website_sale_price)",
        detail: "Confirmar que l10n_ar_website_sale_price y configurator existen en 19.",
      },
      {
        id: "wsc-2",
        title: "Ficha producto / variantes",
        detail: "Probar selección de variantes y mixin JS custom.",
      },
      {
        id: "wsc-3",
        title: "Disponibilidad de stock en web",
        detail: "Ver template custom de website_sale_stock_product_availability.",
      },
      {
        id: "wsc-4",
        title: "Checkout billing",
        detail: "Completar checkout con checkout_billing.js (facturación AR).",
      },
      {
        id: "wsc-5",
        title: "Portal y pedidos",
        detail: "Ver pedido desde portal; templates portal custom.",
      },
      {
        id: "wsc-6",
        title: "Categorías públicas",
        detail: "Revisar vistas de product_public_category custom.",
      },
      {
        id: "wsc-7",
        title: "Payment providers en SO",
        detail: "Verificar vistas payment_provider / sale_order custom.",
      },
      {
        id: "wsc-8",
        title: "Stock picking vinculado a web",
        detail: "Confirmar picking generado desde pedido web sin errores.",
      },
    ],
  },
  {
    id: "theme_macstation",
    technicalName: "theme_macstation",
    displayName: "Theme Macstation",
    version: "17.0.1.0.15",
    depends: ["website_settings", "website_sale_custom"],
    category: "theme",
    priority: "P0",
    importance: 98,
    summary:
      "Theme frontend: header, footer, home, producto, checkout, landings Apple.",
    testPlan: [
      {
        id: "tm-1",
        title: "Instalar y activar theme",
        detail: "Aplicar Theme Macstation al website en Odoo 19.",
      },
      {
        id: "tm-2",
        title: "Home / header / footer",
        detail: "Verificar layout, assets CSS/JS y menú.",
      },
      {
        id: "tm-3",
        title: "Página de producto",
        detail: "Ficha producto17, variantes, stock UI y notificaciones carrito.",
      },
      {
        id: "tm-4",
        title: "Checkout y address",
        detail: "Flujo carrito → checkout → confirmación con templates del theme.",
      },
      {
        id: "tm-5",
        title: "RequireLoginToCheckout",
        detail: "Probar que el controller obliga login antes de pagar si aplica.",
      },
      {
        id: "tm-6",
        title: "Landings Apple",
        detail: "iPhone 17 Pro, MacBook Neo, iPhone 17e, iPad Air M4, MacBook Air M5.",
      },
      {
        id: "tm-7",
        title: "Login / registro / recupero",
        detail: "Templates de auth y cookies policy/bar.",
      },
      {
        id: "tm-8",
        title: "Portal theme",
        detail: "Portal de cliente con estilos del theme.",
      },
    ],
  },
  {
    id: "payment_mercadopago",
    technicalName: "payment_mercadopago",
    displayName: "Payment Mercado Pago",
    version: "1.0",
    depends: [],
    category: "payments",
    priority: "P0",
    importance: 97,
    summary:
      "Integración checkout Mercado Pago (depende de payment_mercado_pago nativo).",
    testPlan: [
      {
        id: "mp-1",
        title: "Instalar + lib mercadopago",
        detail: "Verificar python mercadopago y módulo payment_mercado_pago en 19.",
      },
      {
        id: "mp-2",
        title: "Configurar provider",
        detail: "Credenciales test/prod, métodos de pago y estado Enabled.",
      },
      {
        id: "mp-3",
        title: "Pago web exitoso",
        detail: "Compra de prueba con tarjeta test; tx en estado done.",
      },
      {
        id: "mp-4",
        title: "Pago rechazado / cancelado",
        detail: "Verificar manejo de error y estado de transacción.",
      },
      {
        id: "mp-5",
        title: "Wizard check_payments",
        detail: "Abrir wizard de verificación de pagos y consultar estado.",
      },
      {
        id: "mp-6",
        title: "Portal / controllers",
        detail: "Callbacks y rutas portal sin 500.",
      },
    ],
  },
  {
    id: "payment_mercadopago_discounts",
    technicalName: "payment_mercadopago_discounts",
    displayName: "Payment Mercado Pago Discounts",
    version: "1.0.1",
    depends: ["payment_mercadopago"],
    category: "payments",
    priority: "P0",
    importance: 92,
    summary: "Beneficios/descuentos por BIN y tarjeta en checkout MP.",
    testPlan: [
      {
        id: "mpd-1",
        title: "Instalar sobre payment_mercadopago",
      },
      {
        id: "mpd-2",
        title: "Configurar descuentos por BIN",
        detail: "Crear PaymentProviderDiscount y BINs asociados.",
      },
      {
        id: "mpd-3",
        title: "Beneficios en ficha producto",
        detail: "JS productDiscounts muestra cuotas/beneficios.",
      },
      {
        id: "mpd-4",
        title: "Beneficios en categoría",
        detail: "categoryCardBenefits en listado.",
      },
      {
        id: "mpd-5",
        title: "Checkout aplica beneficio",
        detail: "Al pagar con BIN promocionado, el descuento se refleja.",
      },
    ],
  },
  {
    id: "payment_modo",
    technicalName: "payment_modo",
    displayName: "Payment Provider: MODO",
    version: "17.0.1.0.12",
    depends: ["payment_mercadopago_discounts"],
    category: "payments",
    priority: "P0",
    importance: 90,
    summary: "Pagos MODO SDK v2, promos bancarias y wizard de info.",
    testPlan: [
      {
        id: "modo-1",
        title: "Instalar (cryptography, requests)",
        detail: "Deps python y payment_mercadopago_discounts presentes.",
      },
      {
        id: "modo-2",
        title: "Configurar provider MODO",
        detail: "Credenciales, journal y payment method data.",
      },
      {
        id: "modo-3",
        title: "Promos bancarias",
        detail: "CRUD PaymentModoBankPromo y visualización en web.",
      },
      {
        id: "modo-4",
        title: "Pago MODO exitoso",
        detail: "Flujo SDK v2 hasta confirmación de tx.",
      },
      {
        id: "modo-5",
        title: "Wizard info de pago",
        detail: "Abrir modo_payment_info_wizard desde backend.",
      },
      {
        id: "modo-6",
        title: "Controllers shop/main",
        detail: "Endpoints sin error 500 en sandbox.",
      },
    ],
  },
  {
    id: "extended_warranty_macstation",
    technicalName: "extended_warranty_macstation",
    displayName: "Extended Warranty MacStation",
    version: "17.0.1.2.7",
    depends: ["website_sale_custom"],
    category: "warranty",
    priority: "P0",
    importance: 96,
    summary:
      "MacStation Safe/Care: garantías, series, portal, dashboard OWL y reporte.",
    testPlan: [
      {
        id: "ewm-1",
        title: "Instalar aplicación",
        detail: "Security groups, sequences, crons y menús.",
      },
      {
        id: "ewm-2",
        title: "Configurar productos de garantía",
        detail: "Producto garantía con productos aplicables.",
      },
      {
        id: "ewm-3",
        title: "Alta automática desde Sale Order",
        detail: "Confirmar SO con garantía → contrato creado con fechas.",
      },
      {
        id: "ewm-4",
        title: "Alta desde POS",
        detail: "Venta en punto de venta genera garantía.",
      },
      {
        id: "ewm-5",
        title: "Serie desde picking",
        detail: "Validar entrega con lot/serial y captura en contrato.",
      },
      {
        id: "ewm-6",
        title: "Portal público de verificación",
        detail: "Buscar garantía por serie/número en portal web.",
      },
      {
        id: "ewm-7",
        title: "Landing Safe + TyC",
        detail: "Páginas macstation_safe_landing y términos.",
      },
      {
        id: "ewm-8",
        title: "Dashboard OWL",
        detail: "Abrir Safe Dashboard (Chart.js) sin errores de assets.",
      },
      {
        id: "ewm-9",
        title: "Reporte contrato PDF",
        detail: "Imprimir macstation_safe_contract_report.",
      },
      {
        id: "ewm-10",
        title: "Venta web con garantía",
        detail: "Agregar Safe en shop y completar flujo.",
      },
    ],
  },

  // ─── P1 ───────────────────────────────────────────────────────────
  {
    id: "product_tag_enhancement",
    technicalName: "product_tag_enhancement",
    displayName: "Product Tag Enhancement",
    version: "17.0.1.0.0",
    depends: [],
    category: "product",
    priority: "P1",
    importance: 80,
    summary: "Orden alfabético de tags y búsqueda por tags en inventario.",
    testPlan: [
      {
        id: "pte-1",
        title: "Instalar módulo",
      },
      {
        id: "pte-2",
        title: "Tags ordenados alfabéticamente",
        detail: "En producto, lista de tags debe ir A→Z.",
      },
      {
        id: "pte-3",
        title: "Búsqueda en inventario",
        detail: "Buscar productos por etiqueta en vistas de stock/product.",
      },
    ],
  },
  {
    id: "product_compatibility",
    technicalName: "product_compatibility",
    displayName: "Product Compatibility",
    version: "17.0.1.0.0",
    depends: ["product_tag_enhancement"],
    category: "product",
    priority: "P1",
    importance: 75,
    summary: 'Campo Many2many "Compatible con" para búsquedas eficientes.',
    testPlan: [
      {
        id: "pc-1",
        title: "Instalar sobre product_tag_enhancement",
      },
      {
        id: "pc-2",
        title: "CRUD de compatibilidades",
        detail: "Crear valores Compatible con y asignarlos a productos.",
      },
      {
        id: "pc-3",
        title: "Búsqueda por compatibilidad",
        detail: "Filtrar inventario por Compatible con.",
      },
      {
        id: "pc-4",
        title: "Template y variant",
        detail: "Campo visible en product.template y product.product.",
      },
    ],
  },
  {
    id: "stock_product_tag_compat",
    technicalName: "stock_product_tag_compat",
    displayName: "Stock - Etiquetas y Compatible con",
    version: "17.0.1.0.0",
    depends: ["product_tag_enhancement", "product_compatibility"],
    category: "stock",
    priority: "P1",
    importance: 72,
    summary: "Filtrar valoración y ubicaciones por tag y Compatible con.",
    testPlan: [
      {
        id: "sptc-1",
        title: "Instalar con stock_account",
      },
      {
        id: "sptc-2",
        title: "Filtro en Stock Valuation Layer",
        detail: "Agrupar/filtrar SVL por product tag y compatible.",
      },
      {
        id: "sptc-3",
        title: "Filtro en Stock Quant",
        detail: "Ubicaciones/quants filtrables por tag y compatible.",
      },
    ],
  },
  {
    id: "stock_valuation_product_tag",
    technicalName: "stock_valuation_product_tag",
    displayName: "Stock Valuation - Etiquetas (puente)",
    version: "17.0.2.0.0",
    depends: ["stock_product_tag_compat"],
    category: "stock",
    priority: "P3",
    importance: 20,
    summary: "Módulo puente vacío; la lógica vive en stock_product_tag_compat.",
    testPlan: [
      {
        id: "svpt-1",
        title: "Instalar sin errores",
        detail: "Solo depende de stock_product_tag_compat; sin modelos propios.",
      },
      {
        id: "svpt-2",
        title: "Confirmar que no rompe upgrades",
        detail: "Module upgrade limpio en DB migrada.",
      },
    ],
  },
  {
    id: "account_product_tag",
    technicalName: "account_product_tag",
    displayName: "Account - Etiquetas de Producto",
    version: "17.0.1.0.0",
    depends: ["product_tag_enhancement"],
    category: "account",
    priority: "P1",
    importance: 70,
    summary: "Filtrar/agrupar facturas e informes por etiquetas de producto.",
    testPlan: [
      {
        id: "apt-1",
        title: "Instalar módulo",
      },
      {
        id: "apt-2",
        title: "Filtro en account.move",
        detail: "Buscar/filtrar facturas por product tag.",
      },
      {
        id: "apt-3",
        title: "Invoice report",
        detail: "Agrupar análisis de facturas por etiqueta.",
      },
    ],
  },
  {
    id: "sale_report_product_tag",
    technicalName: "sale_report_product_tag",
    displayName: "Análisis de Ventas - Etiquetas",
    version: "17.0.1.0.0",
    depends: ["product_tag_enhancement"],
    category: "account",
    priority: "P1",
    importance: 68,
    summary: "Agrupar y filtrar análisis de ventas por etiquetas de producto.",
    testPlan: [
      {
        id: "srpt-1",
        title: "Instalar módulo",
      },
      {
        id: "srpt-2",
        title: "Sale report por tag",
        detail: "Abrir Análisis de ventas y agrupar por product tag.",
      },
      {
        id: "srpt-3",
        title: "Filtro por etiqueta",
        detail: "Filtrar líneas de reporte por una etiqueta concreta.",
      },
    ],
  },
  {
    id: "payment_talo",
    technicalName: "payment_talo",
    displayName: "Payment Provider: Talo",
    version: "17.0.1.0.0",
    depends: [],
    category: "payments",
    priority: "P1",
    importance: 74,
    summary: "Pagos Talo por transferencia / Alias.",
    testPlan: [
      {
        id: "talo-1",
        title: "Instalar módulo",
      },
      {
        id: "talo-2",
        title: "Configurar provider Talo",
        detail: "Alias y credenciales.",
      },
      {
        id: "talo-3",
        title: "Flujo de pago por Alias",
        detail: "Crear tx y confirmar transferencia de prueba.",
      },
      {
        id: "talo-4",
        title: "Controller TaloController",
        detail: "Callbacks/webhooks responden OK.",
      },
    ],
  },
  {
    id: "website_product_zones",
    technicalName: "website_product_zones",
    displayName: "Website Product Zones",
    version: "17.0.1.0.4",
    depends: ["website_sale_custom", "website_settings"],
    category: "ecommerce",
    priority: "P1",
    importance: 76,
    summary: "Zonas HTML (descripciones, specs, FAQs) para productos y home.",
    testPlan: [
      {
        id: "wpz-1",
        title: "Instalar módulo",
      },
      {
        id: "wpz-2",
        title: "CRUD ProductZone / lines",
        detail: "Crear zonas y líneas HTML.",
      },
      {
        id: "wpz-3",
        title: "Render en ficha producto",
        detail: "Campos visibles y actualización en variantes.",
      },
      {
        id: "wpz-4",
        title: "Home zones template",
        detail: "Bloques de home según configuración.",
      },
    ],
  },
  {
    id: "fb_xml_feed",
    technicalName: "fb_xml_feed",
    displayName: "FB XML Feed",
    version: "17.0.1.0.1",
    depends: ["extended_warranty_macstation"],
    category: "analytics",
    priority: "P1",
    importance: 65,
    summary: "Feed XML de productos para Facebook (usa datos de Safe/stock).",
    testPlan: [
      {
        id: "fbx-1",
        title: "Instalar sobre extended_warranty",
      },
      {
        id: "fbx-2",
        title: "Página website del feed",
        detail: "Abrir URL del feed XML y validar XML bien formado.",
      },
      {
        id: "fbx-3",
        title: "Contenido de productos",
        detail: "SKU, precio, stock y atributos esperados por Meta.",
      },
      {
        id: "fbx-4",
        title: "Productos con/sin garantía",
        detail: "Verificar campos derivados de Safe si aplican.",
      },
    ],
  },

  // ─── P2 ───────────────────────────────────────────────────────────
  {
    id: "custom_product_attributes",
    technicalName: "custom_product_attributes",
    displayName: "Atributos Personalizados",
    version: "17.0.1.0.0",
    depends: [],
    category: "product",
    priority: "P2",
    importance: 55,
    summary: "Subtítulo en atributos de producto visible en la web.",
    testPlan: [
      {
        id: "cpa-1",
        title: "Instalar módulo",
      },
      {
        id: "cpa-2",
        title: "Campo Subtítulo en atributo",
        detail: "Editar product.attribute y guardar subtítulo.",
      },
      {
        id: "cpa-3",
        title: "Mostrar en ficha web",
        detail: "Subtítulo al lado del nombre del atributo + CSS.",
      },
    ],
  },
  {
    id: "hide_ecommerce_categories",
    technicalName: "hide_ecommerce_categories",
    displayName: "Ocultar Categorías eCommerce",
    version: "17.0.1.0.0",
    depends: [],
    category: "ecommerce",
    priority: "P2",
    importance: 50,
    summary: "Boolean 'Oculto' en categorías públicas de eCommerce.",
    testPlan: [
      {
        id: "hec-1",
        title: "Instalar módulo",
      },
      {
        id: "hec-2",
        title: "Marcar categoría como oculta",
      },
      {
        id: "hec-3",
        title: "No aparece en shop",
        detail: "Categoría oculta no listada en navegación/web.",
      },
    ],
  },
  {
    id: "product_variant_images",
    technicalName: "product_variant_images",
    displayName: "Product Variant Images",
    version: "17.0.1.0.0",
    depends: [],
    category: "product",
    priority: "P2",
    importance: 58,
    summary: "Imágenes asociadas por variante de producto.",
    testPlan: [
      {
        id: "pvi-1",
        title: "Instalar módulo",
      },
      {
        id: "pvi-2",
        title: "Asignar imágenes a variante",
        detail: "CRUD product.image ligado a product.product.",
      },
      {
        id: "pvi-3",
        title: "Cambio de variante en web",
        detail: "Al cambiar variante, imagen correcta (si theme lo usa).",
      },
    ],
  },
  {
    id: "website_product_ribbons",
    technicalName: "website_product_ribbons",
    displayName: "Website Product Ribbons",
    version: "17.0.1.0.0",
    depends: [],
    category: "ecommerce",
    priority: "P2",
    importance: 52,
    summary: "Tags de campaña con vigencia y badges de descuento.",
    testPlan: [
      {
        id: "wpr-1",
        title: "Instalar módulo",
      },
      {
        id: "wpr-2",
        title: "Crear campaign tag con fechas",
      },
      {
        id: "wpr-3",
        title: "Ribbon en producto/categoría",
        detail: "Visible en frontend con CSS; respeta vigencia.",
      },
      {
        id: "wpr-4",
        title: "Badge % descuento",
        detail: "Mostrar porcentaje cuando hay pricelist/descuento.",
      },
    ],
  },
  {
    id: "website_sale_product_search",
    technicalName: "website_sale_product_search",
    displayName: "Product Search by Synonyms",
    version: "17.0.1.0.0",
    depends: [],
    category: "ecommerce",
    priority: "P2",
    importance: 54,
    summary: "Búsqueda ecommerce por sinónimos / aliases.",
    testPlan: [
      {
        id: "wsps-1",
        title: "Instalar módulo",
      },
      {
        id: "wsps-2",
        title: "CRUD ProductSynonym",
      },
      {
        id: "wsps-3",
        title: "Búsqueda por sinónimo en shop",
        detail: "Al tipear alias, aparecen productos asociados.",
      },
    ],
  },
  {
    id: "website_sale_seo",
    technicalName: "website_sale_seo",
    displayName: "Ecommerce Website SEO / URL Rewrite",
    version: "1.0.2",
    depends: [],
    category: "ecommerce",
    priority: "P2",
    importance: 56,
    summary: "SEO producto/categoría + rewrite y redirects de URL.",
    testPlan: [
      {
        id: "wss-1",
        title: "Instalar módulo",
      },
      {
        id: "wss-2",
        title: "Config SEO / meta keywords wizard",
      },
      {
        id: "wss-3",
        title: "URL rewrite producto",
        detail: "Custom URL responde y canonical correcto.",
      },
      {
        id: "wss-4",
        title: "Redirect de URL vieja",
        detail: "301/redirect desde URL anterior.",
      },
      {
        id: "wss-5",
        title: "SEO categoría",
        detail: "Meta description/imagen de categoría.",
      },
    ],
  },
  {
    id: "fb_pixel",
    technicalName: "fb_pixel",
    displayName: "Facebook Pixel Integration",
    version: "17.0.1.0.0",
    depends: [],
    category: "analytics",
    priority: "P2",
    importance: 48,
    summary: "Pixel de Facebook en website_sale.",
    testPlan: [
      {
        id: "fbp-1",
        title: "Instalar (pre_init_hook)",
      },
      {
        id: "fbp-2",
        title: "Configurar Pixel ID en settings",
      },
      {
        id: "fbp-3",
        title: "Eventos en shop / purchase",
        detail: "Ver PageView/AddToCart/Purchase en debugger de Meta.",
      },
    ],
  },
  {
    id: "ga4_pixel",
    technicalName: "ga4_pixel",
    displayName: "Google GA4 Pixel Integration",
    version: "17.0.1.0.0",
    depends: [],
    category: "analytics",
    priority: "P2",
    importance: 48,
    summary: "Pixel GA4 básico en website_sale.",
    testPlan: [
      {
        id: "ga4p-1",
        title: "Instalar (pre_init_hook)",
      },
      {
        id: "ga4p-2",
        title: "Configurar Measurement ID",
      },
      {
        id: "ga4p-3",
        title: "Eventos en DebugView GA4",
      },
    ],
  },
  {
    id: "gtm_pixel",
    technicalName: "gtm_pixel",
    displayName: "Google Tag Manager Pixel",
    version: "17.0.1.0.0",
    depends: [],
    category: "analytics",
    priority: "P2",
    importance: 47,
    summary: "Integración GTM en website_sale.",
    testPlan: [
      {
        id: "gtm-1",
        title: "Instalar (pre_init_hook)",
      },
      {
        id: "gtm-2",
        title: "Configurar Container ID",
      },
      {
        id: "gtm-3",
        title: "Container carga en frontend",
        detail: "Preview GTM ve el contenedor.",
      },
    ],
  },
  {
    id: "eb_website_sale_google_analytics_4",
    technicalName: "eb_website_sale_google_analytics_4",
    displayName: "GA4 Advanced eCommerce Tracking",
    version: "17.0.2.0.14",
    depends: [],
    category: "analytics",
    priority: "P2",
    importance: 60,
    summary: "Tracking GA4 avanzado echoBitz (wishlist, logs, cron).",
    testPlan: [
      {
        id: "ebga-1",
        title: "Instalar (requests + wishlist)",
        detail: "Confirmar website_sale_wishlist en 19.",
      },
      {
        id: "ebga-2",
        title: "Configurar WebsiteTrackingService",
      },
      {
        id: "ebga-3",
        title: "Eventos ecommerce avanzados",
        detail: "view_item, add_to_cart, begin_checkout, purchase.",
      },
      {
        id: "ebga-4",
        title: "Logs y cron",
        detail: "WebsiteTrackingLog y ir_cron sin errores.",
      },
      {
        id: "ebga-5",
        title: "Wishlist tracking",
        detail: "Evento al agregar a wishlist.",
      },
    ],
  },

];

export const MODULE_BY_ID = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
) as Record<string, ModuleDef>;

export const PRIORITY_ORDER: Record<string, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En curso",
  blocked: "Bloqueado",
  passed: "OK",
  failed: "Fallido",
};

export const CATEGORY_LABELS: Record<string, string> = {
  ecommerce: "E-commerce",
  payments: "Pagos",
  product: "Producto",
  stock: "Stock",
  account: "Contabilidad / Ventas",
  analytics: "Analytics",
  theme: "Theme",
  warranty: "Garantías",
};

export function sortModules(mods: ModuleDef[] = MODULES): ModuleDef[] {
  return [...mods].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pa !== 0) return pa;
    return b.importance - a.importance;
  });
}
