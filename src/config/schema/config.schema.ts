/**
 * @file        config.schema.ts
 * @description Zod Schema für config.toml Validation (STRICT)
 * @version     1.0.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-07 19:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
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
      .strict()
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
const ThemeBreakpointsSchema = z
  .object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    mobile: z.number(),
    desktop: z.number()
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
    shadows: ThemeShadowsSchema
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
    badge: z.record(z.unknown()),
    button: z.record(z.unknown()),
    dialog: z.record(z.unknown()),
    divider: z.record(z.unknown()),
    infobox: z.record(z.unknown()),
    input: z.record(z.unknown()),
    table: z.record(z.unknown())
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
    components: ComponentsSchema
  })
  .strict();

/**
 * TypeScript Types
 */
export type AppConfig = z.infer<typeof ConfigSchema>;
export type AppConfigTheme = z.infer<typeof ThemeSchema>;
export type AppConfigComponents = z.infer<typeof ComponentsSchema>;
