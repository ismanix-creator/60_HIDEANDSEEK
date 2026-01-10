/**
 * @file        config-from-toml.ts
 * @description Generated config from config.toml (do not edit)
 * @version     0.1.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-06 19:14:38 CET
 * @author      Akki Scholze
 */

export const configFromToml = {
  "app": {
    "name": "Material-Tracker",
    "version": "1.2.0",
    "description": "Material-Verwaltung mit Kundeninteraktionen und Schuldentracking"
  },
  "server": {
    "port": 3001,
    "host": "localhost"
  },
  "client": {
    "port": 5173,
    "apiUrl": "http://localhost:3001",
    "ngrokUrl": "https://liana-unrowdy-silva.ngrok-free.dev"
  },
  "database": {
    "type": "sqlite",
    "path": "data/material-tracker.db"
  },
  "auth": {
    "enabled": false,
    "mode": "password_required",
    "admin_bootstrap_user_id": "admin"
  },
  "navigation": {
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
        "key": "glaeubiger",
        "label": "Gläubiger",
        "path": "/glaeubiger",
        "icon": "arrow-down-circle"
      },
      {
        "key": "schuldner",
        "label": "Schuldner",
        "path": "/schuldner",
        "icon": "arrow-up-circle"
      },
      {
        "key": "settings",
        "label": "Einstellungen",
        "path": "/settings",
        "icon": "settings"
      },
      {
        "key": "setup",
        "label": "Setup",
        "path": "/setup",
        "icon": "user-cog"
      },
      {
        "key": "login",
        "label": "Login",
        "path": "/login",
        "icon": "log-in"
      }
    ]
  },
  "theme": {
    "colors": {
      "primary": {
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
      "yellow": {
        "50": "#fffef0",
        "100": "#fffde7",
        "200": "#fffdcf",
        "300": "#fffacd",
        "400": "#ffeb3b",
        "500": "#ffeb3b",
        "600": "#fdd835",
        "700": "#fbc02d",
        "800": "#f9a825",
        "900": "#f57f17"
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
      "purple": {
        "50": "#f3e5f5",
        "100": "#e1bee7",
        "200": "#ce93d8",
        "300": "#ba68c8",
        "400": "#ab47bc",
        "500": "#9c27b0",
        "600": "#8e24aa",
        "700": "#7b1fa2",
        "800": "#6a1b9a",
        "900": "#4a148c"
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
      "brown": {
        "50": "#fbe9e7",
        "100": "#d7ccc8",
        "200": "#bcaaa4",
        "300": "#a1887f",
        "400": "#8d6e63",
        "500": "#795548",
        "600": "#6d4c41",
        "700": "#5d4037",
        "800": "#4e342e",
        "900": "#3e2723"
      },
      "teal": {
        "50": "#e0f2f1",
        "100": "#b2dfdb",
        "200": "#80cbc4",
        "300": "#4db6ac",
        "400": "#26a69a",
        "500": "#009688",
        "600": "#00897b",
        "700": "#00796b",
        "800": "#00695c",
        "900": "#004d40"
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
      "white": {
        "50": "#ffffff",
        "100": "#fafafa",
        "200": "#f5f5f5",
        "300": "#f0f0f0",
        "400": "#eeeeee",
        "500": "#f5f5f5",
        "600": "#f0f0f0",
        "700": "#eeeeee",
        "800": "#e8e8e8",
        "900": "#e0e0e0"
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
        "80": "rgba(0, 0, 0, 0.8)",
        "90": "rgba(0, 0, 0, 0.9)",
        "100": "rgba(0, 0, 0, 1)"
      },
      "text": {
        "primary": "#ffffff",
        "secondary": "#cccccc",
        "tertiary": "#999999"
      },
      "ui": {
        "background": "#1e1e1e",
        "backgroundAlt": "#2d2d2d",
        "backgroundCard": "#252525",
        "border": "#3d3d3d"
      },
      "button": {
        "gray": "#3d3d3d",
        "active": "#454545",
        "customer": "#1f1f1f",
        "offer": "#252525",
        "order": "#303030",
        "invoice": "#383838"
      },
      "status": {
        "error": "#e74c3c",
        "warning": "#f39c12",
        "success": "#27ae60",
        "info": "#3498db"
      },
      "error": {
        "500": "#e74c3c",
        "light": "#e74c3c",
        "main": "#e74c3c",
        "dark": "#c0392b"
      },
      "warning": {
        "light": "#f39c12",
        "main": "#f39c12",
        "dark": "#e67e22"
      },
      "success": {
        "light": "#27ae60",
        "main": "#27ae60",
        "dark": "#229954"
      },
      "info": {
        "light": "#3498db",
        "main": "#3498db",
        "dark": "#2980b9"
      },
      "neutral": {
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
      "table": {
        "stripe1": "#1a1a1a",
        "stripe2": "#2a2a2a",
        "selection": "#353535"
      }
    },
    "typography": {
      "fontFamily": {
        "base": "Segoe UI, system-ui, sans-serif",
        "mono": "JetBrains Mono, monospace"
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
    },
    "spacing": {
      "xxs": "0.125rem",
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "xxl": "3rem",
      "layout": {
        "contentMaxWidthRem": "100rem"
      },
      "component": {
        "button": {
          "paddingX": {
            "sm": "0.5rem",
            "md": "1rem",
            "lg": "1.5rem"
          },
          "paddingY": {
            "sm": "0.25rem",
            "md": "0.5rem",
            "lg": "0.75rem"
          }
        }
      },
      "mobile": {
        "xxs": "0.0625rem",
        "xs": "0.125rem",
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "xxl": "1.5rem"
      }
    },
    "icons": {
      "sizes": {
        "sm": "16px",
        "md": "24px",
        "lg": "32px",
        "xl": "48px"
      },
      "button": {
        "xs": "14px",
        "sm": "16px",
        "md": "18px",
        "lg": "20px"
      }
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      "none": "none"
    },
    "borderRadius": {
      "none": "0",
      "sm": "0.125rem",
      "md": "0.25rem",
      "lg": "0.5rem",
      "xl": "1rem",
      "full": "9999px"
    },
    "breakpoints": {
      "xs": "320px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "xxl": "1536px",
      "mobile": 767,
      "desktop": 1024,
      "devices": {
        "samsungS24": {
          "width": 360,
          "height": 780
        },
        "iPhone15": {
          "width": 393,
          "height": 852
        },
        "surface7": {
          "width": 1368,
          "height": 912
        }
      }
    },
    "responsive": {
      "bottomNavHeight": "60px",
      "bottomNavPadding": "80px",
      "sidebarWidth": "200px",
      "touchMinSize": 44
    }
  },
  "components": {
    "badge": {
      "base": {
        "padding": "0.25rem 0.5rem",
        "paddingX": 2,
        "paddingY": 1,
        "borderRadius": "0.25rem",
        "fontSize": "0.75rem",
        "fontWeight": 500,
        "display": "inline-flex",
        "alignItems": "center",
        "gap": "0.25rem"
      },
      "variants": {
        "success": {
          "bg": "#27ae60",
          "text": "#ffffff"
        },
        "error": {
          "bg": "#e74c3c",
          "text": "#ffffff"
        },
        "warning": {
          "bg": "#f39c12",
          "text": "#1e1e1e"
        },
        "info": {
          "bg": "#3498db",
          "text": "#ffffff"
        },
        "pending": {
          "bg": "#9e9e9e",
          "text": "#ffffff"
        },
        "neutral": {
          "bg": "#424242",
          "text": "#ffffff"
        }
      }
    },
    "button": {
      "borderRadius": "0.25rem",
      "variants": {
        "primary": {
          "bg": "#2196f3",
          "text": "#ffffff",
          "hover": "#1976d2",
          "border": "transparent"
        },
        "secondary": {
          "bg": "#3d3d3d",
          "text": "#ffffff",
          "hover": "#454545",
          "border": "transparent"
        },
        "danger": {
          "bg": "#e74c3c",
          "text": "#ffffff",
          "hover": "#c0392b",
          "border": "transparent"
        },
        "outline": {
          "bg": "transparent",
          "text": "#2196f3",
          "hover": "#1e1e1e",
          "border": "#2196f3"
        },
        "ghost": {
          "bg": "transparent",
          "text": "#2196f3",
          "hover": "#1e1e1e",
          "border": "transparent"
        },
        "success": {
          "bg": "#27ae60",
          "text": "#ffffff",
          "hover": "#229954",
          "border": "transparent"
        },
        "warning": {
          "bg": "#f39c12",
          "text": "#1e1e1e",
          "hover": "#e67e22",
          "border": "transparent"
        },
        "transparent": {
          "bg": "transparent",
          "text": "#ffffff",
          "hover": "#2d2d2d",
          "border": "transparent"
        }
      },
      "sizes": {
        "xs": {
          "padding": "0.25rem 0.5rem",
          "paddingX": 2,
          "paddingY": 1,
          "fontSize": "xs",
          "icon": "14px",
          "height": "1.75rem"
        },
        "sm": {
          "padding": "0.5rem 1rem",
          "paddingX": 4,
          "paddingY": 2,
          "fontSize": "sm",
          "icon": "16px",
          "height": "2rem"
        },
        "md": {
          "padding": "0.75rem 1.5rem",
          "paddingX": 6,
          "paddingY": 3,
          "fontSize": "md",
          "icon": "18px",
          "height": "2.5rem"
        },
        "lg": {
          "padding": "1rem 2rem",
          "paddingX": 8,
          "paddingY": 4,
          "fontSize": "lg",
          "icon": "20px",
          "height": "3rem"
        },
        "xl": {
          "padding": "1.25rem 2.5rem",
          "paddingX": 10,
          "paddingY": 5,
          "fontSize": "xl",
          "icon": "24px",
          "height": "3.5rem"
        }
      }
    },
    "dialog": {
      "overlay": {
        "bg": "rgba(0, 0, 0, 0.75)"
      },
      "container": {
        "bg": "#2d2d2d",
        "border": "#3d3d3d",
        "borderRadius": "0.5rem",
        "padding": "0",
        "maxWidth": "90vw",
        "width": "600px",
        "shadow": "xl"
      },
      "header": {
        "borderBottom": "#3d3d3d",
        "padding": "1.5rem",
        "fontSize": "lg",
        "fontWeight": "semibold"
      },
      "body": {
        "padding": "1.5rem",
        "gap": "1rem"
      },
      "footer": {
        "borderTop": "#3d3d3d",
        "padding": "1rem 1.5rem",
        "marginTop": "0",
        "gap": "0.5rem"
      }
    },
    "divider": {
      "month": {
        "bg": "#252525",
        "text": "#ffffff",
        "border": "#3d3d3d",
        "padding": "0.5rem 1rem",
        "paddingY": 2,
        "paddingX": 4,
        "fontSize": "sm",
        "fontWeight": "semibold",
        "textTransform": "uppercase"
      },
      "horizontal": {
        "border": "#3d3d3d",
        "margin": "1rem 0",
        "marginY": 4,
        "height": "1px",
        "thickness": "1px",
        "color": "#3d3d3d"
      }
    },
    "infobox": {
      "base": {
        "padding": "1rem",
        "borderRadius": "0.5rem",
        "fontSize": "sm",
        "borderWidth": "1px"
      },
      "variants": {
        "info": {
          "bg": "#1e3a5f",
          "border": "#3498db",
          "icon": "info",
          "iconColor": "#3498db"
        },
        "success": {
          "bg": "#1e4620",
          "border": "#27ae60",
          "icon": "check-circle",
          "iconColor": "#27ae60"
        },
        "warning": {
          "bg": "#4a3c1e",
          "border": "#f39c12",
          "icon": "alert-triangle",
          "iconColor": "#f39c12"
        },
        "error": {
          "bg": "#4a1e1e",
          "border": "#e74c3c",
          "icon": "x-circle",
          "iconColor": "#e74c3c"
        }
      },
      "panel": {
        "bg": "#252525",
        "border": "#3d3d3d",
        "borderRadius": "0.5rem",
        "padding": "1rem"
      },
      "formCompact": {
        "containerWidth": "300px",
        "inputWidth": "100px",
        "buttonSize": "md"
      }
    },
    "input": {
      "base": {
        "bg": "#1e1e1e",
        "border": "#3d3d3d",
        "text": "#ffffff",
        "padding": "0.5rem 0.75rem",
        "paddingX": 3,
        "paddingY": 2,
        "borderRadius": "0.25rem",
        "fontSize": "sm",
        "height": "2.5rem",
        "borderWidth": "1px"
      },
      "states": {
        "focus": {
          "border": "#2196f3",
          "bg": "#1e1e1e",
          "outline": "2px solid rgba(33, 150, 243, 0.2)",
          "text": "#ffffff"
        },
        "error": {
          "border": "#e74c3c",
          "bg": "#1e1e1e",
          "outline": "2px solid rgba(231, 76, 60, 0.2)",
          "text": "#ffffff"
        },
        "disabled": {
          "border": "#3d3d3d",
          "bg": "#2d2d2d",
          "text": "#666666",
          "outline": "none"
        },
        "default": {
          "border": "#3d3d3d",
          "bg": "#1e1e1e",
          "text": "#ffffff",
          "outline": "none"
        }
      },
      "types": {
        "text": {
          "type": "text"
        },
        "number": {
          "type": "number"
        },
        "date": {
          "type": "date"
        },
        "email": {
          "type": "email"
        },
        "currency": {
          "type": "text"
        }
      }
    },
    "pageHeader": {
      "button": {
        "className": "page-header-button"
      }
    },
    "table": {
      "rowHeight": "40px",
      "cellPaddingX": "1rem",
      "cellPaddingY": "0.75rem",
      "wrapperBg": "#1e1e1e",
      "wrapperBorder": "#3d3d3d",
      "wrapperBorderRadius": "0.5rem",
      "wrapperShadow": "md",
      "headerBg": "#252525",
      "headerText": "#ffffff",
      "headerFontSize": "sm",
      "headerFontWeight": "semibold",
      "headerFontFamily": "base",
      "cellText": "#ffffff",
      "cellFontSize": "sm",
      "cellFontFamily": "base",
      "rowBgOdd": "#1a1a1a",
      "rowBgEven": "#2a2a2a",
      "rowBgHover": "#353535",
      "rowBorderBottom": "#3d3d3d",
      "wrapper": {
        "bg": "#1e1e1e",
        "border": "#3d3d3d",
        "borderRadius": "0.5rem",
        "shadow": "md"
      },
      "header": {
        "bg": "#252525",
        "text": "#ffffff",
        "paddingX": "1rem",
        "paddingY": "0.75rem",
        "fontSize": "sm",
        "fontWeight": "semibold",
        "fontFamily": "base"
      },
      "cell": {
        "text": "#ffffff",
        "paddingX": "1rem",
        "paddingY": "0.75rem",
        "fontSize": "sm",
        "fontFamily": "base"
      },
      "row": {
        "bgOdd": "#1a1a1a",
        "bgEven": "#2a2a2a",
        "bgHover": "#353535",
        "borderBottom": "#3d3d3d"
      },
      "cellTypes": {
        "number": {
          "fontFamily": "mono"
        },
        "currency": {
          "fontFamily": "mono"
        },
        "date": {
          "fontFamily": "base"
        },
        "input": {
          "fontFamily": "mono"
        }
      },
      "pages": {
        "material": {
          "columns": [
            {
              "key": "datum",
              "label": "Datum",
              "width": "12%",
              "type": "date",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "bezeichnung",
              "label": "Bezeichnung",
              "width": "20%",
              "type": "text",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "menge",
              "label": "Menge",
              "width": "10%",
              "type": "number",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "ek_stueck",
              "label": "EK Stück",
              "width": "12%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "ek_gesamt",
              "label": "EK Gesamt",
              "width": "12%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "vk_stueck",
              "label": "VK Stück",
              "width": "12%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "bestand",
              "label": "Bestand",
              "width": "10%",
              "type": "number",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "einnahmen",
              "label": "Einnahmen",
              "width": "12%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "gewinn_aktuell",
              "label": "Gewinn",
              "width": "12%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "actions",
              "label": "Aktionen",
              "width": "8%",
              "type": "actions",
              "buttons": [
                "bar",
                "kombi",
                "edit",
                "delete"
              ]
            }
          ]
        },
        "kunden": {
          "columns": [
            {
              "key": "name",
              "label": "Kunde",
              "width": "20%",
              "type": "text",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "gesamt",
              "label": "Gesamt",
              "width": "15%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "bezahlt",
              "label": "Bezahlt",
              "width": "15%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "offen",
              "label": "Offener Betrag",
              "width": "15%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "status",
              "label": "Status",
              "width": "15%",
              "type": "status",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "actions",
              "label": "Aktionen",
              "width": "20%",
              "type": "actions",
              "buttons": [
                "edit",
                "delete"
              ]
            }
          ]
        },
        "glaeubiger": {
          "columns": [
            {
              "key": "datum",
              "label": "Datum",
              "width": "12%",
              "type": "date",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "name",
              "label": "Name",
              "width": "20%",
              "type": "text",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "betrag",
              "label": "Betrag",
              "width": "13%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "bezahlt",
              "label": "Bezahlt",
              "width": "13%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "offen",
              "label": "Offen",
              "width": "13%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "faelligkeit",
              "label": "Fälligkeit",
              "width": "12%",
              "type": "date",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "status",
              "label": "Status",
              "width": "10%",
              "type": "status",
              "monospace": false,
              "buttons": []
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
        },
        "schuldner": {
          "columns": [
            {
              "key": "datum",
              "label": "Datum",
              "width": "12%",
              "type": "date",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "name",
              "label": "Name",
              "width": "20%",
              "type": "text",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "betrag",
              "label": "Betrag",
              "width": "13%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "bezahlt",
              "label": "Bezahlt",
              "width": "13%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "offen",
              "label": "Offen",
              "width": "13%",
              "type": "currency",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "faelligkeit",
              "label": "Fälligkeit",
              "width": "12%",
              "type": "date",
              "monospace": false,
              "buttons": []
            },
            {
              "key": "status",
              "label": "Status",
              "width": "10%",
              "type": "status",
              "monospace": false,
              "buttons": []
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
    }
  },
  "ui": {
    "buttons": {
      "save": "Speichern",
      "cancel": "Abbrechen",
      "delete": "Löschen",
      "create": "Erstellen",
      "edit": "Bearbeiten",
      "close": "Schließen",
      "record": "Verbuchen"
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
      "kombi_booking": "Kombi-Buchung",
      "total_price": "Preis Gesamt",
      "total": "Gesamt",
      "price": "Preis",
      "customer": "Kunde"
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
    "page_titles": {
      "material": "Material",
      "customers": "Kunden",
      "creditors": "Gläubiger",
      "debtors": "Schuldner",
      "settings": "Einstellungen"
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
    "messages": {
      "confirm_delete_material": "Möchten Sie das Material \"{name}\" wirklich löschen?",
      "confirm_delete_customer": "Möchten Sie den Kunden \"{name}\" wirklich löschen?",
      "confirm_delete_creditor": "Möchten Sie den Gläubiger \"{name}\" wirklich löschen?",
      "confirm_delete_debtor": "Möchten Sie den Schuldner \"{name}\" wirklich löschen?"
    },
    "validation": {
      "date_required": "Datum erforderlich",
      "designation_required": "Bezeichnung erforderlich",
      "quantity_must_be_positive": "Menge muss größer 0 sein",
      "ek_stueck_must_be_positive": "EK Stück muss größer 0 sein",
      "ek_gesamt_must_be_positive": "EK Gesamt muss größer 0 sein",
      "vk_stueck_must_be_positive": "VK Stück muss größer 0 sein"
    },
    "errors": {
      "create_failed": "Fehler beim Erstellen",
      "update_failed": "Fehler beim Aktualisieren",
      "delete_failed": "Fehler beim Löschen",
      "load_failed": "Fehler beim Laden",
      "booking_failed": "Fehler beim Buchen",
      "network_error": "Netzwerkfehler"
    },
    "empty_states": {
      "no_history": "Keine Historie vorhanden",
      "no_customers": "Keine Kunden vorhanden",
      "no_material_posts": "Keine Material-Posten vorhanden",
      "no_other_posts": "Keine sonstigen Posten vorhanden",
      "no_creditors": "Keine Gläubiger vorhanden",
      "no_debtors": "Keine Schuldner vorhanden"
    },
    "status": {
      "paid": "Bezahlt",
      "partial": "Teilweise",
      "open": "Offen"
    },
    "input_limits": {
      "quantity_min": 0,
      "quantity_step": 1,
      "price_min": 0,
      "price_step": 0.01
    }
  }
} as const;
