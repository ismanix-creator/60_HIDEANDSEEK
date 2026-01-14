/**
 * @file        config.schema.ts
 * @description Zod Schema für config.toml Validation (STRICT) - passt 1:1 zur Struktur A-I
 * @version     3.0.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-13 00:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   3.0.0 - 2026-01-13 - COMPLETE RESTRUCTURE: Schema passt jetzt 1:1 zur config.toml Struktur A-I (App Metadata, Theme Primitives, Base Components, Pages, Content, Navigation, Layout)
 */

import { z } from 'zod';

/**
 * App Schema
 */
const AppSchema = z
  .object({
    name: z.string().min(1),
    version: z.union([
      z.string().regex(/^\d+\.\d+\.\d+$/), // Semantic Versioning (e.g., "1.2.0")
      z.number().int().positive() // Numeric Versioning (e.g., 123)
    ]),
    description: z.string()
  })
  .strict();

/**
 * Auth Schema
 */
const AuthSchema = z
  .object({
    enabled: z.boolean(),
    mode: z.enum(['password_required']),
    admin_bootstrap_user_id: z.string()
  })
  .strict();

/**
 * Navigation Item Schema
 */
const NavigationItemSchema = z
  .object({
    key: z.string(),
    label: z.string(),
    path: z.string(),
    icon: z.string()
  })
  .strict();

/**
 * Navigation Schema
 */
const NavigationSchema = z
  .object({
    items: z.array(NavigationItemSchema),
    zIndex: z.number(),
    borderWidth: z.string(),
    transition: z.string(),
    hoverScale: z.string(),
    normalScale: z.string(),
    fontSize: z.string(),
    fontWeight: z.number(),
    fontMono: z.boolean().optional(),
    icon: z
      .object({
        rotateGlaeubiger: z.string()
      })
      .strict()
  })
  .strict();

/**
 * Color Scale Schema (for color palettes)
 */
const ColorScaleSchema = z
  .object({
    50: z.string(),
    100: z.string(),
    200: z.string(),
    300: z.string(),
    400: z.string(),
    500: z.string(),
    600: z.string(),
    700: z.string(),
    800: z.string(),
    900: z.string()
  })
  .strict();

/**
 * Theme Colors Schema
 * Config.toml hat: white, gray, black, yellow, orange, red, green, lime, teal, cyan, blue, bluegray, brown, indigo, purple, silver, gold
 */
const ThemeColorsSchema = z
  .object({
    white: ColorScaleSchema,
    gray: ColorScaleSchema,
    graublau: ColorScaleSchema.optional(),
    grayblue: ColorScaleSchema.optional(),
    black: ColorScaleSchema,
    orange: ColorScaleSchema,
    red: ColorScaleSchema,
    green: ColorScaleSchema,
    lime: ColorScaleSchema,
    teal: ColorScaleSchema,
    cyan: ColorScaleSchema,
    blue: ColorScaleSchema,
    bluegray: ColorScaleSchema,
    brown: ColorScaleSchema,
    indigo: ColorScaleSchema,
    purple: ColorScaleSchema,
    silver: ColorScaleSchema,
    gold: ColorScaleSchema,
    opacity: z.record(z.string(), z.string()),
    text: z
      .object({
        primary: z.string(),
        secondary: z.string(),
        tertiary: z.string()
      })
      .strict(),
    ui: z
      .object({
        background: z.string(),
        backgroundAlt: z.string(),
        backgroundCard: z.string(),
        border: z.string()
      })
      .strict(),
    button: z
      .object({
        gray: z.string(),
        active: z.string()
      })
      .strict(),
    status: z
      .object({
        error: z.string(),
        warning: z.string(),
        success: z.string(),
        info: z.string()
      })
      .strict(),
    error: z
      .object({
        light: z.string(),
        main: z.string(),
        dark: z.string()
      })
      .strict(),
    warning: z
      .object({
        light: z.string(),
        main: z.string(),
        dark: z.string()
      })
      .strict(),
    success: z
      .object({
        light: z.string(),
        main: z.string(),
        dark: z.string()
      })
      .strict(),
    info: z
      .object({
        light: z.string(),
        main: z.string(),
        dark: z.string()
      })
      .strict()
  })
  .strict();

/**
 * Theme Typography Schema
 */
const ThemeTypographySchema = z
  .object({
    fontFamily: z
      .object({
        base: z.string(),
        mono: z.string()
      })
      .strict(),
    fontSize: z
      .object({
        xs: z.string(),
        sm: z.string(),
        md: z.string(),
        lg: z.string(),
        xl: z.string()
      })
      .strict(),
    fontWeight: z
      .object({
        normal: z.number(),
        medium: z.number(),
        semibold: z.number(),
        bold: z.number()
      })
      .strict()
  })
  .strict();

/**
 * Theme Spacing Schema
 */
const ThemeSpacingMobileSchema = z
  .object({
    xxs: z.string(),
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xxl: z.string()
  })
  .strict();

const ThemeSpacingSchema = z
  .object({
    xxs: z.string(),
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xxl: z.string(),
    layout: z
      .object({
        contentMaxWidthRem: z.string()
      })
      .strict(),
    mobile: ThemeSpacingMobileSchema
  })
  .strict();

/**
 * Theme Breakpoints Schema
 */
const BreakpointDeviceSchema = z
  .object({
    width: z.number(),
    height: z.number()
  })
  .strict();

const ThemeBreakpointsSchema = z
  .object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xxl: z.string(),
    mobile: z.number(),
    desktop: z.number(),
    devices: z
      .object({
        samsungS24: BreakpointDeviceSchema,
        iPhone15: BreakpointDeviceSchema,
        surface7: BreakpointDeviceSchema
      })
      .strict()
  })
  .strict();

/**
 * Theme BorderRadius Schema
 */
const ThemeBorderRadiusSchema = z
  .object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    full: z.string()
  })
  .strict();

/**
 * Theme Shadows Schema
 */
const ThemeShadowsSchema = z
  .object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    none: z.string()
  })
  .strict();

/**
 * Theme Responsive Schema
 */
const ThemeResponsiveSchema = z
  .object({
    bottomNavHeight: z.string(),
    bottomNavPadding: z.string(),
    sidebarWidth: z.string(),
    touchMinSize: z.number()
  })
  .strict();

/**
 * Badge Schema
 */
const BadgeVariantSchema = z
  .object({
    bg: z.string(),
    text: z.string()
  })
  .strict();

const BadgeSchema = z
  .object({
    base: z
      .object({
        paddingX: z.number(),
        paddingY: z.number(),
        borderRadius: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional(),
        display: z.string(),
        alignItems: z.string(),
        gap: z.string()
      })
      .strict(),
    variants: z
      .object({
        success: BadgeVariantSchema,
        error: BadgeVariantSchema,
        warning: BadgeVariantSchema,
        info: BadgeVariantSchema,
        pending: BadgeVariantSchema,
        neutral: BadgeVariantSchema
      })
      .strict()
  })
  .strict();

/**
 * Button Schema
 */
// Icon Button Types: nav, new, act, tab (Icon-Only Buttons mit direkter iconSize)
const IconButtonSchema = z
  .object({
    bg: z.string(),
    icon: z.string(),
    border: z.string(),
    hoverBg: z.string(),
    activeBg: z.string(),
    disabledBg: z.string(),
    disabledIcon: z.string(),
    focusRing: z.string(),
    focusRingOpacity: z.string(),
    iconSize: z.string() // Direct size in px (e.g., "24px", "32px", "20px")
  })
  .strict();

// Rect Button Type (Standard Text-Buttons mit intent: default/save)
const RectButtonSchema = z
  .object({
    bg: z.string(),
    text: z.string(),
    border: z.string(),
    hoverBg: z.string(),
    activeBg: z.string(),
    disabledBg: z.string(),
    disabledText: z.string(),
    saveBg: z.string(),
    saveText: z.string(),
    saveHoverBg: z.string(),
    saveActiveBg: z.string(),
    focusRing: z.string(),
    focusRingOpacity: z.string(),
    padding: z.string(),
    fontSize: z.string(),
    fontWeight: z.number(),
    fontMono: z.boolean().optional(),
    height: z.string(),
    iconSize: z.string()
  })
  .strict();

const ButtonSchema = z
  .object({
    borderRadius: z.string(),
    nav: IconButtonSchema,
    new: IconButtonSchema,
    act: IconButtonSchema,
    tab: IconButtonSchema,
    rect: RectButtonSchema
  })
  .strict();

/**
 * Dialog Schema
 */
const DialogSchema = z
  .object({
    overlay: z
      .object({
        bg: z.string()
      })
      .strict(),
    container: z
      .object({
        bg: z.string(),
        border: z.string(),
        borderRadius: z.string(),
        padding: z.string(),
        maxWidth: z.string(),
        width: z.string(),
        height: z.string(),
        maxHeight: z.string(),
        shadow: z.string()
      })
      .strict(),
    header: z
      .object({
        borderBottom: z.string(),
        padding: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional()
      })
      .strict(),
    body: z
      .object({
        padding: z.string(),
        gap: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional()
      })
      .strict(),
    footer: z
      .object({
        borderTop: z.string(),
        padding: z.string(),
        marginTop: z.string(),
        gap: z.string()
      })
      .strict()
  })
  .strict();

/**
 * Divider Schema
 */
const DividerSchema = z
  .object({
    month: z
      .object({
        bg: z.string(),
        text: z.string(),
        border: z.string(),
        padding: z.string(),
        paddingY: z.number(),
        paddingX: z.number(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional(),
        textTransform: z.string()
      })
      .strict(),
    horizontal: z
      .object({
        border: z.string(),
        margin: z.string(),
        marginY: z.number(),
        height: z.string(),
        thickness: z.string(),
        color: z.string()
      })
      .strict()
  })
  .strict();

/**
 * Infobox Schema
 */
const InfoboxVariantSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    icon: z.string(),
    iconColor: z.string()
  })
  .strict();

const InfoboxSchema = z
  .object({
    base: z
      .object({
        padding: z.string(),
        borderRadius: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional(),
        borderWidth: z.string()
      })
      .strict(),
    variants: z
      .object({
        info: InfoboxVariantSchema,
        success: InfoboxVariantSchema,
        warning: InfoboxVariantSchema,
        error: InfoboxVariantSchema
      })
      .strict(),
    panel: z
      .object({
        bg: z.string(),
        border: z.string(),
        borderRadius: z.string(),
        padding: z.string()
      })
      .strict(),
    formCompact: z
      .object({
        containerWidth: z.string(),
        inputWidth: z.string(),
        buttonSize: z.string()
      })
      .strict()
  })
  .strict();

/**
 * Input Schema
 */
const InputStateSchema = z
  .object({
    border: z.string(),
    bg: z.string(),
    outline: z.string(),
    text: z.string()
  })
  .strict();

const InputSchema = z
  .object({
    base: z
      .object({
        bg: z.string(),
        border: z.string(),
        text: z.string(),
        padding: z.string(),
        paddingX: z.number(),
        paddingY: z.number(),
        borderRadius: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional(),
        height: z.string(),
        borderWidth: z.string()
      })
      .strict(),
    states: z
      .object({
        focus: InputStateSchema,
        error: InputStateSchema,
        disabled: InputStateSchema,
        default: InputStateSchema
      })
      .strict()
  })
  .strict();

/**
 * Page Header Schema
 */
const PageHeaderSchema = z
  .object({
    button: z
      .object({
        className: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
        fontMono: z.boolean().optional()
      })
      .strict()
  })
  .strict();

/**
 * Table Column & Pages Schemas (migrated from schemas/table.ts)
 */
export const ColumnSchema = z
  .object({
    key: z.string().min(1),
    label: z.string().min(1),
    width: z.string(), // CSS Wert: %, rem, px, em, auto
    type: z.enum(['text', 'number', 'currency', 'date', 'status', 'input', 'actions', 'progress', 'button']),
    monospace: z.boolean().optional(),
    buttons: z.array(z.string()).optional()
  })
  .strict();

export const TablePageSchema = z
  .object({
    columns: z.array(ColumnSchema)
  })
  .strict();

export const TablePagesSchema = z
  .object({
    material: TablePageSchema,
    kunden: TablePageSchema,
    glaeubiger: TablePageSchema,
    schuldner: TablePageSchema
  })
  .strict();

/**
 * Bestand Colors Schema (9 Stufen + zero_paid)
 */
const BestandColorsSchema = z
  .object({
    green_high: z.string(),
    green_mid: z.string(),
    green_low: z.string(),
    yellow_high: z.string(),
    yellow_mid: z.string(),
    yellow_low: z.string(),
    red_high: z.string(),
    red_mid: z.string(),
    red_low: z.string(),
    zero_paid: z.string(),
    text: z.string()
  })
  .strict();

/**
 * Table Progress Colors Schema (Universal: 9-stufige Skala + Zero-State)
 * Zentrale Definition für alle Fortschrittsbalken (Bestand, Fortschritt)
 */
const TableProgressColorsSchema = z
  .object({
    green_high: z.string(),
    green_mid: z.string(),
    green_low: z.string(),
    yellow_high: z.string(),
    yellow_mid: z.string(),
    yellow_low: z.string(),
    red_high: z.string(),
    red_mid: z.string(),
    red_low: z.string(),
    zero_paid: z.string(),
    text: z.string()
  })
  .strict();

/**
 * Table Schema
 */
const TableSchema = z
  .object({
    // Basis-Layout (flat keys only, rowHeight MUSS px sein!)
    rowHeight: z.string().regex(/^\d+px$/),
    cellPaddingX: z.string(),
    cellPaddingY: z.string(),

    // Behavior (min rows, empty placeholder)
    behavior: z
      .object({
        minRows: z.number().int().min(0),
        emptyRowPlaceholder: z.string()
      })
      .strict(),

    // Progress Colors (Universal: 9-stufige Skala für alle Fortschrittsbalken)
    progress: z
      .object({
        colors: TableProgressColorsSchema
      })
      .strict(),

    // Wrapper (flat keys only)
    wrapperBg: z.string(),
    wrapperBorder: z.string(),
    wrapperBorderRadius: z.string(),
    wrapperShadow: z.enum(['sm', 'md', 'lg', 'xl', 'none']),

    // Header (flat keys only)
    headerBg: z.string(),
    headerText: z.string(),
    headerFontSize: z.string(),
    headerFontWeight: z.number(),
    headerFontMono: z.boolean(),

    // Cell (flat keys only)
    cellText: z.string(),
    cellFontSize: z.string(),
    cellFontWeight: z.number(),
    cellFontMono: z.boolean(),

    // Row (flat keys only)
    rowBgOdd: z.string(),
    rowBgEven: z.string(),
    rowBgHover: z.string(),
    rowBorderBottom: z.string(),

    // Bestand Colors (Material)
    bestand: z
      .object({
        colors: BestandColorsSchema
      })
      .strict()
      .optional(),

    // Material mit Fortschritt
    material: z
      .object({
        columns: z.array(ColumnSchema).optional(),
        fortschritt: z
          .object({
            colors: TableProgressColorsSchema
          })
          .strict()
          .optional()
      })
      .strict()
      .optional(),

    // Kunden (Übersicht + Material-Posten + Sonstige Posten)
    kunden: z
      .object({
        columns: z.array(ColumnSchema).optional(),
        fortschritt: z
          .object({
            colors: TableProgressColorsSchema
          })
          .strict()
          .optional(),
        mat: z
          .object({
            columns: z.array(ColumnSchema).optional(),
            fortschritt: z
              .object({
                colors: TableProgressColorsSchema
              })
              .strict()
              .optional()
          })
          .strict()
          .optional(),
        nomat: z
          .object({
            columns: z.array(ColumnSchema).optional(),
            fortschritt: z
              .object({
                colors: TableProgressColorsSchema
              })
              .strict()
              .optional()
          })
          .strict()
          .optional()
      })
      .strict()
      .optional(),

    // Schuldner mit Fortschritt
    schuldner: z
      .object({
        columns: z.array(ColumnSchema).optional(),
        fortschritt: z
          .object({
            colors: TableProgressColorsSchema
          })
          .strict()
          .optional()
      })
      .strict()
      .optional(),

    // Gläubiger mit Fortschritt
    glaeubiger: z
      .object({
        columns: z.array(ColumnSchema).optional(),
        fortschritt: z
          .object({
            colors: TableProgressColorsSchema
          })
          .strict()
          .optional()
      })
      .strict()
      .optional()
  })
  .strict();

/**
 * Layout Areas Schema
 */
const LayoutAreaSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    borderWidth: z.string(),
    borderRadius: z.string().optional(),
    height: z.string().optional(),
    minHeight: z.string().optional(),
    padding: z.string().optional(),
    gap: z.string().optional(),
    gridColumns: z.number().optional()
  })
  .strict();

const LayoutSchema = z
  .object({
    areas: z
      .object({
        navigation: LayoutAreaSchema,
        header: LayoutAreaSchema,
        content: LayoutAreaSchema,
        footer: LayoutAreaSchema
      })
      .strict()
  })
  .strict();

/**
 * Main Config Schema (STRICT - matches TOML flat structure)
 */
export const ConfigSchema = z
  .object({
    // App & Auth
    app: AppSchema,
    auth: AuthSchema,
    navigation: NavigationSchema,

    // Theme (flat keys)
    colors: ThemeColorsSchema,
    typography: ThemeTypographySchema,
    spacing: ThemeSpacingSchema,
    breakpoints: ThemeBreakpointsSchema,
    borderRadius: ThemeBorderRadiusSchema,
    shadows: ThemeShadowsSchema,
    responsive: ThemeResponsiveSchema,

    // Components
    badge: BadgeSchema,
    button: ButtonSchema,
    dialog: DialogSchema,
    divider: DividerSchema,
    infobox: InfoboxSchema,
    input: InputSchema,
    pageHeader: PageHeaderSchema,
    table: TableSchema,
    layout: LayoutSchema,

    // UI Texts
    buttons: z
      .object({
        save: z.string(),
        cancel: z.string(),
        delete: z.string(),
        create: z.string(),
        edit: z.string(),
        close: z.string(),
        record: z.string()
      })
      .strict(),
    labels: z
      .object({
        date: z.string(),
        name: z.string(),
        designation: z.string(),
        quantity: z.string(),
        amount: z.string(),
        amount_paid: z.string(),
        payment_amount: z.string(),
        material: z.string(),
        note: z.string(),
        price_per_unit: z.string(),
        purchase_price: z.string(),
        info: z.string(),
        due_date: z.string(),
        open_amount: z.string(),
        status: z.string(),
        actions: z.string(),
        purchase_price_total: z.string(),
        selling_price_unit: z.string(),
        stock: z.string(),
        revenue: z.string(),
        profit: z.string(),
        available: z.string(),
        bar_sale: z.string(),
        kombi_booking: z.string(),
        total_price: z.string(),
        total: z.string(),
        price: z.string(),
        customer: z.string()
      })
      .strict(),
    tooltips: z
      .object({
        bar_transaction: z.string(),
        kombi_transaction: z.string(),
        edit: z.string(),
        delete: z.string(),
        new_material: z.string(),
        new_customer: z.string(),
        new_creditor: z.string(),
        new_debtor: z.string(),
        payment: z.string(),
        create: z.string(),
        record: z.string()
      })
      .strict(),
    page_titles: z
      .object({
        material: z.string(),
        customers: z.string(),
        creditors: z.string(),
        debtors: z.string(),
        settings: z.string()
      })
      .strict(),
    dialog_titles: z
      .object({
        new_material: z.string(),
        edit_material: z.string(),
        delete_material: z.string(),
        bar_transaction: z.string(),
        kombi_transaction: z.string(),
        new_customer: z.string(),
        edit_customer: z.string(),
        delete_customer: z.string(),
        new_material_post: z.string(),
        new_other_post: z.string(),
        record_payment: z.string(),
        new_creditor: z.string(),
        edit_creditor: z.string(),
        delete_creditor: z.string(),
        new_debtor: z.string(),
        edit_debtor: z.string(),
        delete_debtor: z.string(),
        history: z.string()
      })
      .strict(),
    messages: z
      .object({
        confirm_delete_material: z.string(),
        confirm_delete_customer: z.string(),
        confirm_delete_creditor: z.string(),
        confirm_delete_debtor: z.string()
      })
      .strict(),
    validation: z
      .object({
        date_required: z.string(),
        designation_required: z.string(),
        quantity_must_be_positive: z.string(),
        ek_stueck_must_be_positive: z.string(),
        ek_gesamt_must_be_positive: z.string(),
        vk_stueck_must_be_positive: z.string()
      })
      .strict(),
    errors: z
      .object({
        create_failed: z.string(),
        update_failed: z.string(),
        delete_failed: z.string(),
        load_failed: z.string(),
        booking_failed: z.string(),
        network_error: z.string()
      })
      .strict(),
    empty_states: z
      .object({
        no_history: z.string(),
        no_customers: z.string(),
        no_material_posts: z.string(),
        no_other_posts: z.string(),
        no_creditors: z.string(),
        no_debtors: z.string()
      })
      .strict(),
    input_limits: z
      .object({
        quantity_min: z.number(),
        quantity_step: z.number(),
        price_min: z.number(),
        price_step: z.number()
      })
      .strict(),
    status: z
      .object({
        paid: z.string(),
        partial: z.string(),
        open: z.string()
      })
      .strict()
  })
  .strict();

/**
 * TypeScript Types
 */
export type AppConfig = z.infer<typeof ConfigSchema>;
export type TablePage = z.infer<typeof TablePageSchema>;
export type TablePages = z.infer<typeof TablePagesSchema>;
