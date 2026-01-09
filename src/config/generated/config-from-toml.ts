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
          "hover": "#1976d2"
        },
        "secondary": {
          "bg": "#3d3d3d",
          "text": "#ffffff",
          "hover": "#454545"
        },
        "danger": {
          "bg": "#e74c3c",
          "text": "#ffffff",
          "hover": "#c0392b"
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
          "hover": "#1e1e1e"
        },
        "success": {
          "bg": "#27ae60",
          "text": "#ffffff",
          "hover": "#229954"
        },
        "warning": {
          "bg": "#f39c12",
          "text": "#1e1e1e",
          "hover": "#e67e22"
        },
        "transparent": {
          "bg": "transparent",
          "text": "#ffffff",
          "hover": "#2d2d2d"
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
          "outline": "2px solid rgba(33, 150, 243, 0.2)"
        },
        "error": {
          "border": "#e74c3c",
          "bg": "#1e1e1e",
          "outline": "2px solid rgba(231, 76, 60, 0.2)"
        },
        "disabled": {
          "border": "#3d3d3d",
          "bg": "#2d2d2d",
          "text": "#666666"
        },
        "default": {
          "border": "#3d3d3d",
          "bg": "#1e1e1e"
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
      "payment_amount": "Zahlungsbetrag"
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
      "payment": "Zahlung"
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
      "delete_debtor": "Schuldner löschen"
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
    "input_limits": {
      "quantity_min": 0,
      "quantity_step": 1,
      "price_min": 0,
      "price_step": 0.01
    }
  }
} as const;
