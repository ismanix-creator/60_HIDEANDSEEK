/**
 * @file        config.schema.ts
 * @description Zod Schema für config.toml Validation (STRICT)
 * @version     1.1.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-09 17:20:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.0 - 2026-01-09 - Theme/Components/UI schemas erweitert (strict auf allen Ebenen)
 *   1.0.0 - 2026-01-07 - Initial strict schema for config.toml
 */

import { z } from 'zod';

/**
 * Hex Color Regex Validator
 */
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

/**
 * App Schema
 */
const AppSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    description: z.string()
  })
  .strict();

/**
 * Server Schema
 */
const ServerSchema = z
  .object({
    port: z.number().int().positive().max(65535),
    host: z.string()
  })
  .strict();

/**
 * Client Schema
 */
const ClientSchema = z
  .object({
    port: z.number().int().positive().max(65535),
    apiUrl: z.string().url(),
    ngrokUrl: z.string().url()
  })
  .strict();

/**
 * Database Schema
 */
const DatabaseSchema = z
  .object({
    type: z.literal('sqlite'),
    path: z.string()
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
    items: z.array(NavigationItemSchema)
  })
  .strict();

/**
 * Color Scale Schema (for primary, neutral, etc.)
 */
const ColorScaleSchema = z
  .object({
    50: hexColorSchema,
    100: hexColorSchema,
    200: hexColorSchema,
    300: hexColorSchema,
    400: hexColorSchema,
    500: hexColorSchema,
    600: hexColorSchema,
    700: hexColorSchema,
    800: hexColorSchema,
    900: hexColorSchema
  })
  .strict();

/**
 * Theme Colors Schema
 */
const ThemeColorsSchema = z
  .object({
    primary: ColorScaleSchema,
    text: z
      .object({
        primary: hexColorSchema,
        secondary: hexColorSchema,
        tertiary: hexColorSchema
      })
      .strict(),
    ui: z
      .object({
        background: hexColorSchema,
        backgroundAlt: hexColorSchema,
        backgroundCard: hexColorSchema,
        border: hexColorSchema
      })
      .strict(),
    button: z
      .object({
        gray: hexColorSchema,
        active: hexColorSchema,
        customer: hexColorSchema,
        offer: hexColorSchema,
        order: hexColorSchema,
        invoice: hexColorSchema
      })
      .strict(),
    status: z
      .object({
        error: hexColorSchema,
        warning: hexColorSchema,
        success: hexColorSchema,
        info: hexColorSchema
      })
      .strict(),
    error: z
      .object({
        500: hexColorSchema,
        light: hexColorSchema,
        main: hexColorSchema,
        dark: hexColorSchema
      })
      .strict(),
    warning: z
      .object({
        light: hexColorSchema,
        main: hexColorSchema,
        dark: hexColorSchema
      })
      .strict(),
    success: z
      .object({
        light: hexColorSchema,
        main: hexColorSchema,
        dark: hexColorSchema
      })
      .strict(),
    info: z
      .object({
        light: hexColorSchema,
        main: hexColorSchema,
        dark: hexColorSchema
      })
      .strict(),
    neutral: ColorScaleSchema,
    table: z
      .object({
        stripe1: hexColorSchema,
        stripe2: hexColorSchema,
        selection: hexColorSchema
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
    component: z
      .object({
        button: z
          .object({
            paddingX: z
              .object({
                sm: z.string(),
                md: z.string(),
                lg: z.string()
              })
              .strict(),
            paddingY: z
              .object({
                sm: z.string(),
                md: z.string(),
                lg: z.string()
              })
              .strict()
          })
          .strict()
      })
      .strict(),
    mobile: ThemeSpacingMobileSchema
  })
  .strict();

/**
 * Theme Icons Schema
 */
const ThemeIconsSchema = z
  .object({
    sizes: z
      .object({
        sm: z.string(),
        md: z.string(),
        lg: z.string(),
        xl: z.string()
      })
      .strict(),
    button: z
      .object({
        xs: z.string(),
        sm: z.string(),
        md: z.string(),
        lg: z.string()
      })
      .strict()
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
 * Theme Schema
 */
const ThemeSchema = z
  .object({
    colors: ThemeColorsSchema,
    typography: ThemeTypographySchema,
    spacing: ThemeSpacingSchema,
    icons: ThemeIconsSchema,
    breakpoints: ThemeBreakpointsSchema,
    borderRadius: ThemeBorderRadiusSchema,
    shadows: ThemeShadowsSchema,
    responsive: ThemeResponsiveSchema
  })
  .strict();

/**
 * Badge Schema
 */
const BadgeVariantSchema = z
  .object({
    bg: hexColorSchema,
    text: hexColorSchema
  })
  .strict();

const BadgeSchema = z
  .object({
    base: z
      .object({
        padding: z.string(),
        paddingX: z.number(),
        paddingY: z.number(),
        borderRadius: z.string(),
        fontSize: z.string(),
        fontWeight: z.number(),
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
const ButtonVariantSchema = z
  .object({
    bg: z.string(),
    text: hexColorSchema,
    hover: z.string(),
    border: z.string().optional()
  })
  .strict();

const ButtonSizeSchema = z
  .object({
    padding: z.string(),
    paddingX: z.number(),
    paddingY: z.number(),
    fontSize: z.string(),
    icon: z.string(),
    height: z.string()
  })
  .strict();

const ButtonSchema = z
  .object({
    borderRadius: z.string(),
    variants: z
      .object({
        primary: ButtonVariantSchema,
        secondary: ButtonVariantSchema,
        danger: ButtonVariantSchema,
        outline: ButtonVariantSchema,
        ghost: ButtonVariantSchema,
        success: ButtonVariantSchema,
        warning: ButtonVariantSchema,
        transparent: ButtonVariantSchema
      })
      .strict(),
    sizes: z
      .object({
        xs: ButtonSizeSchema,
        sm: ButtonSizeSchema,
        md: ButtonSizeSchema,
        lg: ButtonSizeSchema,
        xl: ButtonSizeSchema
      })
      .strict()
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
        bg: hexColorSchema,
        border: hexColorSchema,
        borderRadius: z.string(),
        padding: z.string(),
        maxWidth: z.string(),
        width: z.string(),
        shadow: z.string()
      })
      .strict(),
    header: z
      .object({
        borderBottom: hexColorSchema,
        padding: z.string(),
        fontSize: z.string(),
        fontWeight: z.string()
      })
      .strict(),
    body: z
      .object({
        padding: z.string(),
        gap: z.string()
      })
      .strict(),
    footer: z
      .object({
        borderTop: hexColorSchema,
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
        bg: hexColorSchema,
        text: hexColorSchema,
        border: hexColorSchema,
        padding: z.string(),
        paddingY: z.number(),
        paddingX: z.number(),
        fontSize: z.string(),
        fontWeight: z.string(),
        textTransform: z.string()
      })
      .strict(),
    horizontal: z
      .object({
        border: hexColorSchema,
        margin: z.string(),
        marginY: z.number(),
        height: z.string(),
        thickness: z.string(),
        color: hexColorSchema
      })
      .strict()
  })
  .strict();

/**
 * Infobox Schema
 */
const InfoboxVariantSchema = z
  .object({
    bg: hexColorSchema,
    border: hexColorSchema,
    icon: z.string(),
    iconColor: hexColorSchema
  })
  .strict();

const InfoboxSchema = z
  .object({
    base: z
      .object({
        padding: z.string(),
        borderRadius: z.string(),
        fontSize: z.string(),
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
        bg: hexColorSchema,
        border: hexColorSchema,
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
    border: hexColorSchema,
    bg: hexColorSchema,
    outline: z.string().optional(),
    text: hexColorSchema.optional()
  })
  .strict();

const InputTypeSchema = z
  .object({
    type: z.string()
  })
  .strict();

const InputSchema = z
  .object({
    base: z
      .object({
        bg: hexColorSchema,
        border: hexColorSchema,
        text: hexColorSchema,
        padding: z.string(),
        paddingX: z.number(),
        paddingY: z.number(),
        borderRadius: z.string(),
        fontSize: z.string(),
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
      .strict(),
    types: z
      .object({
        text: InputTypeSchema,
        number: InputTypeSchema,
        date: InputTypeSchema,
        email: InputTypeSchema,
        currency: InputTypeSchema
      })
      .strict()
  })
  .strict();

/**
 * Table Schema
 */
const TableCellTypeSchema = z
  .object({
    fontFamily: z.string()
  })
  .strict();

const TableSchema = z
  .object({
    wrapper: z
      .object({
        bg: hexColorSchema,
        border: hexColorSchema,
        borderRadius: z.string(),
        shadow: z.string()
      })
      .strict(),
    header: z
      .object({
        bg: hexColorSchema,
        text: hexColorSchema,
        paddingX: z.string(),
        paddingY: z.string(),
        fontSize: z.string(),
        fontWeight: z.string(),
        fontFamily: z.string()
      })
      .strict(),
    cell: z
      .object({
        text: hexColorSchema,
        paddingX: z.string(),
        paddingY: z.string(),
        fontSize: z.string(),
        fontFamily: z.string()
      })
      .strict(),
    row: z
      .object({
        bgOdd: hexColorSchema,
        bgEven: hexColorSchema,
        bgHover: hexColorSchema,
        borderBottom: hexColorSchema
      })
      .strict(),
    cellTypes: z
      .object({
        number: TableCellTypeSchema,
        currency: TableCellTypeSchema,
        date: TableCellTypeSchema,
        input: TableCellTypeSchema
      })
      .strict()
  })
  .strict();

/**
 * Components Schema
 */
const ComponentsSchema = z
  .object({
    pageHeader: z
      .object({
        button: z
          .object({
            className: z.string()
          })
          .strict()
      })
      .strict(),
    badge: BadgeSchema,
    button: ButtonSchema,
    dialog: DialogSchema,
    divider: DividerSchema,
    infobox: InfoboxSchema,
    input: InputSchema,
    table: TableSchema
  })
  .strict();

/**
 * UI Schema
 */
const UISchema = z
  .object({
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
        payment_amount: z.string()
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
        payment: z.string()
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
        delete_debtor: z.string()
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
      .strict()
  })
  .strict();

/**
 * Main Config Schema (STRICT)
 */
export const ConfigSchema = z
  .object({
    app: AppSchema,
    server: ServerSchema,
    client: ClientSchema,
    database: DatabaseSchema,
    auth: AuthSchema,
    navigation: NavigationSchema,
    theme: ThemeSchema,
    components: ComponentsSchema,
    ui: UISchema
  })
  .strict();

/**
 * TypeScript Types
 */
export type AppConfig = z.infer<typeof ConfigSchema>;
export type AppConfigTheme = z.infer<typeof ThemeSchema>;
export type AppConfigComponents = z.infer<typeof ComponentsSchema>;
export type AppConfigUI = z.infer<typeof UISchema>;
