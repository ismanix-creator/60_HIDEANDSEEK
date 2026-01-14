/**
 * @file        config-from-toml.ts
 * @description Generated config from config.toml (do not edit)
 * @version     2.5.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-14 11:26:16 CET
 * @author      Akki Scholze
 */

export const configFromToml = {
  "app": {
    "name": "Material-Tracker",
    "version": "1.2.0",
    "description": "Material-Verwaltung mit Kundeninteraktionen und Schuldentracking"
  },
  "auth": {
    "enabled": false,
    "mode": "password_required",
    "admin_bootstrap_user_id": "admin"
  },
  "theme": {
    "spacing": {
      "tight": "0.125rem",
      "compact": "0.25rem",
      "element_gap": "0.5rem",
      "content_gap": "1rem",
      "container_padding": "1rem",
      "panel_padding": "1.5rem",
      "section_padding": "2rem",
      "page_padding": "3rem",
      "mobile_element_gap": "0.5rem",
      "mobile_container_padding": "1rem",
      "mobile_section_padding": "1.5rem"
    },
    "border": {
      "radius_none": "0",
      "radius_sm": "0.125rem",
      "radius_md": "0.25rem",
      "radius_lg": "0.5rem",
      "radius_xl": "1rem",
      "radius_full": "9999px"
    },
    "colors": {
      "black": {
        "50": "#f8f8f8",
        "100": "#f0f0f0",
        "200": "#e0e0e0",
        "300": "#c0c0c0",
        "400": "#a0a0a0",
        "500": "#808080",
        "600": "#606060",
        "700": "#404040",
        "800": "#202020",
        "900": "#000000"
      },
      "blue": {
        "50": "#e3f2fd",
        "100": "#bbdefb",
        "200": "#90caf9",
        "300": "#64b5f6",
        "400": "#42a5f5",
        "500": "#2196f3",
        "600": "#1e88e5",
        "700": "#1976d2",
        "800": "#1565c0",
        "900": "#0d47a1"
      },
      "bluegray": {
        "50": "#f8fafc",
        "100": "#f1f5f9",
        "200": "#e2e8f0",
        "300": "#cbd5e1",
        "400": "#94a3b8",
        "500": "#64748b",
        "600": "#475569",
        "700": "#334155",
        "800": "#1e293b",
        "900": "#0f172a"
      },
      "green": {
        "50": "#f1f8e9",
        "100": "#dcedc8",
        "200": "#c5e1a5",
        "300": "#aed581",
        "400": "#9ccc65",
        "500": "#8bc34a",
        "600": "#7cb342",
        "700": "#689f38",
        "800": "#558b2f",
        "900": "#33691e"
      },
      "gold": {
        "50": "#fffef0",
        "100": "#fffde7",
        "200": "#fffdcf",
        "300": "#fffacd",
        "400": "#fff59d",
        "500": "#ffd54f",
        "600": "#ffca28",
        "700": "#ffc107",
        "800": "#ffb300",
        "900": "#ff8f00"
      },
      "orange": {
        "50": "#fff3e0",
        "100": "#ffe0b2",
        "200": "#ffcc80",
        "300": "#ffb74d",
        "400": "#ffa726",
        "500": "#ff9800",
        "600": "#fb8c00",
        "700": "#f57c00",
        "800": "#e65100",
        "900": "#d84315"
      },
      "red": {
        "50": "#ffebee",
        "100": "#ffcdd2",
        "200": "#ef9a9a",
        "300": "#e57373",
        "400": "#ef5350",
        "500": "#f44336",
        "600": "#e53935",
        "700": "#d32f2f",
        "800": "#c62828",
        "900": "#b71c1c"
      },
      "graublau": {
        "50": "#fafafa",
        "100": "#f4f5f6",
        "200": "#e4e6e7",
        "300": "#d2d4d7",
        "400": "#a0a3a7",
        "500": "#707378",
        "600": "#505357",
        "700": "#3d4044",
        "800": "#24272a",
        "900": "#15171b"
      },
      "gray": {
        "50": "#fafafa",
        "100": "#f5f5f5",
        "200": "#eeeeee",
        "300": "#e0e0e0",
        "400": "#bdbdbd",
        "500": "#9e9e9e",
        "600": "#757575",
        "700": "#616161",
        "800": "#424242",
        "900": "#212121"
      },
      "opacity": {
        "0": "rgba(0, 0, 0, 0)",
        "10": "rgba(0, 0, 0, 0.1)",
        "20": "rgba(0, 0, 0, 0.2)",
        "30": "rgba(0, 0, 0, 0.3)",
        "40": "rgba(0, 0, 0, 0.4)",
        "50": "rgba(0, 0, 0, 0.5)",
        "60": "rgba(0, 0, 0, 0.6)",
        "70": "rgba(0, 0, 0, 0.7)",
        "75": "rgba(0, 0, 0, 0.75)",
        "80": "rgba(0, 0, 0, 0.8)",
        "90": "rgba(0, 0, 0, 0.9)",
        "100": "rgba(0, 0, 0, 1)"
      },
      "ui": {
        "background": "{black.800}",
        "backgroundAlt": "{graublau.900}",
        "backgroundCard": "{gray.900}",
        "border": "{gray.700}"
      },
      "text": {
        "primary": "{gray.50}",
        "secondary": "{gray.400}",
        "tertiary": "{gray.500}"
      },
      "button": {
        "gray": "{gray.700}",
        "active": "{gray.600}"
      },
      "info": {
        "light": "{blue.400}",
        "main": "{blue.500}",
        "dark": "{blue.700}"
      },
      "success": {
        "light": "{green.500}",
        "main": "{green.600}",
        "dark": "{green.800}"
      },
      "error": {
        "light": "{red.400}",
        "main": "{red.500}",
        "dark": "{red.700}"
      },
      "status": {
        "error": "{red.500}",
        "warning": "{gold.700}",
        "success": "{green.600}",
        "info": "{blue.500}"
      },
      "warning": {
        "light": "{gold.600}",
        "main": "{gold.700}",
        "dark": "{orange.700}"
      }
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      "none": "none"
    },
    "sizes": {
      "touchMinSizePx": 44,
      "sidebarWidthPx": 200
    },
    "typography": {
      "fontFamily": {
        "base": "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        "mono": "Inter Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace"
      },
      "fontSize": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "md": "1rem",
        "lg": "1.25rem",
        "xl": "1.5rem"
      },
      "fontWeight": {
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      }
    }
  },
  "components": {
    "table": {
      "base": {
        "wrapperBg": "{black.800}",
        "wrapperBorder": "{gray.700}",
        "wrapperBorderRadius": "0.5rem",
        "wrapperShadow": "md",
        "headerBg": "{gray.900}",
        "headerText": "{gray.50}",
        "headerFontSize": "13px",
        "headerFontWeight": 500,
        "headerFontMono": true,
        "rowHeightPx": 50,
        "rowBgOdd": "{black.900}",
        "rowBgEven": "{gray.800}",
        "rowBgHover": "{gray.700}",
        "rowBorderBottom": "{gray.700}",
        "cellPaddingX": "1rem",
        "cellPaddingY": "0.75rem",
        "cellText": "{gray.50}",
        "cellFontSize": "12px",
        "cellFontWeight": 400,
        "cellFontMono": true,
        "behavior": {
          "minRows": 0,
          "emptyRowPlaceholder": ""
        },
        "progress": {
          "height": "12px",
          "radius": "0.5rem",
          "trackBg": "{gray.800}",
          "trackBorder": "{gray.700}",
          "textColor": "{gray.50}",
          "gradientStops": [
            {
              "p": 0,
              "c": "{gray.600}"
            },
            {
              "p": 5,
              "c": "{red.700}"
            },
            {
              "p": 20,
              "c": "{red.500}"
            },
            {
              "p": 40,
              "c": "{orange.500}"
            },
            {
              "p": 60,
              "c": "{gold.700}"
            },
            {
              "p": 75,
              "c": "{gold.600}"
            },
            {
              "p": 85,
              "c": "{gold.400}"
            },
            {
              "p": 90,
              "c": "{green.700}"
            },
            {
              "p": 95,
              "c": "{green.600}"
            },
            {
              "p": 100,
              "c": "{green.400}"
            }
          ]
        },
        "bestand": {
          "invertProgressStops": true,
          "textColor": "{gray.50}"
        }
      }
    },
    "dialog": {
      "base": {
        "overlay": {
          "bg": "{opacity.75}"
        },
        "container": {
          "bg": "{gray.700}",
          "border": "{gray.600}",
          "borderRadius": "0.5rem",
          "padding": "0",
          "maxWidth": "90vw",
          "width": "600px",
          "height": "80vh",
          "maxHeight": "80vh",
          "shadow": "xl"
        },
        "header": {
          "borderBottom": "{gray.600}",
          "padding": "1.5rem",
          "fontSize": "20px",
          "fontWeight": 600
        },
        "body": {
          "padding": "1.5rem",
          "gap": "1rem",
          "fontSize": "14px",
          "fontWeight": 400
        },
        "footer": {
          "borderTop": "{gray.600}",
          "padding": "1rem 1.5rem",
          "marginTop": "0",
          "gap": "0.5rem"
        }
      }
    },
    "button": {
      "borderRadius": "0.25rem",
      "nav": {
        "bg": "transparent",
        "icon": "{gray.50}",
        "border": "transparent",
        "hoverBg": "{black.800}",
        "activeBg": "{black.900}",
        "disabledBg": "transparent",
        "disabledIcon": "{gray.600}",
        "focusRing": "{blue.500}",
        "focusRingOpacity": "{opacity.40}",
        "iconSize": "48px"
      },
      "new": {
        "bg": "transparent",
        "icon": "{gray.50}",
        "border": "transparent",
        "hoverBg": "{black.800}",
        "activeBg": "{black.900}",
        "disabledBg": "transparent",
        "disabledIcon": "{gray.600}",
        "focusRing": "{green.500}",
        "focusRingOpacity": "{opacity.40}",
        "iconSize": "32px"
      },
      "act": {
        "bg": "transparent",
        "icon": "{gray.50}",
        "border": "transparent",
        "hoverBg": "{black.800}",
        "activeBg": "{black.900}",
        "disabledBg": "transparent",
        "disabledIcon": "{gray.600}",
        "focusRing": "{blue.500}",
        "focusRingOpacity": "{opacity.40}",
        "iconSize": "20px"
      },
      "tab": {
        "bg": "transparent",
        "icon": "{gray.50}",
        "border": "transparent",
        "hoverBg": "{black.800}",
        "activeBg": "{black.900}",
        "disabledBg": "transparent",
        "disabledIcon": "{gray.600}",
        "focusRing": "{blue.500}",
        "focusRingOpacity": "{opacity.40}",
        "iconSize": "20px"
      },
      "rect": {
        "bg": "{black.700}",
        "text": "{gray.50}",
        "border": "transparent",
        "hoverBg": "{black.800}",
        "activeBg": "{black.900}",
        "disabledBg": "{black.800}",
        "disabledText": "{gray.500}",
        "saveBg": "{green.600}",
        "saveText": "{gray.50}",
        "saveHoverBg": "{green.700}",
        "saveActiveBg": "{green.800}",
        "focusRing": "{blue.500}",
        "focusRingOpacity": "{opacity.40}",
        "padding": "0.75rem 1.5rem",
        "fontSize": "16px",
        "fontWeight": 500,
        "height": "2.5rem",
        "iconSize": "20px"
      },
      "back": {
        "bg": "transparent",
        "icon": "{gray.50}",
        "border": "transparent",
        "hoverBg": "{black.800}",
        "activeBg": "{black.900}",
        "disabledBg": "transparent",
        "disabledIcon": "{gray.600}",
        "focusRing": "{blue.500}",
        "focusRingOpacity": "{opacity.40}",
        "iconSize": "32px"
      }
    },
    "badge": {
      "base": {
        "paddingX": 2,
        "paddingY": 1,
        "borderRadius": "0.25rem",
        "fontSize": "12px",
        "fontWeight": 500,
        "display": "inline-flex",
        "alignItems": "center",
        "gap": "0.25rem"
      },
      "variants": {
        "success": {
          "bg": "{green.600}",
          "text": "{gray.50}"
        },
        "error": {
          "bg": "{red.500}",
          "text": "{gray.50}"
        },
        "warning": {
          "bg": "{gold.700}",
          "text": "{black.800}"
        },
        "info": {
          "bg": "{blue.500}",
          "text": "{gray.50}"
        },
        "pending": {
          "bg": "{gray.500}",
          "text": "{gray.50}"
        },
        "neutral": {
          "bg": "{gray.800}",
          "text": "{gray.50}"
        }
      }
    },
    "form": {
      "input": {
        "base": {
          "bg": "{black.900}",
          "border": "{gray.700}",
          "text": "{gray.50}",
          "padding": "0.5rem 0.75rem",
          "paddingX": 3,
          "paddingY": 2,
          "borderRadius": "0.25rem",
          "fontSize": "14px",
          "fontWeight": 400,
          "height": "2.5rem",
          "borderWidth": "1px"
        },
        "states": {
          "default": {
            "border": "{gray.700}",
            "bg": "{black.900}",
            "text": "{gray.50}",
            "outline": "none"
          },
          "focus": {
            "border": "{blue.500}",
            "bg": "{black.900}",
            "outline": "2px solid {blue.500}",
            "text": "{gray.50}"
          },
          "error": {
            "border": "{red.500}",
            "bg": "{black.900}",
            "outline": "2px solid {red.500}",
            "text": "{gray.50}"
          },
          "disabled": {
            "border": "{gray.700}",
            "bg": "{gray.800}",
            "text": "{gray.600}",
            "outline": "none"
          }
        }
      }
    },
    "divider": {
      "month": {
        "bg": "{black.800}",
        "text": "{gray.50}",
        "border": "{gray.700}",
        "padding": "0.5rem 1rem",
        "paddingY": 2,
        "paddingX": 4,
        "fontSize": "14px",
        "fontWeight": 600,
        "textTransform": "uppercase"
      },
      "horizontal": {
        "border": "{gray.700}",
        "margin": "1rem 0",
        "marginY": 4,
        "height": "1px",
        "thickness": "1px",
        "color": "{gray.700}"
      }
    },
    "infobox": {
      "base": {
        "padding": "1rem",
        "borderRadius": "0.5rem",
        "fontSize": "14px",
        "fontWeight": 400,
        "borderWidth": "1px"
      },
      "panel": {
        "bg": "{black.800}",
        "border": "{gray.700}",
        "borderRadius": "0.5rem",
        "padding": "1rem"
      },
      "variants": {
        "info": {
          "bg": "{blue.800}",
          "border": "{blue.500}",
          "icon": "info",
          "iconColor": "{blue.500}"
        },
        "success": {
          "bg": "{green.800}",
          "border": "{green.600}",
          "icon": "check-circle",
          "iconColor": "{green.600}"
        },
        "warning": {
          "bg": "{orange.800}",
          "border": "{gold.700}",
          "icon": "alert-triangle",
          "iconColor": "{gold.700}"
        },
        "error": {
          "bg": "{red.800}",
          "border": "{red.500}",
          "icon": "x-circle",
          "iconColor": "{red.500}"
        }
      },
      "formCompact": {
        "containerWidth": "300px",
        "inputWidth": "100px",
        "buttonSize": "md"
      }
    }
  },
  "pages": {
    "material": {
      "table": {
        "columns": [
          {
            "key": "datum",
            "label": "Datum",
            "width": "8%",
            "type": "date"
          },
          {
            "key": "bezeichnung",
            "label": "Bezeichnung",
            "width": "12%",
            "type": "text"
          },
          {
            "key": "notiz",
            "label": "Notiz",
            "width": "10%",
            "type": "text"
          },
          {
            "key": "ek_stueck",
            "label": "EK/Stück",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "ek_gesamt",
            "label": "EK Gesamt",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "vk_stueck",
            "label": "VK/Stück",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "menge",
            "label": "Menge",
            "width": "6%",
            "type": "number",
            "monospace": false
          },
          {
            "key": "bestand",
            "label": "Bestand",
            "width": "6%",
            "type": "progress",
            "monospace": false
          },
          {
            "key": "einnahmen",
            "label": "Einnahmen",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "aussenstaende",
            "label": "Aussenstände",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "theor_einnahmen",
            "label": "Theor. Einnahmen",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "gewinn",
            "label": "Gewinn",
            "width": "7%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "status",
            "label": "Status",
            "width": "6%",
            "type": "status"
          },
          {
            "key": "actions",
            "label": "Aktionen",
            "width": "7%",
            "type": "actions",
            "buttons": [
              "bar",
              "kombi",
              "edit",
              "delete"
            ]
          }
        ]
      }
    },
    "kunden": {
      "overview": {
        "table": {
          "columns": [
            {
              "key": "name",
              "label": "Name",
              "width": "25%",
              "type": "text"
            },
            {
              "key": "anzahl_posten",
              "label": "Anzahl offene Posten",
              "width": "15%",
              "type": "number",
              "monospace": false
            },
            {
              "key": "summe_offen",
              "label": "Summe Betrag offener Posten",
              "width": "20%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "fortschritt",
              "label": "Fortschritt",
              "width": "15%",
              "type": "progress"
            },
            {
              "key": "status",
              "label": "Status",
              "width": "15%",
              "type": "status"
            },
            {
              "key": "actions",
              "label": "Aktionen",
              "width": "10%",
              "type": "actions",
              "buttons": [
                "view",
                "edit",
                "delete"
              ]
            }
          ]
        }
      },
      "mat": {
        "table": {
          "columns": [
            {
              "key": "datum",
              "label": "Datum",
              "width": "10%",
              "type": "date"
            },
            {
              "key": "material",
              "label": "Material",
              "width": "15%",
              "type": "text"
            },
            {
              "key": "menge",
              "label": "Menge",
              "width": "8%",
              "type": "number",
              "monospace": false
            },
            {
              "key": "vk_stueck",
              "label": "VK/Stück",
              "width": "10%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "gesamt",
              "label": "Gesamt",
              "width": "10%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "bezahlt",
              "label": "Bezahlt",
              "width": "10%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "offen",
              "label": "Offen",
              "width": "10%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "fortschritt",
              "label": "Fortschritt",
              "width": "12%",
              "type": "progress"
            },
            {
              "key": "zahlungen",
              "label": "Zahlungen",
              "width": "8%",
              "type": "button",
              "buttons": [
                "payment_history"
              ]
            },
            {
              "key": "actions",
              "label": "Aktionen",
              "width": "7%",
              "type": "actions",
              "buttons": [
                "edit",
                "delete"
              ]
            }
          ]
        }
      },
      "nomat": {
        "table": {
          "columns": [
            {
              "key": "datum",
              "label": "Datum",
              "width": "12%",
              "type": "date"
            },
            {
              "key": "notiz",
              "label": "Notiz",
              "width": "25%",
              "type": "text"
            },
            {
              "key": "gesamt",
              "label": "Gesamt",
              "width": "12%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "bezahlt",
              "label": "Bezahlt",
              "width": "12%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "offen",
              "label": "Offen",
              "width": "12%",
              "type": "currency",
              "monospace": false
            },
            {
              "key": "fortschritt",
              "label": "Fortschritt",
              "width": "12%",
              "type": "progress"
            },
            {
              "key": "zahlungen",
              "label": "Zahlungen",
              "width": "8%",
              "type": "button",
              "buttons": [
                "payment_history"
              ]
            },
            {
              "key": "actions",
              "label": "Aktionen",
              "width": "7%",
              "type": "actions",
              "buttons": [
                "edit",
                "delete"
              ]
            }
          ]
        }
      }
    },
    "schuldner": {
      "table": {
        "columns": [
          {
            "key": "datum",
            "label": "Datum",
            "width": "10%",
            "type": "date"
          },
          {
            "key": "name",
            "label": "Wer?!",
            "width": "20%",
            "type": "text"
          },
          {
            "key": "notiz",
            "label": "Notiz",
            "width": "15%",
            "type": "text"
          },
          {
            "key": "gesamt",
            "label": "Gesamt",
            "width": "13%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "offen",
            "label": "Offen",
            "width": "13%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "fortschritt",
            "label": "Fortschritt",
            "width": "12%",
            "type": "progress"
          },
          {
            "key": "actions",
            "label": "Aktionen",
            "width": "12%",
            "type": "actions",
            "buttons": [
              "edit",
              "delete",
              "payment"
            ]
          }
        ]
      }
    },
    "glaeubiger": {
      "table": {
        "columns": [
          {
            "key": "datum",
            "label": "Datum",
            "width": "10%",
            "type": "date"
          },
          {
            "key": "name",
            "label": "Wer?!",
            "width": "20%",
            "type": "text"
          },
          {
            "key": "notiz",
            "label": "Notiz",
            "width": "15%",
            "type": "text"
          },
          {
            "key": "gesamt",
            "label": "Gesamt",
            "width": "13%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "offen",
            "label": "Offen",
            "width": "13%",
            "type": "currency",
            "monospace": false
          },
          {
            "key": "fortschritt",
            "label": "Fortschritt",
            "width": "12%",
            "type": "progress"
          },
          {
            "key": "actions",
            "label": "Aktionen",
            "width": "12%",
            "type": "actions",
            "buttons": [
              "edit",
              "delete",
              "payment"
            ]
          }
        ]
      }
    },
    "settings": {},
    "dashboard": {
      "card": {
        "width": "240px",
        "height": "240px",
        "gap": "1.5rem",
        "iconSize": "160px",
        "padding": "1rem",
        "hoverTransform": "translateY(-4px)",
        "marginTop": "0.5rem"
      },
      "icon": {
        "positionRelative": "relative",
        "positionAbsolute": "absolute",
        "bottom": "-4px",
        "right": "-8px",
        "width": "12px",
        "height": "12px",
        "strokeWidth": 3
      }
    },
    "titles": {
      "dashboard": "Dashboard",
      "material": "Material",
      "customers": "Kunden",
      "creditors": "Gläubiger",
      "debtors": "Schuldner",
      "settings": "Einstellungen"
    }
  },
  "content": {
    "buttons": {
      "save": "Speichern",
      "cancel": "Abbrechen",
      "delete": "Löschen",
      "create": "Erstellen",
      "edit": "Bearbeiten",
      "close": "Schließen",
      "record": "Verbuchen",
      "go_to_setup": "Zur Setup-Seite"
    },
    "dialog_titles": {
      "new_material": "Neues Material",
      "edit_material": "Material bearbeiten",
      "delete_material": "Material löschen",
      "bar_transaction": "BAR-Bewegung",
      "kombi_transaction": "KOMBI-Bewegung",
      "new_customer": "Neuer Kunde",
      "edit_customer": "Kunde bearbeiten",
      "delete_customer": "Kunde löschen",
      "new_material_post": "Neuer Material-Posten",
      "new_other_post": "Neuer sonstiger Posten",
      "record_payment": "Zahlung verbuchen",
      "new_creditor": "Neuer Gläubiger",
      "edit_creditor": "Gläubiger bearbeiten",
      "delete_creditor": "Gläubiger löschen",
      "new_debtor": "Neuer Schuldner",
      "edit_debtor": "Schuldner bearbeiten",
      "delete_debtor": "Schuldner löschen",
      "history": "Historie"
    },
    "labels": {
      "date": "Datum",
      "name": "Name",
      "designation": "Bezeichnung",
      "quantity": "Menge",
      "amount": "Betrag",
      "amount_paid": "Bezahlt",
      "payment_amount": "Zahlungsbetrag",
      "material": "Material",
      "note": "Notiz (optional)",
      "price_per_unit": "VK Stück (Mindest-VK)",
      "purchase_price": "EK Stück",
      "purchase_price_total": "EK Gesamt",
      "selling_price_unit": "VK Stück",
      "info": "Info (optional)",
      "due_date": "Fälligkeit (optional)",
      "open_amount": "Offener Betrag",
      "status": "Status",
      "actions": "Aktionen",
      "stock": "Bestand",
      "revenue": "Einnahmen",
      "profit": "Gewinn",
      "available": "Verfügbar",
      "bar_sale": "Bar-Verkauf",
      "kombi_booking": "KOMBI-Buchung",
      "total_price": "Preis Gesamt",
      "total": "Gesamt",
      "price": "Preis",
      "customer": "Kunde",
      "price_per_unit_short": "Preis/Stück",
      "price_total_short": "Preis Gesamt",
      "price_per_piece": "Preis pro Stück",
      "loading": "Laden...",
      "pending_users": "Pending Users",
      "active_users": "Aktive Users",
      "disabled_users": "Deaktivierte Users",
      "administrator": "Administrator",
      "not_available": "N/A",
      "admin_setup": "Admin Setup",
      "material_posts": "Material-Posten",
      "other_posts": "Sonstige Posten"
    },
    "descriptions": {
      "admin_setup_access": "Zugang zur initialen System-Konfiguration",
      "no_pending_users": "Keine pending users",
      "no_active_users": "Keine aktiven users",
      "bootstrap_description": "First-run admin setup. Only available if admin account is in bootstrap status.",
      "signup_description": "Register as a customer. Your account will be pending until admin approves.",
      "auth_required": "Login erforderlich",
      "auth_disabled_dev": "Auth deaktiviert (dev mode)"
    },
    "messages": {
      "confirm_delete_material": "Möchten Sie das Material \"{name}\" wirklich löschen?",
      "confirm_delete_customer": "Möchten Sie den Kunden \"{name}\" wirklich löschen?",
      "confirm_delete_creditor": "Möchten Sie den Gläubiger \"{name}\" wirklich löschen?",
      "confirm_delete_debtor": "Möchten Sie den Schuldner \"{name}\" wirklich löschen?",
      "bootstrap_success": "Admin bootstrap successful! You can now login.",
      "login_failed": "Login failed",
      "logging_in": "Logging in...",
      "login": "Login"
    },
    "input_limits": {
      "quantity_min": 0,
      "quantity_step": 1,
      "price_min": 0,
      "price_step": 0.01
    },
    "empty_states": {
      "no_history": "Keine Historie vorhanden",
      "no_customers": "Keine Kunden vorhanden",
      "no_material_posts": "Keine Material-Posten vorhanden",
      "no_other_posts": "Keine sonstigen Posten vorhanden",
      "no_creditors": "Keine Gläubiger vorhanden",
      "no_debtors": "Keine Schuldner vorhanden"
    },
    "errors": {
      "create_failed": "Fehler beim Erstellen",
      "update_failed": "Fehler beim Aktualisieren",
      "delete_failed": "Fehler beim Löschen",
      "load_failed": "Fehler beim Laden",
      "booking_failed": "Fehler beim Buchen",
      "network_error": "Netzwerkfehler"
    },
    "status": {
      "paid": "Bezahlt",
      "partial": "Teilweise",
      "open": "Offen"
    },
    "tooltips": {
      "bar_transaction": "BAR",
      "kombi_transaction": "KOMBI",
      "edit": "Bearbeiten",
      "delete": "Löschen",
      "new_material": "Neues Material",
      "new_customer": "Neuer Kunde",
      "new_creditor": "Neuer Gläubiger",
      "new_debtor": "Neuer Schuldner",
      "payment": "Zahlung",
      "create": "Erstellen",
      "record": "Verbuchen"
    },
    "validation": {
      "date_required": "Datum erforderlich",
      "designation_required": "Bezeichnung erforderlich",
      "quantity_must_be_positive": "Menge muss größer 0 sein",
      "ek_stueck_must_be_positive": "EK Stück muss größer 0 sein",
      "ek_gesamt_must_be_positive": "EK Gesamt muss größer 0 sein",
      "vk_stueck_must_be_positive": "VK Stück muss größer 0 sein"
    }
  },
  "navigation": {
    "zIndex": 1000,
    "borderWidth": "1px",
    "transition": "background-color 0.15s ease, transform 0.15s ease",
    "hoverScale": "1.05",
    "normalScale": "1",
    "fontSize": "14px",
    "fontWeight": 500,
    "icon": {
      "rotateGlaeubiger": "rotate(180deg) scaleX(-1)"
    },
    "items": [
      {
        "key": "material",
        "label": "Material",
        "path": "/material",
        "icon": "package"
      },
      {
        "key": "kunden",
        "label": "Kunden",
        "path": "/kunden",
        "icon": "users"
      },
      {
        "key": "schuldner",
        "label": "Schuldner",
        "path": "/schuldner",
        "icon": "hand-coins"
      },
      {
        "key": "glaeubiger",
        "label": "Gläubiger",
        "path": "/glaeubiger",
        "icon": "hand-coins"
      },
      {
        "key": "settings",
        "label": "Einstellungen",
        "path": "/settings",
        "icon": "settings"
      },
      {
        "key": "logout",
        "label": "Logout",
        "path": "/logout",
        "icon": "log-out"
      }
    ]
  },
  "layout": {
    "navigation": {
      "bg": "{ui.backgroundAlt}",
      "border": "{ui.border}",
      "height": "auto"
    },
    "header": {
      "bg": "{ui.backgroundAlt}",
      "border": "{ui.border}",
      "borderWidth": "1px",
      "padding": "1rem",
      "gap": "1rem",
      "fontSize": "2rem",
      "fontWeight": 700
    },
    "content": {
      "bg": "{ui.background}",
      "border": "transparent",
      "borderWidth": "0"
    },
    "footer": {
      "bg": "{ui.backgroundAlt}",
      "border": "{ui.border}",
      "borderWidth": "1px",
      "borderRadius": "0.5rem",
      "height": "auto",
      "padding": "1rem",
      "gap": "0.75rem",
      "gridColumns": 3
    },
    "rules": {
      "mobileBreakpointPx": 767,
      "desktopBreakpointPx": 1024,
      "sidebarCollapseBelowPx": 767,
      "tableHorizontalScrollBelowPx": 767,
      "contentMaxWidthPx": 1600,
      "bottomNavHeightPx": 60,
      "bottomNavPadding": "80px",
      "touchMinSizePx": 48
    }
  }
} as const;
