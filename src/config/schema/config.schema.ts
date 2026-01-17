/**
 * @file        config.schema.ts
 * @description Zod schema für config.toml v5.0.0 (100% config-driven UI – .tsx ist Renderer-only)
 * @version     5.0.0
 * @created     2026-01-06 15:35:00 CET
 * @updated     2026-01-15 05:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   5.0.0 - 2026-01-15 - Complete rebuild from config.toml v5.0.0 structure
 *                      - Added theme.effects (backdropBlur)
 *                      - Added theme.shadows.dropdown
 *                      - Added ui.tokens.* (size, transition, cursor, radius)
 *                      - Merged ui.buttons text labels + component styles
 *                      - Added ui.tables component styles
 *                      - Added ui.dialogs component styles
 *                      - Added ui.entry component styles
 *                      - Added ui.layout component styles
 *                      - Added ui.pages component styles (including settings.*)
 *                      - Added ui.infobox component styles
 *                      - Added ui.dividers component styles
 *   4.0.0 - 2026-01-14 - Previous version
 */

import { z } from 'zod';

// ============================================================
// APP
// ============================================================

const AppMetaSchema = z
  .object({
    name: z.string(),
    version: z.string(),
    lastUpdated: z.string()
  })
  .strict();

const AppLocaleSchema = z
  .object({
    language: z.string(),
    currency: z.string(),
    timezone: z.string(),
    dateFormat: z.string(),
    timeFormat: z.string(),
    decimalSeparator: z.string(),
    thousandSeparator: z.string()
  })
  .strict();

const AppDatabaseSchema = z
  .object({
    name: z.string(),
    version: z.number()
  })
  .strict();

const AppServerSchema = z
  .object({
    host: z.string(),
    port: z.number()
  })
  .strict();

const AppSchema = z
  .object({
    meta: AppMetaSchema,
    locale: AppLocaleSchema,
    database: AppDatabaseSchema,
    server: AppServerSchema
  })
  .strict();

// ============================================================
// PERMISSIONS
// ============================================================

const PermissionsRoleSchema = z
  .object({
    label: z.string(),
    permissions: z.array(z.string())
  })
  .strict();

const PermissionsFeatureSchema = z
  .object({
    roles: z.array(z.string())
  })
  .strict();

const PermissionsScopeSchema = z
  .object({
    scope: z.string(),
    allowList: z.boolean(),
    allowSearch: z.boolean(),
    allowExport: z.boolean()
  })
  .strict();

const PermissionsSchema = z
  .object({
    roles: z.record(z.string(), PermissionsRoleSchema),
    features: z.record(z.string(), PermissionsFeatureSchema),
    scopes: z.record(z.string(), PermissionsScopeSchema)
  })
  .strict();

// ============================================================
// NAVIGATION
// ============================================================

const NavigationItemSchema = z
  .object({
    key: z.string(),
    label: z.string(),
    path: z.string(),
    icon: z.string(),
    iconTransform: z.string().optional()
  })
  .strict();

const NavigationSchema = z
  .object({
    items: z.array(z.string()),
    item: z.array(NavigationItemSchema)
  })
  .strict();

// ============================================================
// THEME — COLORS
// ============================================================

const ThemeColorShadeSchema = z.record(z.string(), z.string());

const ThemeColorsBlackSchema = ThemeColorShadeSchema;
const ThemeColorsWhiteSchema = ThemeColorShadeSchema;
const ThemeColorsNeutralSchema = ThemeColorShadeSchema;
const ThemeColorsBlueSchema = ThemeColorShadeSchema;
const ThemeColorsRedSchema = ThemeColorShadeSchema;
const ThemeColorsGreenSchema = ThemeColorShadeSchema;
const ThemeColorsYellowSchema = ThemeColorShadeSchema;
const ThemeColorsOrangeSchema = ThemeColorShadeSchema;
const ThemeColorsEisgraublauSchema = ThemeColorShadeSchema;
const ThemeColorsProgressSchema = ThemeColorShadeSchema;
const ThemeColorsOpacitySchema = ThemeColorShadeSchema;

const ThemeColorsBgSchema = z
  .object({
    main: z.string(),
    navigation: z.string(),
    header: z.string(),
    body: z.string(),
    footer: z.string(),
    dialog: z.string(),
    card: z.string(),
    blackout: z.string(),
    blackoutSoft: z.string(),
    transparent: z.string(),
    overlay: z.string(),
    errorOverlay: z.string(),
    statusBezahlt: z.string(),
    statusTeilbezahlt: z.string(),
    statusOffen: z.string()
  })
  .strict();

const ThemeColorsTextSchema = z
  .object({
    active: z.string(),
    inactive: z.string(),
    entryLight: z.string(),
    hint: z.string(),
    error: z.string(),
    success: z.string(),
    warning: z.string()
  })
  .strict();

const ThemeColorsTableSchema = z
  .object({
    headerBg: z.string(),
    headerDivider: z.string(),
    row: z.string(),
    rowAlt: z.string(),
    rowHover: z.string(),
    rowSelected: z.string(),
    rowActive: z.string(),
    grid: z.string(),
    divider: z.string(),
    outerBorder: z.string()
  })
  .strict();

const ThemeColorsButtonsRectSchema = z
  .object({
    rectActive: z.string(),
    rectSave: z.string(),
    rectHover: z.string(),
    rectInactive: z.string()
  })
  .strict();

const ThemeColorsButtonsIconSchema = z
  .object({
    iconActive: z.string(),
    iconHover: z.string(),
    iconInactive: z.string()
  })
  .strict();

const ThemeColorsButtonsTabSchema = z
  .object({
    tabActive: z.string(),
    tabHover: z.string(),
    tabInactive: z.string()
  })
  .strict();

const ThemeColorsButtonsSchema = z
  .object({
    rect: ThemeColorsButtonsRectSchema,
    icon: ThemeColorsButtonsIconSchema,
    tab: ThemeColorsButtonsTabSchema
  })
  .strict();

const ThemeColorsDialogSchema = z
  .object({
    entryBorder: z.string(),
    entryBorderFocus: z.string(),
    entryBorderDisabled: z.string(),
    entryHover: z.string(),
    entryActive: z.string(),
    entryDisabled: z.string(),
    entrySelection: z.string(),
    entryCaret: z.string(),
    entryError: z.string(),
    entrySuccess: z.string(),
    entryWarning: z.string()
  })
  .strict();

const ThemeColorsBorderSchema = z
  .object({
    default: z.string(),
    soft: z.string(),
    strong: z.string(),
    focus: z.string(),
    active: z.string(),
    error: z.string(),
    success: z.string(),
    warning: z.string()
  })
  .strict();

const ThemeColorsIconSchema = z
  .object({
    active: z.string(),
    inactive: z.string(),
    book: z.string(),
    edit: z.string(),
    delete: z.string()
  })
  .strict();

const ThemeColorsCardsSchema = z
  .object({
    hover: z.string()
  })
  .strict();

const ThemeColorsSchema = z
  .object({
    black: ThemeColorsBlackSchema,
    white: ThemeColorsWhiteSchema,
    neutral: ThemeColorsNeutralSchema,
    blue: ThemeColorsBlueSchema,
    red: ThemeColorsRedSchema,
    green: ThemeColorsGreenSchema,
    yellow: ThemeColorsYellowSchema,
    orange: ThemeColorsOrangeSchema,
    eisgraublau: ThemeColorsEisgraublauSchema,
    progress: ThemeColorsProgressSchema,
    opacity: ThemeColorsOpacitySchema,
    bg: ThemeColorsBgSchema,
    text: ThemeColorsTextSchema,
    table: ThemeColorsTableSchema,
    buttons: ThemeColorsButtonsSchema,
    dialog: ThemeColorsDialogSchema,
    border: ThemeColorsBorderSchema,
    icon: ThemeColorsIconSchema,
    cards: ThemeColorsCardsSchema
  })
  .strict();

// ============================================================
// THEME — TYPOGRAPHY
// ============================================================

const ThemeTypographyFontSchema = z
  .object({
    base: z.string(),
    mono: z.string()
  })
  .strict();

const ThemeTypographyFontWeightSchema = z
  .object({
    normal: z.number(),
    medium: z.number(),
    semibold: z.number(),
    bold: z.number()
  })
  .strict();

const ThemeTypographyFontSizeSchema = z
  .object({
    headerTitle: z.string(),
    headerSubtitle: z.string(),
    headerMeta: z.string(),
    footerText: z.string(),
    footerMeta: z.string(),
    bodyText: z.string(),
    bodyTextSmall: z.string(),
    bodyHint: z.string(),
    tableHeader: z.string(),
    tableCell: z.string(),
    tableCellSmall: z.string(),
    tableCellMeta: z.string(),
    dialogTitle: z.string(),
    dialogSectionTitle: z.string(),
    dialogLabel: z.string(),
    dialogInsert: z.string(),
    dialogHint: z.string(),
    dialogMessage: z.string(),
    buttonsRect: z.string(),
    buttonsTab: z.string(),
    formLabel: z.string(),
    formInsert: z.string(),
    formHint: z.string(),
    formMessage: z.string()
  })
  .strict();

const ThemeTypographySchema = z
  .object({
    font: ThemeTypographyFontSchema,
    fontWeight: ThemeTypographyFontWeightSchema,
    fontSize: ThemeTypographyFontSizeSchema
  })
  .strict();

// ============================================================
// THEME — BORDER / SPACING / SHADOWS / EFFECTS / BREAKPOINTS / Z-INDEX
// ============================================================

const ThemeBorderSizesSchema = z
  .object({
    thin: z.string(),
    normal: z.string(),
    thick: z.string()
  })
  .strict();

const ThemeBorderRadiusSchema = z
  .object({
    buttonsRect: z.string(),
    buttonsTab: z.string(),
    navigation: z.string(),
    header: z.string(),
    body: z.string(),
    footer: z.string()
  })
  .strict();

const ThemeBorderSchema = z
  .object({
    sizes: ThemeBorderSizesSchema,
    radius: ThemeBorderRadiusSchema
  })
  .strict();

const ThemeSpacingLayoutSchema = z
  .object({
    pagePadding: z.string(),
    areaGap: z.string(),
    areaPadding: z.string(),
    bodyInnerGap: z.string()
  })
  .strict();

const ThemeSpacingTableSchema = z
  .object({
    headerPaddingX: z.string(),
    headerPaddingY: z.string(),
    cellPaddingX: z.string(),
    cellPaddingY: z.string(),
    actionsGap: z.string()
  })
  .strict();

const ThemeSpacingDialogSchema = z
  .object({
    padding: z.string(),
    contentGap: z.string(),
    fieldGap: z.string(),
    actionsGap: z.string()
  })
  .strict();

const ThemeSpacingButtonsSchema = z
  .object({
    rectPaddingX: z.string(),
    rectPaddingY: z.string(),
    rectGap: z.string(),
    iconPaddingX: z.string(),
    iconPaddingY: z.string(),
    iconGap: z.string(),
    tabPaddingX: z.string(),
    tabPaddingY: z.string(),
    tabGap: z.string()
  })
  .strict();

const ThemeSpacingEntrySchema = z
  .object({
    paddingX: z.string(),
    paddingY: z.string(),
    labelGap: z.string(),
    hintGap: z.string()
  })
  .strict();

const ThemeSpacingSchema = z
  .object({
    layout: ThemeSpacingLayoutSchema,
    table: ThemeSpacingTableSchema,
    dialog: ThemeSpacingDialogSchema,
    buttons: ThemeSpacingButtonsSchema,
    entry: ThemeSpacingEntrySchema
  })
  .strict();

const ThemeShadowsSchema = z
  .object({
    area: z.string(),
    card: z.string(),
    dialog: z.string(),
    dropdown: z.string()
  })
  .strict();

const ThemeEffectsSchema = z
  .object({
    backdropBlur: z.string()
  })
  .strict();

const ThemeBreakpointsSchema = z
  .object({
    smartphoneMaxWidth: z.string(),
    pcMinWidth: z.string()
  })
  .strict();

const ThemeZIndexSchema = z
  .object({
    navigation: z.number(),
    header: z.number(),
    overlay: z.number(),
    dialog: z.number(),
    tooltip: z.number()
  })
  .strict();

const ThemeSchema = z
  .object({
    colors: ThemeColorsSchema,
    typography: ThemeTypographySchema,
    border: ThemeBorderSchema,
    spacing: ThemeSpacingSchema,
    shadows: ThemeShadowsSchema,
    effects: ThemeEffectsSchema,
    breakpoints: ThemeBreakpointsSchema,
    zIndex: ThemeZIndexSchema
  })
  .strict();

// ============================================================
// UI — CONTENT (Text-only sections)
// ============================================================

const UiLabelsSchema = z.record(z.string(), z.string());

const UiTitlesDialogSchema = z.record(z.string(), z.string());

const UiTitlesSchema = z
  .object({
    dashboard: z.string(),
    material: z.string(),
    kunden: z.string(),
    kundenView: z.string(),
    schuldner: z.string(),
    glaeubiger: z.string(),
    settings: z.string(),
    dialog: UiTitlesDialogSchema
  })
  .strict();

const UiButtonsTextSchema = z
  .object({
    speichern: z.string(),
    abbrechen: z.string(),
    loeschen: z.string(),
    neu: z.string(),
    bearbeiten: z.string(),
    schliessen: z.string(),
    buchen: z.string(),
    erstellen: z.string(),
    zurueck: z.string(),
    weiter: z.string(),
    ja: z.string(),
    nein: z.string()
  })
  .strict();

const UiMessagesConfirmSchema = z.record(z.string(), z.string());
const UiMessagesSuccessSchema = z.record(z.string(), z.string());
const UiMessagesErrorSchema = z.record(z.string(), z.string());
const UiMessagesValidationSchema = z.record(z.string(), z.string());

const UiMessagesSchema = z
  .object({
    confirm: UiMessagesConfirmSchema,
    success: UiMessagesSuccessSchema,
    error: UiMessagesErrorSchema,
    validation: UiMessagesValidationSchema
  })
  .strict();

const UiEmptySchema = z.record(z.string(), z.string());
const UiLoadingSchema = z.record(z.string(), z.string());
const UiDescriptionsSchema = z.record(z.string(), z.string());

// ============================================================
// UI — TOKENS
// ============================================================

const UiTokensSizeSchema = z
  .object({
    touchMin: z.string(),
    iconAction: z.string(),
    iconTableAction: z.string(),
    spinner: z.string()
  })
  .strict();

const UiTokensTransitionSchema = z
  .object({
    fast: z.string(),
    opacityFast: z.string(),
    colors150: z.string()
  })
  .strict();

const UiTokensCursorSchema = z
  .object({
    default: z.string(),
    disabled: z.string()
  })
  .strict();

const UiTokensRadiusSchema = z
  .object({
    sm: z.string(),
    md: z.string(),
    lg: z.string()
  })
  .strict();

const UiTokensSchema = z
  .object({
    size: UiTokensSizeSchema,
    transition: UiTokensTransitionSchema,
    cursor: UiTokensCursorSchema,
    radius: UiTokensRadiusSchema
  })
  .strict();

// ============================================================
// UI — BUTTONS (Component Styles)
// ============================================================

const UiButtonsNavigationStyleBaseSchema = z
  .object({
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    transition: z.string(),
    cursor: z.string(),
    outline: z.string(),
    border: z.string()
  })
  .strict();

const UiButtonsNavigationStyleInactiveSchema = z
  .object({
    bg: z.string()
  })
  .strict();

const UiButtonsNavigationStyleSchema = z
  .object({
    base: UiButtonsNavigationStyleBaseSchema,
    inactive: UiButtonsNavigationStyleInactiveSchema
  })
  .strict();

const UiButtonsNavigationSchema = z
  .object({
    style: UiButtonsNavigationStyleSchema
  })
  .strict();

const UiButtonsActionStyleBaseSchema = z
  .object({
    width: z.string(),
    height: z.string(),
    bg: z.string(),
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    transition: z.string(),
    cursor: z.string(),
    outline: z.string(),
    border: z.string()
  })
  .strict();

const UiButtonsActionStyleSchema = z
  .object({
    base: UiButtonsActionStyleBaseSchema
  })
  .strict();

const UiButtonsActionSchema = z
  .object({
    style: UiButtonsActionStyleSchema
  })
  .strict();

const UiButtonsActStyleBaseSchema = z
  .object({
    width: z.string(),
    height: z.string(),
    bg: z.string(),
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    transition: z.string(),
    cursor: z.string(),
    outline: z.string(),
    border: z.string()
  })
  .strict();

const UiButtonsActStyleSchema = z
  .object({
    base: UiButtonsActStyleBaseSchema
  })
  .strict();

const UiButtonsActSchema = z
  .object({
    style: UiButtonsActStyleSchema
  })
  .strict();

const UiButtonsRectStyleBaseSchema = z
  .object({
    minWidth: z.string(),
    minWidthFull: z.string(),
    height: z.string(),
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    transition: z.string(),
    cursor: z.string(),
    cursorDisabled: z.string(),
    opacity: z.number(),
    opacityDisabled: z.number(),
    outline: z.string(),
    border: z.string()
  })
  .strict();

const UiButtonsRectStyleSchema = z
  .object({
    base: UiButtonsRectStyleBaseSchema
  })
  .strict();

const UiButtonsRectSchema = z
  .object({
    style: UiButtonsRectStyleSchema
  })
  .strict();

const UiButtonsTabStyleBaseSchema = z
  .object({
    minWidth: z.string(),
    height: z.string(),
    bg: z.string(),
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    transition: z.string(),
    cursor: z.string(),
    outline: z.string(),
    border: z.string()
  })
  .strict();

const UiButtonsTabStyleSchema = z
  .object({
    base: UiButtonsTabStyleBaseSchema,
    inactive: z.object({ bg: z.string() }).strict()
  })
  .strict();

const UiButtonsTabSchema = z
  .object({
    style: UiButtonsTabStyleSchema
  })
  .strict();

const UiButtonsComponentSchema = z
  .object({
    navigation: UiButtonsNavigationSchema,
    action: UiButtonsActionSchema,
    act: UiButtonsActSchema,
    rect: UiButtonsRectSchema,
    tab: UiButtonsTabSchema
  })
  .strict();

// ============================================================
// UI — TABLES (Component Styles)
// ============================================================

const UiTablesLoadingContainerSchema = z
  .object({
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    paddingY: z.string()
  })
  .strict();

const UiTablesLoadingSpinnerSchema = z
  .object({
    size: z.string(),
    borderWidth: z.string(),
    borderColor: z.string(),
    borderTopColor: z.string(),
    borderRadius: z.string(),
    animation: z.string()
  })
  .strict();

const UiTablesLoadingSchema = z
  .object({
    container: UiTablesLoadingContainerSchema,
    spinner: UiTablesLoadingSpinnerSchema
  })
  .strict();

const UiTablesWrapperStyleSchema = z
  .object({
    overflowX: z.string(),
    overflowY: z.string(),
    webkitOverflowScrollingMobile: z.string()
  })
  .strict();

const UiTablesWrapperSchema = z
  .object({
    style: UiTablesWrapperStyleSchema
  })
  .strict();

const UiTablesTableStyleSchema = z
  .object({
    width: z.string(),
    minWidthMobile: z.string(),
    borderCollapse: z.string(),
    tableLayout: z.string()
  })
  .strict();

const UiTablesTableSchema = z
  .object({
    style: UiTablesTableStyleSchema
  })
  .strict();

const UiTablesHeaderStyleSchema = z
  .object({
    textAlign: z.string(),
    paddingY: z.string(),
    paddingX: z.string(),
    paddingXEdge: z.string()
  })
  .strict();

const UiTablesHeaderSchema = z
  .object({
    style: UiTablesHeaderStyleSchema
  })
  .strict();

const UiTablesCellContentSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    justifyContent: z.string(),
    alignItems: z.string(),
    textAlign: z.string(),
    width: z.string(),
    height: z.string(),
    gap: z.string()
  })
  .strict();

const UiTablesCellStyleSchema = z
  .object({
    paddingY: z.string(),
    paddingX: z.string(),
    paddingXEdge: z.string(),
    borderTopWidth: z.string()
  })
  .strict();

const UiTablesCellSchema = z
  .object({
    style: UiTablesCellStyleSchema,
    content: UiTablesCellContentSchema
  })
  .strict();

const UiTablesComponentSchema = z
  .object({
    loading: UiTablesLoadingSchema,
    wrapper: UiTablesWrapperSchema,
    table: UiTablesTableSchema,
    header: UiTablesHeaderSchema,
    cell: UiTablesCellSchema
  })
  .strict();

// ============================================================
// UI — DIALOGS (Component Styles)
// ============================================================

const UiDialogsContainerStyleMobileSchema = z
  .object({
    position: z.string(),
    top: z.string(),
    left: z.string(),
    right: z.string(),
    bottom: z.string(),
    zIndex: z.string(),
    borderRadius: z.string(),
    padding: z.string(),
    overflow: z.string(),
    display: z.string(),
    flexDirection: z.string()
  })
  .strict();

const UiDialogsContainerStyleDesktopSchema = z
  .object({
    position: z.string(),
    zIndex: z.string(),
    maxWidth: z.string(),
    width: z.string(),
    maxHeight: z.string(),
    overflow: z.string()
  })
  .strict();

const UiDialogsContainerStyleSchema = z
  .object({
    mobile: UiDialogsContainerStyleMobileSchema,
    desktop: UiDialogsContainerStyleDesktopSchema
  })
  .strict();

const UiDialogsContainerSchema = z
  .object({
    style: UiDialogsContainerStyleSchema
  })
  .strict();

const UiDialogsCloseButtonsStyleSchema = z
  .object({
    padding: z.string(),
    borderRadius: z.string(),
    bg: z.string(),
    border: z.string(),
    cursor: z.string(),
    minWidthMobile: z.string(),
    minHeightMobile: z.string(),
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string()
  })
  .strict();

const UiDialogsCloseButtonsSchema = z
  .object({
    style: UiDialogsCloseButtonsStyleSchema
  })
  .strict();

const UiDialogsOverlayStyleSchema = z
  .object({
    position: z.string(),
    inset: z.string(),
    bg: z.string(),
    cursor: z.string()
  })
  .strict();

const UiDialogsOverlaySchema = z
  .object({
    style: UiDialogsOverlayStyleSchema
  })
  .strict();

const UiDialogsFooterStyleMobileSchema = z
  .object({
    justifyContent: z.string(),
    flexDirection: z.string(),
    marginTop: z.string(),
    paddingTop: z.string()
  })
  .strict();

const UiDialogsFooterStyleDesktopSchema = z
  .object({
    justifyContent: z.string(),
    flexDirection: z.string(),
    marginTop: z.string()
  })
  .strict();

const UiDialogsFooterStyleSchema = z
  .object({
    display: z.string(),
    mobile: UiDialogsFooterStyleMobileSchema,
    desktop: UiDialogsFooterStyleDesktopSchema
  })
  .strict();

const UiDialogsFooterSchema = z
  .object({
    style: UiDialogsFooterStyleSchema
  })
  .strict();

const UiDialogsHeaderStyleSchema = z
  .object({
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string()
  })
  .strict();

const UiDialogsHeaderSchema = z
  .object({
    style: UiDialogsHeaderStyleSchema
  })
  .strict();

const UiDialogsBodyStyleMobileSchema = z
  .object({
    flex: z.string()
  })
  .strict();

const UiDialogsBodyStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    mobile: UiDialogsBodyStyleMobileSchema
  })
  .strict();

const UiDialogsBodySchema = z
  .object({
    style: UiDialogsBodyStyleSchema
  })
  .strict();

const UiDialogsComponentSchema = z
  .object({
    container: UiDialogsContainerSchema,
    closeButtons: UiDialogsCloseButtonsSchema,
    overlay: UiDialogsOverlaySchema,
    footer: UiDialogsFooterSchema,
    header: UiDialogsHeaderSchema,
    body: UiDialogsBodySchema
  })
  .strict();

// ============================================================
// UI — ENTRY (Component Styles)
// ============================================================

const UiEntryContainerStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    gap: z.string()
  })
  .strict();

const UiEntryContainerSchema = z
  .object({
    style: UiEntryContainerStyleSchema
  })
  .strict();

const UiEntryInputFocusSchema = z
  .object({
    outline: z.string(),
    ring: z.string()
  })
  .strict();

const UiEntryInputCursorSchema = z
  .object({
    default: z.string(),
    disabled: z.string()
  })
  .strict();

const UiEntryInputStyleSchema = z
  .object({
    width: z.string(),
    transition: z.string(),
    textAlign: z.string(),
    webkitTapHighlightColorMobile: z.string(),
    minHeightMobile: z.string(),
    fontSizeMobile: z.string(),
    fontSizeDesktop: z.string(),
    paddingX: z.string(),
    paddingY: z.string()
  })
  .strict();

const UiEntryInputSchema = z
  .object({
    style: UiEntryInputStyleSchema,
    focus: UiEntryInputFocusSchema,
    cursor: UiEntryInputCursorSchema
  })
  .strict();

const UiEntrySelectStyleSchema = z
  .object({
    appearance: z.string(),
    backgroundImage: z.string(),
    backgroundPosition: z.string(),
    backgroundRepeat: z.string(),
    backgroundSize: z.string()
  })
  .strict();

const UiEntrySelectCursorSchema = z
  .object({
    default: z.string(),
    disabled: z.string()
  })
  .strict();

const UiEntrySelectSchema = z
  .object({
    style: UiEntrySelectStyleSchema,
    cursor: UiEntrySelectCursorSchema
  })
  .strict();

const UiEntryLabelStyleSchema = z
  .object({
    fontSize: z.string(),
    fontWeight: z.number(),
    color: z.string()
  })
  .strict();

const UiEntryLabelSchema = z
  .object({
    style: UiEntryLabelStyleSchema
  })
  .strict();

const UiEntryErrorStyleSchema = z
  .object({
    fontSize: z.string(),
    color: z.string()
  })
  .strict();

const UiEntryErrorSchema = z
  .object({
    style: UiEntryErrorStyleSchema
  })
  .strict();

const UiEntryComponentSchema = z
  .object({
    container: UiEntryContainerSchema,
    input: UiEntryInputSchema,
    select: UiEntrySelectSchema,
    label: UiEntryLabelSchema,
    error: UiEntryErrorSchema
  })
  .strict();

// ============================================================
// UI — LAYOUT (Component Styles)
// ============================================================

const UiLayoutPageContainerStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    minHeight: z.string()
  })
  .strict();

const UiLayoutPageContainerSchema = z
  .object({
    style: UiLayoutPageContainerStyleSchema
  })
  .strict();

const UiLayoutNavigationStyleMobileSchema = z
  .object({
    position: z.string(),
    bottom: z.string(),
    left: z.string(),
    right: z.string(),
    zIndex: z.string()
  })
  .strict();

const UiLayoutNavigationStyleSchema = z
  .object({
    mobile: UiLayoutNavigationStyleMobileSchema
  })
  .strict();

const UiLayoutNavigationSchema = z
  .object({
    style: UiLayoutNavigationStyleSchema
  })
  .strict();

const UiLayoutHeaderStyleSchema = z
  .object({
    display: z.string(),
    alignItems: z.string()
  })
  .strict();

const UiLayoutHeaderSchema = z
  .object({
    style: UiLayoutHeaderStyleSchema
  })
  .strict();

const UiLayoutContentStyleSchema = z
  .object({
    flex: z.string(),
    display: z.string(),
    flexDirection: z.string(),
    overflow: z.string()
  })
  .strict();

const UiLayoutContentSchema = z
  .object({
    style: UiLayoutContentStyleSchema
  })
  .strict();

const UiLayoutComponentSchema = z
  .object({
    pageContainer: UiLayoutPageContainerSchema,
    navigation: UiLayoutNavigationSchema,
    header: UiLayoutHeaderSchema,
    content: UiLayoutContentSchema
  })
  .strict();

// ============================================================
// UI — PAGES (Component Styles)
// ============================================================

const UiPagesGridStyleSchema = z
  .object({
    display: z.string(),
    gridTemplateColumns: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesGridButtonRowStyleSchema = z
  .object({
    display: z.string()
  })
  .strict();

const UiPagesGridTableRowStyleSchema = z
  .object({
    gridColumn: z.string()
  })
  .strict();

const UiPagesGridSchema = z
  .object({
    style: UiPagesGridStyleSchema,
    buttonRow: z.object({ style: UiPagesGridButtonRowStyleSchema }).strict(),
    tableRow: z.object({ style: UiPagesGridTableRowStyleSchema }).strict()
  })
  .strict();

const UiPagesButtonsContainerStyleSchema = z
  .object({
    display: z.string(),
    justifyContent: z.string(),
    marginBottom: z.string()
  })
  .strict();

const UiPagesButtonsContainerSchema = z
  .object({
    style: UiPagesButtonsContainerStyleSchema
  })
  .strict();

const UiPagesErrorStyleSchema = z
  .object({
    padding: z.string(),
    bg: z.string(),
    border: z.string(),
    borderColor: z.string(),
    borderRadius: z.string(),
    color: z.string()
  })
  .strict();

const UiPagesErrorSchema = z
  .object({
    style: UiPagesErrorStyleSchema
  })
  .strict();

const UiPagesMonthNavigationStyleSchema = z
  .object({
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesMonthNavigationSchema = z
  .object({
    style: UiPagesMonthNavigationStyleSchema
  })
  .strict();

const UiPagesMonthPickerStyleSchema = z
  .object({
    position: z.string(),
    left: z.string(),
    zIndex: z.string(),
    marginTop: z.string(),
    transform: z.string(),
    minWidth: z.string(),
    borderRadius: z.string(),
    border: z.string(),
    borderColor: z.string(),
    bg: z.string(),
    bgOpacity: z.number(),
    padding: z.string(),
    boxShadow: z.string(),
    backdropBlur: z.string()
  })
  .strict();

const UiPagesMonthPickerSchema = z
  .object({
    style: UiPagesMonthPickerStyleSchema
  })
  .strict();

const UiPagesDialogContentStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    alignItems: z.string(),
    textAlign: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesDialogContentCenteredStyleSchema = z
  .object({
    width: z.string(),
    maxWidth: z.string(),
    textAlign: z.string()
  })
  .strict();

const UiPagesDialogContentCenteredSchema = z
  .object({
    style: UiPagesDialogContentCenteredStyleSchema
  })
  .strict();

const UiPagesDialogContentSchema = z
  .object({
    style: UiPagesDialogContentStyleSchema,
    centered: UiPagesDialogContentCenteredSchema
  })
  .strict();

const UiPagesStatusStyleSchema = z
  .object({
    paddingX: z.string(),
    paddingY: z.string(),
    borderRadius: z.string(),
    fontSize: z.string()
  })
  .strict();

const UiPagesStatusBezahltSchema = z
  .object({
    bg: z.string(),
    color: z.string()
  })
  .strict();

const UiPagesStatusTeilbezahltSchema = z
  .object({
    bg: z.string(),
    color: z.string()
  })
  .strict();

const UiPagesStatusOffenSchema = z
  .object({
    bg: z.string(),
    color: z.string()
  })
  .strict();

const UiPagesStatusSchema = z
  .object({
    style: UiPagesStatusStyleSchema,
    bezahlt: UiPagesStatusBezahltSchema,
    teilbezahlt: UiPagesStatusTeilbezahltSchema,
    offen: UiPagesStatusOffenSchema
  })
  .strict();

const UiPagesActionsStyleSchema = z
  .object({
    display: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesActionsSchema = z
  .object({
    style: UiPagesActionsStyleSchema
  })
  .strict();

const UiPagesDetailHeaderStyleSchema = z
  .object({
    display: z.string(),
    justifyContent: z.string(),
    alignItems: z.string()
  })
  .strict();

const UiPagesDetailHeaderSchema = z
  .object({
    style: UiPagesDetailHeaderStyleSchema
  })
  .strict();

const UiPagesDetailHeaderLeftStyleSchema = z
  .object({
    display: z.string(),
    alignItems: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesDetailHeaderLeftSchema = z
  .object({
    style: UiPagesDetailHeaderLeftStyleSchema
  })
  .strict();

const UiPagesDetailHeaderActionsStyleSchema = z
  .object({
    display: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesDetailHeaderActionsSchema = z
  .object({
    style: UiPagesDetailHeaderActionsStyleSchema
  })
  .strict();

const UiPagesSectionStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesSectionSchema = z
  .object({
    style: UiPagesSectionStyleSchema
  })
  .strict();

const UiPagesSectionHeaderStyleSchema = z
  .object({
    display: z.string(),
    justifyContent: z.string(),
    alignItems: z.string()
  })
  .strict();

const UiPagesSectionHeaderSchema = z
  .object({
    style: UiPagesSectionHeaderStyleSchema
  })
  .strict();

const UiPagesSettingsLoadingStyleSchema = z
  .object({
    display: z.string(),
    alignItems: z.string(),
    justifyContent: z.string(),
    height: z.string()
  })
  .strict();

const UiPagesSettingsLoadingSchema = z
  .object({
    style: UiPagesSettingsLoadingStyleSchema
  })
  .strict();

const UiPagesSettingsMessageStyleSchema = z
  .object({
    padding: z.string(),
    borderRadius: z.string()
  })
  .strict();

const UiPagesSettingsMessageErrorSchema = z
  .object({
    bg: z.string(),
    color: z.string()
  })
  .strict();

const UiPagesSettingsMessageSuccessSchema = z
  .object({
    bg: z.string(),
    color: z.string()
  })
  .strict();

const UiPagesSettingsMessageSchema = z
  .object({
    style: UiPagesSettingsMessageStyleSchema,
    error: UiPagesSettingsMessageErrorSchema,
    success: UiPagesSettingsMessageSuccessSchema
  })
  .strict();

const UiPagesSettingsSectionsStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesSettingsSectionsSchema = z
  .object({
    style: UiPagesSettingsSectionsStyleSchema
  })
  .strict();

const UiPagesSettingsSectionTitleStyleSchema = z
  .object({
    fontSize: z.string(),
    fontWeight: z.string(),
    marginBottom: z.string()
  })
  .strict();

const UiPagesSettingsSectionTitleSchema = z
  .object({
    style: UiPagesSettingsSectionTitleStyleSchema
  })
  .strict();

const UiPagesSettingsUserCardStyleSchema = z
  .object({
    border: z.string(),
    borderColor: z.string(),
    borderRadius: z.string(),
    padding: z.string()
  })
  .strict();

const UiPagesSettingsUserCardPendingStyleSchema = z
  .object({
    display: z.string(),
    flexDirection: z.string(),
    gap: z.string()
  })
  .strict();

const UiPagesSettingsUserCardPendingSchema = z
  .object({
    style: UiPagesSettingsUserCardPendingStyleSchema
  })
  .strict();

const UiPagesSettingsUserCardPendingHeaderStyleSchema = z
  .object({
    display: z.string(),
    justifyContent: z.string(),
    alignItems: z.string()
  })
  .strict();

const UiPagesSettingsUserCardPendingHeaderSchema = z
  .object({
    style: UiPagesSettingsUserCardPendingHeaderStyleSchema
  })
  .strict();

const UiPagesSettingsUserCardPendingActionsStyleSchema = z
  .object({
    display: z.string(),
    gap: z.string(),
    alignItems: z.string()
  })
  .strict();

const UiPagesSettingsUserCardPendingActionsSchema = z
  .object({
    style: UiPagesSettingsUserCardPendingActionsStyleSchema
  })
  .strict();

const UiPagesSettingsUserCardActiveStyleSchema = z
  .object({
    display: z.string(),
    justifyContent: z.string(),
    alignItems: z.string()
  })
  .strict();

const UiPagesSettingsUserCardActiveSchema = z
  .object({
    style: UiPagesSettingsUserCardActiveStyleSchema
  })
  .strict();

const UiPagesSettingsUserCardDisabledStyleSchema = z
  .object({
    opacity: z.number()
  })
  .strict();

const UiPagesSettingsUserCardDisabledSchema = z
  .object({
    style: UiPagesSettingsUserCardDisabledStyleSchema
  })
  .strict();

const UiPagesSettingsUserCardSchema = z
  .object({
    style: UiPagesSettingsUserCardStyleSchema,
    pending: UiPagesSettingsUserCardPendingSchema,
    pendingHeader: UiPagesSettingsUserCardPendingHeaderSchema,
    pendingActions: UiPagesSettingsUserCardPendingActionsSchema,
    active: UiPagesSettingsUserCardActiveSchema,
    disabled: UiPagesSettingsUserCardDisabledSchema
  })
  .strict();

const UiPagesSettingsSchema = z
  .object({
    loading: UiPagesSettingsLoadingSchema,
    message: UiPagesSettingsMessageSchema,
    sections: UiPagesSettingsSectionsSchema,
    sectionTitle: UiPagesSettingsSectionTitleSchema,
    userCard: UiPagesSettingsUserCardSchema
  })
  .strict();

const UiPagesComponentSchema = z
  .object({
    grid: UiPagesGridSchema,
    buttonsContainer: UiPagesButtonsContainerSchema,
    error: UiPagesErrorSchema,
    monthNavigation: UiPagesMonthNavigationSchema,
    monthPicker: UiPagesMonthPickerSchema,
    dialogContent: UiPagesDialogContentSchema,
    status: UiPagesStatusSchema,
    actions: UiPagesActionsSchema,
    detailHeader: UiPagesDetailHeaderSchema,
    detailHeaderLeft: UiPagesDetailHeaderLeftSchema,
    detailHeaderActions: UiPagesDetailHeaderActionsSchema,
    section: UiPagesSectionSchema,
    sectionHeader: UiPagesSectionHeaderSchema,
    settings: UiPagesSettingsSchema
  })
  .strict();

// ============================================================
// UI — INFOBOX (Component Styles)
// ============================================================

const UiInfoboxContainerStyleSchema = z
  .object({
    display: z.string(),
    gapMobile: z.string(),
    gapDesktop: z.string(),
    borderWidth: z.string(),
    borderStyle: z.string(),
    borderRadius: z.string(),
    paddingMobile: z.string(),
    paddingDesktop: z.string(),
    widthMobile: z.string()
  })
  .strict();

const UiInfoboxContainerSchema = z
  .object({
    style: UiInfoboxContainerStyleSchema
  })
  .strict();

const UiInfoboxIconStyleSchema = z
  .object({
    widthMobile: z.string(),
    widthDesktop: z.string(),
    heightMobile: z.string(),
    heightDesktop: z.string(),
    flexShrink: z.string(),
    marginTop: z.string()
  })
  .strict();

const UiInfoboxIconSchema = z
  .object({
    style: UiInfoboxIconStyleSchema
  })
  .strict();

const UiInfoboxTitleStyleSchema = z
  .object({
    marginBottom: z.string()
  })
  .strict();

const UiInfoboxTitleSchema = z
  .object({
    style: UiInfoboxTitleStyleSchema
  })
  .strict();

const UiInfoboxContentStyleSchema = z
  .object({
    flex: z.string()
  })
  .strict();

const UiInfoboxContentSchema = z
  .object({
    style: UiInfoboxContentStyleSchema
  })
  .strict();

const UiInfoboxVariantSchema = z
  .object({
    bg: z.string(),
    border: z.string(),
    iconColor: z.string()
  })
  .strict();

const UiInfoboxVariantsSchema = z
  .object({
    info: UiInfoboxVariantSchema,
    success: UiInfoboxVariantSchema,
    warning: UiInfoboxVariantSchema,
    error: UiInfoboxVariantSchema
  })
  .strict();

const UiInfoboxComponentSchema = z
  .object({
    variants: UiInfoboxVariantsSchema,
    container: UiInfoboxContainerSchema,
    icon: UiInfoboxIconSchema,
    title: UiInfoboxTitleSchema,
    content: UiInfoboxContentSchema
  })
  .strict();

// ============================================================
// UI — DIVIDERS (Component Styles)
// ============================================================

const UiDividersMonthStyleSchema = z
  .object({
    padding: z.string(),
    fontWeight: z.number(),
    fontSize: z.string(),
    textTransform: z.string(),
    textAlign: z.string()
  })
  .strict();

const UiDividersMonthSchema = z
  .object({
    style: UiDividersMonthStyleSchema
  })
  .strict();

const UiDividersHorizontalStyleSchema = z
  .object({
    border: z.string(),
    borderTop: z.string(),
    borderColor: z.string(),
    marginTop: z.string(),
    marginBottom: z.string()
  })
  .strict();

const UiDividersHorizontalSchema = z
  .object({
    style: UiDividersHorizontalStyleSchema
  })
  .strict();

const UiDividersComponentSchema = z
  .object({
    month: UiDividersMonthSchema,
    horizontal: UiDividersHorizontalSchema
  })
  .strict();

// ============================================================
// UI SCHEMA (Combining text + component styles)
// Note: ui.buttons combines both text labels AND component styles
// ============================================================

const UiSchema = z
  .object({
    labels: UiLabelsSchema,
    titles: UiTitlesSchema,
    buttons: UiButtonsTextSchema.merge(UiButtonsComponentSchema),
    messages: UiMessagesSchema,
    empty: UiEmptySchema,
    loading: UiLoadingSchema,
    descriptions: UiDescriptionsSchema,
    tokens: UiTokensSchema,
    tables: UiTablesComponentSchema,
    dialogs: UiDialogsComponentSchema,
    entry: UiEntryComponentSchema,
    layout: UiLayoutComponentSchema,
    pages: UiPagesComponentSchema,
    infobox: UiInfoboxComponentSchema,
    dividers: UiDividersComponentSchema
  })
  .strict();

// ============================================================
// COMPONENTS — ICON
// ============================================================

const ComponentsIconNavSchema = z
  .object({
    buttonsSize: z.string(),
    iconSize: z.string(),
    radius: z.string()
  })
  .strict();

const ComponentsIconDashSchema = z
  .object({
    buttonsSize: z.string(),
    iconSize: z.string(),
    radius: z.string()
  })
  .strict();

const ComponentsIconActSchema = z
  .object({
    buttonsSize: z.string(),
    iconSize: z.string(),
    radius: z.string()
  })
  .strict();

const ComponentsIconSchema = z
  .object({
    home: z.string(),
    logout: z.string(),
    settings: z.string(),
    kunden: z.string(),
    material: z.string(),
    schuldner: z.string(),
    glaeubiger: z.string(),
    plus: z.string(),
    bar: z.string(),
    rechnung: z.string(),
    billianz: z.string(),
    bearbeiten: z.string(),
    loeschen: z.string(),
    zurueckBlaettern: z.string(),
    vorBlaettern: z.string(),
    wartend: z.string(),
    in_bearbeitung: z.string(),
    erledigt: z.string(),
    bestand_0_aber_aussenstaende: z.string(),
    nav: ComponentsIconNavSchema,
    dash: ComponentsIconDashSchema,
    act: ComponentsIconActSchema
  })
  .strict();

// ============================================================
// COMPONENTS — PROGRESSBAR
// ============================================================

const ComponentsProgressbarScaleRuleSchema = z
  .object({
    themeScalePath: z.string(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    direction: z.string().optional(),
    clampColorAtMaxScaleKey: z.string().optional(),
    showValueInsideBar: z.boolean().optional(),
    unit: z.string().optional()
  })
  .strict();

const ComponentsProgressbarScaleSchema = z.record(z.string(), ComponentsProgressbarScaleRuleSchema);

const ComponentsProgressbarSchema = z
  .object({
    height: z.string(),
    radius: z.string(),
    padding: z.string(),
    scale: ComponentsProgressbarScaleSchema
  })
  .strict();

// ============================================================
// COMPONENTS — ENTRY
// ============================================================

const ComponentsEntrySchema = z
  .object({
    height: z.string(),
    width: z.string(),
    radius: z.string(),
    paddingX: z.string(),
    paddingY: z.string()
  })
  .strict();

// ============================================================
// COMPONENTS — TABLE
// ============================================================

const ComponentsTableColumnsConfigSchema = z
  .object({
    order: z.array(z.string()),
    labels: z.record(z.string(), z.string())
  })
  .strict();

const ComponentsTableColumnsSchema = z.record(z.string(), ComponentsTableColumnsConfigSchema);

const ComponentsTableFormatSchema = z
  .object({
    type: z.string(),
    align: z.string(),
    sortable: z.boolean(),
    currency: z.string().optional(),
    minDecimals: z.number().optional(),
    maxDecimals: z.number().optional(),
    padToMaxIfFraction: z.boolean().optional(),
    trimTrailingZeros: z.boolean().optional(),
    rounding: z.string().optional(),
    step: z.number().optional()
  })
  .strict();

const ComponentsTableFormatsSchema = z.record(z.string(), ComponentsTableFormatSchema);

const ComponentsTableSchema = z
  .object({
    headerHeight: z.string(),
    rowHeight: z.string(),
    actionsColumnWidth: z.string(),
    columns: ComponentsTableColumnsSchema,
    format: ComponentsTableFormatsSchema
  })
  .strict();

// ============================================================
// COMPONENTS — STATUS
// ============================================================

const ComponentsStatusRuleWhenSchema = z.record(z.string(), z.union([z.boolean(), z.number()]));

const ComponentsStatusRuleSchema = z
  .object({
    when: ComponentsStatusRuleWhenSchema
  })
  .strict();

const ComponentsStatusRulesSchema = z.record(z.string(), ComponentsStatusRuleSchema);

const ComponentsStatusConfigSchema = z
  .object({
    order: z.array(z.string()),
    rule: ComponentsStatusRulesSchema
  })
  .strict();

const ComponentsStatusSchema = z.record(z.string(), ComponentsStatusConfigSchema);

// ============================================================
// COMPONENTS — DIALOG
// ============================================================

const ComponentsDialogEntryTypeSchema = z
  .object({
    control: z.string(),
    format: z.string(),
    optionsSource: z.string().optional(),
    optionLabelField: z.string().optional(),
    optionValueField: z.string().optional()
  })
  .strict();

const ComponentsDialogEntryTypesSchema = z.record(z.string(), ComponentsDialogEntryTypeSchema);

const ComponentsDialogGridConfigSchema = z
  .object({
    columns: z.number()
  })
  .strict();

const ComponentsDialogGridSchema = z.record(z.string(), ComponentsDialogGridConfigSchema);

const ComponentsDialogFormFieldSchema = z
  .object({
    entryType: z.string(),
    label: z.string(),
    visibleOn: z.array(z.string()),
    editableOn: z.array(z.string()),
    gridSpanPc: z.number(),
    gridSpanSmartphone: z.number()
  })
  .strict();

const ComponentsDialogFormFieldsSchema = z.record(z.string(), ComponentsDialogFormFieldSchema);

const ComponentsDialogFormConfigSchema = z
  .object({
    gridPc: z.string(),
    gridSmartphone: z.string(),
    order: z.array(z.string()),
    field: ComponentsDialogFormFieldsSchema
  })
  .strict();

const ComponentsDialogFormSchema = z.record(z.string(), ComponentsDialogFormConfigSchema);

const ComponentsDialogSchema = z
  .object({
    version: z.number(),
    entryType: ComponentsDialogEntryTypesSchema,
    grid: ComponentsDialogGridSchema,
    form: ComponentsDialogFormSchema
  })
  .strict();

// ============================================================
// COMPONENTS SCHEMA
// ============================================================

const ComponentsSchema = z
  .object({
    icon: ComponentsIconSchema,
    progressbar: ComponentsProgressbarSchema,
    entry: ComponentsEntrySchema,
    table: ComponentsTableSchema,
    status: ComponentsStatusSchema,
    dialog: ComponentsDialogSchema
  })
  .strict();

// ============================================================
// CONFIG SCHEMA (Root)
// ============================================================

export const ConfigSchema = z
  .object({
    app: AppSchema,
    permissions: PermissionsSchema,
    navigation: NavigationSchema,
    theme: ThemeSchema,
    ui: UiSchema,
    components: ComponentsSchema
  })
  .strict();

export type AppConfig = z.infer<typeof ConfigSchema>;
