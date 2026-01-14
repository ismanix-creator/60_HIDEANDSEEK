/**
 * @file        config.schema.ts
 * @description Zod Schema für config.toml Validation (STRICT) - passt 1:1 zur Struktur A-I
 * @version     3.0.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-13 00:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   3.0.0 - 2026-01-13 - COMPLETE RESTRUCTURE: Schema passt jetzt 1:1 zur config.toml Struktur A-I
 */

import { z } from 'zod';

// ========================================
// A) APP METADATA
// ========================================

const AppSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(1),
    description: z.string()
  })
  .strict();

const AuthSchema = z
  .object({
    enabled: z.boolean(),
    mode: z.enum(['password_required']),
    admin_bootstrap_user_id: z.string()
  })
  .strict();

// ========================================
// B) THEME PRIMITIVES
// ========================================

// Border
const ThemeBorderSchema = z
  .object({
    radius_none: z.string(),
    radius_sm: z.string(),
    radius_md: z.string(),
    radius_lg: z.string(),
    radius_xl: z.string(),
    radius_full: z.string()
  })
  .strict();

// Color Scale (für Farbpaletten)
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

// Colors
const ThemeColorsSchema = z
  .object({
    black: ColorScaleSchema,
    blue: ColorScaleSchema,
    bluegray: ColorScaleSchema,
    gold: ColorScaleSchema,
    graublau: ColorScaleSchema,
    gray: ColorScaleSchema,
    green: ColorScaleSchema,
    orange: ColorScaleSchema,
    red: ColorScaleSchema,
    opacity: z.record(z.string()),
    button: z
      .object({
        gray: z.string(),
        active: z.string()
      })
      .strict(),
    error: z
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
      .strict(),
    status: z
      .object({
        error: z.string(),
        warning: z.string(),
        success: z.string(),
        info: z.string()
      })
      .strict(),
    success: z
      .object({
        light: z.string(),
        main: z.string(),
        dark: z.string()
      })
      .strict(),
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
    warning: z
      .object({
        light: z.string(),
        main: z.string(),
        dark: z.string()
      })
      .strict()
  })
  .strict();

// Shadows
const ThemeShadowsSchema = z
  .object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    none: z.string()
  })
  .strict();

// Sizes
const ThemeSizesSchema = z
  .object({
    touchMinSizePx: z.number(),
    sidebarWidthPx: z.number()
  })
  .strict();

// Typography
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

const ThemeSpacingSchema = z
  .object({
    // Micro-Spacing (sehr kleine Abstände innerhalb von Komponenten)
    tight: z.string(),
    compact: z.string(),
    // Element-Spacing (Abstände zwischen benachbarten Elementen)
    element_gap: z.string(),
    content_gap: z.string(),
    // Container-Padding (Innenabstände von Containern)
    container_padding: z.string(),
    panel_padding: z.string(),
    section_padding: z.string(),
    page_padding: z.string(),
    // Mobile-spezifische Werte
    mobile_element_gap: z.string(),
    mobile_container_padding: z.string(),
    mobile_section_padding: z.string()
  })
  .strict();

const ThemeSchema = z
  .object({
    border: ThemeBorderSchema,
    colors: ThemeColorsSchema,
    shadows: ThemeShadowsSchema,
    sizes: ThemeSizesSchema,
    spacing: ThemeSpacingSchema,
    typography: ThemeTypographySchema
  })
  .strict();

// ========================================
// C) BASE-KOMPONENTEN
// ========================================

// Table
const GradientStopSchema = z
  .object({
    p: z.number(),
    c: z.string()
  })
  .strict();

const TableBaseProgressSchema = z
  .object({
    height: z.string(),
    radius: z.string(),
    trackBg: z.string(),
    trackBorder: z.string(),
    textColor: z.string(),
    gradientStops: z.array(GradientStopSchema)
  })
  .strict();

const TableBaseBestandSchema = z
  .object({
    invertProgressStops: z.boolean(),
    textColor: z.string()
  })
  .strict();

const TableBaseBehaviorSchema = z
  .object({
    minRows: z.number(),
    emptyRowPlaceholder: z.string()
  })
  .strict();

const TableBaseSchema = z
  .object({
    wrapperBg: z.string(),
    wrapperBorder: z.string(),
    wrapperBorderRadius: z.string(),
    wrapperShadow: z.string(),
    headerBg: z.string(),
    headerText: z.string(),
    headerFontSize: z.string(),
    headerFontWeight: z.number(),
    headerFontMono: z.boolean(),
    rowHeightPx: z.number(),
    rowBgOdd: z.string(),
    rowBgEven: z.string(),
    rowBgHover: z.string(),
    rowBorderBottom: z.string(),
    cellPaddingX: z.string(),
    cellPaddingY: z.string(),
    cellText: z.string(),
    cellFontSize: z.string(),
    cellFontWeight: z.number(),
    cellFontMono: z.boolean(),
    behavior: TableBaseBehaviorSchema,
    progress: TableBaseProgressSchema,
    bestand: TableBaseBestandSchema
  })
  .strict();

const ComponentsTableSchema = z
  .object({
    base: TableBaseSchema
  })
  .strict();

// Dialog
const DialogBaseOverlaySchema = z
  .object({
    bg: z.string()
  })
  .strict();

const DialogBaseContainerSchema = z
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
  .strict();

const DialogBaseHeaderSchema = z
  .object({
    borderBottom: z.string(),
    padding: z.string(),
    fontSize: z.string(),
    fontWeight: z.number()
  })
  .strict();

const DialogBaseBodySchema = z
  .object({
    padding: z.string(),
    gap: z.string(),
    fontSize: z.string(),
    fontWeight: z.number()
  })
  .strict();

const DialogBaseFooterSchema = z
  .object({
    borderTop: z.string(),
    padding: z.string(),
    marginTop: z.string(),
    gap: z.string()
  })
  .strict();

const DialogBaseSchema = z
  .object({
    overlay: DialogBaseOverlaySchema,
    container: DialogBaseContainerSchema,
    header: DialogBaseHeaderSchema,
    body: DialogBaseBodySchema,
    footer: DialogBaseFooterSchema
  })
  .strict();

const ComponentsDialogSchema = z
  .object({
    base: DialogBaseSchema
  })
  .strict();

// Button
const ButtonCommonSchema = z
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
    iconSize: z.string()
  })
  .strict();

const ButtonRectSchema = z
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
    height: z.string(),
    iconSize: z.string()
  })
  .strict();

const ComponentsButtonSchema = z
  .object({
    borderRadius: z.string(),
    nav: ButtonCommonSchema,
    new: ButtonCommonSchema,
    act: ButtonCommonSchema,
    tab: ButtonCommonSchema,
    rect: ButtonRectSchema,
    back: ButtonCommonSchema
  })
  .strict();

// Badge
const BadgeBaseSchema = z
  .object({
    paddingX: z.number(),
    paddingY: z.number(),
    borderRadius: z.string(),
    fontSize: z.string(),
    fontWeight: z.number(),
    display: z.string(),
    alignItems: z.string(),
    gap: z.string()
  })
  .strict();

const BadgeVariantSchema = z
  .object({
    bg: z.string(),
    text: z.string()
  })
  .strict();

const BadgeVariantsSchema = z
  .object({
    success: BadgeVariantSchema,
    error: BadgeVariantSchema,
    warning: BadgeVariantSchema,
    info: BadgeVariantSchema,
    pending: BadgeVariantSchema,
    neutral: BadgeVariantSchema
  })
  .strict();

const ComponentsBadgeSchema = z
  .object({
    base: BadgeBaseSchema,
    variants: BadgeVariantsSchema
  })
  .strict();

// Form Input
const FormInputBaseSchema = z
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
    height: z.string(),
    borderWidth: z.string()
  })
  .strict();

const FormInputStateSchema = z
  .object({
    border: z.string(),
    bg: z.string(),
    text: z.string(),
    outline: z.string()
  })
  .strict();

const FormInputStatesSchema = z
  .object({
    default: FormInputStateSchema,
    focus: FormInputStateSchema,
    error: FormInputStateSchema,
    disabled: FormInputStateSchema
  })
  .strict();

const FormInputSchema = z
  .object({
    base: FormInputBaseSchema,
    states: FormInputStatesSchema
  })
  .strict();

const ComponentsFormSchema = z
  .object({
    input: FormInputSchema
  })
  .strict();

// Divider
const DividerMonthSchema = z
  .object({
    bg: z.string(),
    text: z.string(),
    border: z.string(),
    padding: z.string(),
    paddingY: z.number(),
    paddingX: z.number(),
    fontSize: z.string(),
    fontWeight: z.number(),
    textTransform: z.string()
  })
  .strict();

const DividerHorizontalSchema = z
  .object({
    border: z.string(),
    margin: z.string(),
    marginY: z.number(),
    height: z.string(),
    thickness: z.string(),
    color: z.string()
  })
  .strict();

const ComponentsDividerSchema = z
  .object({
    month: DividerMonthSchema,
    horizontal: DividerHorizontalSchema
  })
  .strict();

// Infobox
const InfoboxBaseSchema = z
  .object({
    padding: z.string(),
    borderRadius: z.string(),
    fontSize: z.string(),
    fontWeight: z.number(),
    borderWidth: z.string()
  })
  .strict();

const InfoboxPanelSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    borderRadius: z.string(),
    padding: z.string()
  })
  .strict();

const InfoboxVariantSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    icon: z.string(),
    iconColor: z.string()
  })
  .strict();

const InfoboxVariantsSchema = z
  .object({
    info: InfoboxVariantSchema,
    success: InfoboxVariantSchema,
    warning: InfoboxVariantSchema,
    error: InfoboxVariantSchema
  })
  .strict();

const InfoboxFormCompactSchema = z
  .object({
    containerWidth: z.string(),
    inputWidth: z.string(),
    buttonSize: z.string()
  })
  .strict();

const ComponentsInfoboxSchema = z
  .object({
    base: InfoboxBaseSchema,
    panel: InfoboxPanelSchema,
    variants: InfoboxVariantsSchema,
    formCompact: InfoboxFormCompactSchema
  })
  .strict();

const ComponentsSchema = z
  .object({
    table: ComponentsTableSchema,
    dialog: ComponentsDialogSchema,
    button: ComponentsButtonSchema,
    badge: ComponentsBadgeSchema,
    form: ComponentsFormSchema,
    divider: ComponentsDividerSchema,
    infobox: ComponentsInfoboxSchema
  })
  .strict();

// ========================================
// D) PAGES
// ========================================

const ColumnSchema = z
  .object({
    key: z.string(),
    label: z.string(),
    width: z.string(),
    type: z.enum(['text', 'number', 'currency', 'date', 'status', 'input', 'actions', 'progress', 'button']),
    monospace: z.boolean().optional(),
    buttons: z.array(z.string()).optional()
  })
  .strict();

const TableColumnsSchema = z
  .object({
    columns: z.array(ColumnSchema)
  })
  .strict();

const PagesMaterialSchema = z
  .object({
    table: TableColumnsSchema
  })
  .strict();

const PagesKundenOverviewSchema = z
  .object({
    table: TableColumnsSchema
  })
  .strict();

const PagesKundenMatSchema = z
  .object({
    table: TableColumnsSchema
  })
  .strict();

const PagesKundenNomatSchema = z
  .object({
    table: TableColumnsSchema
  })
  .strict();

const PagesKundenSchema = z
  .object({
    overview: PagesKundenOverviewSchema,
    mat: PagesKundenMatSchema,
    nomat: PagesKundenNomatSchema
  })
  .strict();

const PagesSchuldnerSchema = z
  .object({
    table: TableColumnsSchema
  })
  .strict();

const PagesGlaeubigerSchema = z
  .object({
    table: TableColumnsSchema
  })
  .strict();

const PagesSettingsSchema = z.object({}).strict();

const PagesTitlesSchema = z
  .object({
    dashboard: z.string(),
    material: z.string(),
    customers: z.string(),
    creditors: z.string(),
    debtors: z.string(),
    settings: z.string()
  })
  .strict();

const PagesDashboardCardSchema = z
  .object({
    width: z.string(),
    height: z.string(),
    gap: z.string(),
    iconSize: z.string(),
    padding: z.string()
  })
  .strict();

const PagesDashboardSchema = z
  .object({
    card: PagesDashboardCardSchema
  })
  .strict();

const PagesSchema = z
  .object({
    material: PagesMaterialSchema,
    kunden: PagesKundenSchema,
    schuldner: PagesSchuldnerSchema,
    glaeubiger: PagesGlaeubigerSchema,
    settings: PagesSettingsSchema,
    dashboard: PagesDashboardSchema,
    titles: PagesTitlesSchema
  })
  .strict();

// ========================================
// E) CONTENT
// ========================================

const ContentButtonsSchema = z
  .object({
    save: z.string(),
    cancel: z.string(),
    delete: z.string(),
    create: z.string(),
    edit: z.string(),
    close: z.string(),
    record: z.string()
  })
  .strict();

const ContentDialogTitlesSchema = z
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
  .strict();

const ContentLabelsSchema = z
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
    purchase_price_total: z.string(),
    selling_price_unit: z.string(),
    info: z.string(),
    due_date: z.string(),
    open_amount: z.string(),
    status: z.string(),
    actions: z.string(),
    stock: z.string(),
    revenue: z.string(),
    profit: z.string(),
    available: z.string(),
    bar_sale: z.string(),
    kombi_booking: z.string(),
    total_price: z.string(),
    total: z.string(),
    price: z.string(),
    customer: z.string(),
    price_per_unit_short: z.string(),
    price_total_short: z.string(),
    price_per_piece: z.string()
  })
  .strict();

const ContentMessagesSchema = z
  .object({
    confirm_delete_material: z.string(),
    confirm_delete_customer: z.string(),
    confirm_delete_creditor: z.string(),
    confirm_delete_debtor: z.string()
  })
  .strict();

const ContentInputLimitsSchema = z
  .object({
    quantity_min: z.number(),
    quantity_step: z.number(),
    price_min: z.number(),
    price_step: z.number()
  })
  .strict();

const ContentEmptyStatesSchema = z
  .object({
    no_history: z.string(),
    no_customers: z.string(),
    no_material_posts: z.string(),
    no_other_posts: z.string(),
    no_creditors: z.string(),
    no_debtors: z.string()
  })
  .strict();

const ContentErrorsSchema = z
  .object({
    create_failed: z.string(),
    update_failed: z.string(),
    delete_failed: z.string(),
    load_failed: z.string(),
    booking_failed: z.string(),
    network_error: z.string()
  })
  .strict();

const ContentStatusSchema = z
  .object({
    paid: z.string(),
    partial: z.string(),
    open: z.string()
  })
  .strict();

const ContentTooltipsSchema = z
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
  .strict();

const ContentValidationSchema = z
  .object({
    date_required: z.string(),
    designation_required: z.string(),
    quantity_must_be_positive: z.string(),
    ek_stueck_must_be_positive: z.string(),
    ek_gesamt_must_be_positive: z.string(),
    vk_stueck_must_be_positive: z.string()
  })
  .strict();

const ContentSchema = z
  .object({
    buttons: ContentButtonsSchema,
    dialog_titles: ContentDialogTitlesSchema,
    labels: ContentLabelsSchema,
    messages: ContentMessagesSchema,
    input_limits: ContentInputLimitsSchema,
    empty_states: ContentEmptyStatesSchema,
    errors: ContentErrorsSchema,
    status: ContentStatusSchema,
    tooltips: ContentTooltipsSchema,
    validation: ContentValidationSchema
  })
  .strict();

// ========================================
// F) NAVIGATION
// ========================================

const NavigationItemSchema = z
  .object({
    key: z.string(),
    label: z.string(),
    path: z.string(),
    icon: z.string()
  })
  .strict();

const NavigationIconSchema = z
  .object({
    rotateGlaeubiger: z.string()
  })
  .strict();

const NavigationSchema = z
  .object({
    zIndex: z.number(),
    borderWidth: z.string(),
    transition: z.string(),
    hoverScale: z.string(),
    normalScale: z.string(),
    fontSize: z.string(),
    fontWeight: z.number(),
    icon: NavigationIconSchema,
    items: z.array(NavigationItemSchema)
  })
  .strict();

// ========================================
// F) LAYOUT
// ========================================

const LayoutNavigationSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    height: z.string()
  })
  .strict();

const LayoutHeaderSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    borderWidth: z.string(),
    padding: z.string(),
    gap: z.string(),
    fontSize: z.string(),
    fontWeight: z.number()
  })
  .strict();

// ========================================
// H) CONTENT-KONFIG
// ========================================

const LayoutContentSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    borderWidth: z.string()
  })
  .strict();

// ========================================
// I) FOOTER-KONFIG
// ========================================

const LayoutFooterSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    borderWidth: z.string(),
    borderRadius: z.string(),
    height: z.string(),
    padding: z.string(),
    gap: z.string(),
    gridColumns: z.number()
  })
  .strict();

// ========================================
// J) LAYOUT RULES / RESPONSIVE
// ========================================

const LayoutRulesSchema = z
  .object({
    mobileBreakpointPx: z.number(),
    desktopBreakpointPx: z.number(),
    sidebarCollapseBelowPx: z.number(),
    tableHorizontalScrollBelowPx: z.number(),
    contentMaxWidthPx: z.number(),
    bottomNavHeightPx: z.number(),
    bottomNavPadding: z.string(),
    touchMinSizePx: z.number()
  })
  .strict();

const LayoutSchema = z
  .object({
    navigation: LayoutNavigationSchema,
    header: LayoutHeaderSchema,
    content: LayoutContentSchema,
    footer: LayoutFooterSchema,
    rules: LayoutRulesSchema
  })
  .strict();

// ========================================
// MAIN CONFIG SCHEMA
// ========================================

export const ConfigSchema = z
  .object({
    // A) App Metadata
    app: AppSchema,
    auth: AuthSchema,

    // B) Theme Primitives
    theme: ThemeSchema,

    // C) Base Components
    components: ComponentsSchema,

    // D) Pages
    pages: PagesSchema,

    // E) Content
    content: ContentSchema,

    // F) Navigation
    navigation: NavigationSchema,

    // G-I) Layout
    layout: LayoutSchema
  })
  .strict();

/**
 * TypeScript Types
 */
export type AppConfig = z.infer<typeof ConfigSchema>;
export type TablePage = z.infer<typeof TableColumnsSchema>;
export type Column = z.infer<typeof ColumnSchema>;
