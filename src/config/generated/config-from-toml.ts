/**
 * @file        config-from-toml.ts
 * @description Generated config from config.toml (do not edit)
 * @version     0.1.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-06 19:14:38 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial generation
 */

export const configFromToml = {
  "app": {
    "name": "Material-Tracker",
    "version": "0.0.0",
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
    "breakpoints": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
      "mobile": 767,
      "desktop": 1024
    },
    "borderRadius": {
      "none": "0",
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "1rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      "none": "none"
    }
  },
  "components": {
    "pageHeader": {
      "button": {
        "className": "page-header-button"
      }
    },
    "table": {},
    "badge": {},
    "button": {},
    "dialog": {},
    "divider": {},
    "infobox": {},
    "input": {}
  }
} as const;
