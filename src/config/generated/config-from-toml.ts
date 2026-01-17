/**
 * @file        config-from-toml.ts
 * @description Generated config from config.toml (do not edit)
 * @version     2.5.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-17 09:13:14 CET
 * @author      Akki Scholze
 */

export const configFromToml = {
  "app": {
    "meta": {
      "name": "Material Tracker",
      "version": "0.5.0",
      "lastUpdated": "2026-01-17T04:05:00+01:00"
    },
    "locale": {
      "language": "de-DE",
      "currency": "EUR",
      "timezone": "Europe/Berlin",
      "dateFormat": "dd.MM.yyyy",
      "timeFormat": "HH:mm",
      "decimalSeparator": ",",
      "thousandSeparator": "."
    },
    "database": {
      "name": "material-tracker.db",
      "version": 1
    },
    "server": {
      "host": "127.0.0.1",
      "port": 3001
    }
  },
  "permissions": {
    "roles": {
      "admin": {
        "label": "Administrator (PC)",
        "permissions": [
          "*"
        ]
      },
      "customer": {
        "label": "Kunde (Self-Service)",
        "permissions": [
          "kunden.view"
        ]
      }
    },
    "features": {
      "kunden.view": {
        "roles": [
          "admin",
          "customer"
        ]
      },
      "kunden.create": {
        "roles": [
          "admin"
        ]
      },
      "kunden.edit": {
        "roles": [
          "admin"
        ]
      },
      "kunden.delete": {
        "roles": [
          "admin"
        ]
      },
      "kunden.zahlung": {
        "roles": [
          "admin"
        ]
      },
      "kunden.posten.create": {
        "roles": [
          "admin"
        ]
      },
      "kunden.posten.delete": {
        "roles": [
          "admin"
        ]
      }
    },
    "scopes": {
      "kunden.view": {
        "scope": "self",
        "allowList": false,
        "allowSearch": false,
        "allowExport": false
      }
    }
  },
  "navigation": {
    "items": [
      "dashboard",
      "material",
      "kunden",
      "schuldner",
      "glaeubiger",
      "settings"
    ],
    "item": [
      {
        "key": "dashboard",
        "label": "Dashboard",
        "path": "/",
        "icon": "home"
      },
      {
        "key": "material",
        "label": "Material",
        "path": "/material",
        "icon": "boxes"
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
        "icon": "hand-coins",
        "iconTransform": "scaleX(-1)"
      },
      {
        "key": "settings",
        "label": "Einstellungen",
        "path": "/settings",
        "icon": "settings"
      }
    ]
  },
  "theme": {
    "colors": {
      "black": {
        "50": "#3A3A3A",
        "100": "#333333",
        "200": "#2D2D2D",
        "300": "#272727",
        "400": "#222222",
        "500": "#1E1E1E",
        "600": "#1A1A1A",
        "700": "#151515",
        "800": "#101010",
        "900": "#0B0B0B"
      },
      "white": {
        "50": "#EDEDED",
        "100": "#F0F0F0",
        "200": "#F2F2F2",
        "300": "#F5F5F5",
        "400": "#F7F7F7",
        "500": "#FAFAFA",
        "600": "#FCFCFC",
        "700": "#FDFDFD",
        "800": "#FEFEFE",
        "900": "#FFFFFF"
      },
      "neutral": {
        "700": "#404040",
        "800": "#262626",
        "900": "#171717"
      },
      "blue": {
        "500": "#3B82F6",
        "600": "#2563EB",
        "700": "#1D4ED8"
      },
      "red": {
        "50": "#FDECEC",
        "100": "#FEE2E2",
        "200": "#F9B8B8",
        "300": "#FCA5A5",
        "350": "#F37B7B",
        "400": "#F06A6A",
        "500": "#E74C3C",
        "600": "#D93F30",
        "650": "#D13A2C",
        "700": "#C93427",
        "800": "#B62B20",
        "900": "#7F1D1D"
      },
      "green": {
        "50": "#EAF7EF",
        "100": "#DCFCE7",
        "200": "#AFE2C1",
        "300": "#86EFAC",
        "350": "#66C78E",
        "400": "#4FBF7E",
        "500": "#27AE60",
        "600": "#1FA155",
        "650": "#1C974F",
        "700": "#188C4A",
        "800": "#127640",
        "900": "#14532D"
      },
      "yellow": {
        "50": "#FFF8E1",
        "100": "#FFEFBC",
        "200": "#FFE38A",
        "300": "#FDE047",
        "350": "#FFCA36",
        "400": "#FFC21F",
        "500": "#F1C40F",
        "600": "#DDAF0A",
        "650": "#CFA406",
        "700": "#C09806",
        "800": "#A47F03",
        "900": "#7E6000"
      },
      "orange": {
        "50": "#FFF1E6",
        "100": "#FFE0CC",
        "200": "#FFC6A3",
        "300": "#FFA86E",
        "350": "#FF9C56",
        "400": "#FF8F3D",
        "500": "#F39C12",
        "600": "#E08A06",
        "650": "#D48303",
        "700": "#C97800",
        "800": "#AD6500",
        "900": "#844B00"
      },
      "eisgraublau": {
        "50": "#E9EFF2",
        "100": "#D6E0E6",
        "200": "#B9CBD4",
        "300": "#93AFBC",
        "350": "#86A4B2",
        "400": "#7898A8",
        "500": "#6F8896",
        "600": "#5D7483",
        "650": "#546A78",
        "700": "#4C616E",
        "800": "#3E4F5A",
        "900": "#2F3D45"
      },
      "progress": {
        "0": "#7a7a7a",
        "5": "#7a0000",
        "10": "#7a0000",
        "15": "#7a0000",
        "20": "#821300",
        "25": "#8b2600",
        "30": "#933800",
        "35": "#9b4b00",
        "40": "#a45e00",
        "45": "#ac7100",
        "50": "#b58400",
        "55": "#bd9700",
        "60": "#c5a900",
        "65": "#cebc00",
        "70": "#d6cf00",
        "75": "#b2c403",
        "80": "#8fb805",
        "85": "#6bac08",
        "90": "#47a10b",
        "95": "#24960d",
        "100": "#008a10"
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
      "bg": {
        "main": "eisgraublau.800",
        "navigation": "eisgraublau.650",
        "header": "eisgraublau.650",
        "body": "eisgraublau.800",
        "footer": "eisgraublau.650",
        "dialog": "eisgraublau.800",
        "card": "eisgraublau.800",
        "blackout": "black.700",
        "blackoutSoft": "black.500",
        "transparent": "transparent",
        "overlay": "rgba(0, 0, 0, 0.7)",
        "errorOverlay": "rgba(239, 68, 68, 0.1)",
        "statusBezahlt": "rgba(34, 197, 94, 0.2)",
        "statusTeilbezahlt": "rgba(234, 179, 8, 0.2)",
        "statusOffen": "rgba(239, 68, 68, 0.2)"
      },
      "text": {
        "active": "white.900",
        "inactive": "white.200",
        "entryLight": "black.900",
        "hint": "black.400",
        "error": "red.650",
        "success": "green.650",
        "warning": "yellow.650"
      },
      "table": {
        "headerBg": "eisgraublau.650",
        "headerDivider": "black.500",
        "row": "eisgraublau.800",
        "rowAlt": "eisgraublau.650",
        "rowHover": "black.500",
        "rowSelected": "black.700",
        "rowActive": "black.700",
        "grid": "black.500",
        "divider": "black.500",
        "outerBorder": "black.700"
      },
      "buttons": {
        "rect": {
          "rectActive": "eisgraublau.500",
          "rectSave": "green.650",
          "rectHover": "eisgraublau.650",
          "rectInactive": "black.700"
        },
        "icon": {
          "iconActive": "eisgraublau.500",
          "iconHover": "eisgraublau.650",
          "iconInactive": "black.700"
        },
        "tab": {
          "tabActive": "eisgraublau.500",
          "tabHover": "eisgraublau.650",
          "tabInactive": "black.700"
        }
      },
      "dialog": {
        "entryBorder": "black.500",
        "entryBorderFocus": "eisgraublau.650",
        "entryBorderDisabled": "black.700",
        "entryHover": "eisgraublau.500",
        "entryActive": "eisgraublau.650",
        "entryDisabled": "black.700",
        "entrySelection": "eisgraublau.350",
        "entryCaret": "white.900",
        "entryError": "red.650",
        "entrySuccess": "green.650",
        "entryWarning": "yellow.650"
      },
      "border": {
        "default": "black.500",
        "soft": "black.400",
        "strong": "black.700",
        "focus": "eisgraublau.650",
        "active": "eisgraublau.500",
        "error": "red.650",
        "success": "green.650",
        "warning": "yellow.650"
      },
      "icon": {
        "active": "white.900",
        "inactive": "white.200",
        "book": "green.650",
        "edit": "yellow.650",
        "delete": "red.650"
      },
      "cards": {
        "hover": "black.500"
      }
    },
    "typography": {
      "font": {
        "base": "Inter",
        "mono": "JetBrains Mono"
      },
      "fontWeight": {
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      },
      "fontSize": {
        "headerTitle": "1.75rem",
        "headerSubtitle": "1.25rem",
        "headerMeta": "1rem",
        "footerText": "1rem",
        "footerMeta": "0.875rem",
        "bodyText": "1.25rem",
        "bodyTextSmall": "1rem",
        "bodyHint": "1rem",
        "tableHeader": "1.5rem",
        "tableCell": "1.25rem",
        "tableCellSmall": "1rem",
        "tableCellMeta": "0.875rem",
        "dialogTitle": "1.75rem",
        "dialogSectionTitle": "1.25rem",
        "dialogLabel": "1.25rem",
        "dialogInsert": "1.25rem",
        "dialogHint": "1rem",
        "dialogMessage": "1rem",
        "buttonsRect": "1.25rem",
        "buttonsTab": "1rem",
        "formLabel": "1.25rem",
        "formInsert": "1.25rem",
        "formHint": "1rem",
        "formMessage": "1rem"
      }
    },
    "border": {
      "sizes": {
        "thin": "1px",
        "normal": "2px",
        "thick": "3px"
      },
      "radius": {
        "buttonsRect": "12px",
        "buttonsTab": "10px",
        "navigation": "16px",
        "header": "16px",
        "body": "16px",
        "footer": "16px"
      }
    },
    "spacing": {
      "layout": {
        "pagePadding": "16px",
        "areaGap": "16px",
        "areaPadding": "16px",
        "bodyInnerGap": "12px"
      },
      "table": {
        "headerPaddingX": "12px",
        "headerPaddingY": "12px",
        "cellPaddingX": "12px",
        "cellPaddingY": "10px",
        "actionsGap": "12px"
      },
      "dialog": {
        "padding": "16px",
        "contentGap": "12px",
        "fieldGap": "10px",
        "actionsGap": "12px"
      },
      "buttons": {
        "rectPaddingX": "14px",
        "rectPaddingY": "10px",
        "rectGap": "10px",
        "iconPaddingX": "14px",
        "iconPaddingY": "14px",
        "iconGap": "10px",
        "tabPaddingX": "14px",
        "tabPaddingY": "14px",
        "tabGap": "10px"
      },
      "entry": {
        "paddingX": "12px",
        "paddingY": "10px",
        "labelGap": "6px",
        "hintGap": "6px"
      }
    },
    "shadows": {
      "area": "0 10px 24px rgba(0, 0, 0, 0.25)",
      "card": "0 8px 18px rgba(0, 0, 0, 0.22)",
      "dialog": "0 16px 40px rgba(0, 0, 0, 0.35)",
      "dropdown": "0 12px 24px rgba(0, 0, 0, 0.35)"
    },
    "effects": {
      "backdropBlur": "blur(8px)"
    },
    "breakpoints": {
      "smartphoneMaxWidth": "767px",
      "pcMinWidth": "768px"
    },
    "zIndex": {
      "navigation": 100,
      "header": 100,
      "overlay": 150,
      "dialog": 200,
      "tooltip": 300
    }
  },
  "ui": {
    "labels": {
      "datum": "Datum",
      "name": "Name",
      "bezeichnung": "Bezeichnung",
      "notiz": "Notiz",
      "menge": "Menge",
      "betrag": "Betrag",
      "bezahlt": "Bezahlt",
      "offen": "Offen",
      "gesamt": "Gesamt",
      "fortschritt": "Fortschritt",
      "status": "Status",
      "aktionen": "Aktionen",
      "ekStck": "EK/Stck",
      "ekGesamt": "EK Gesamt",
      "vkStck": "VK/Stck",
      "einnahmen": "Einnahmen",
      "aussenstaende": "Außenstände",
      "theorEinnahmen": "Theor. Einnahmen",
      "gewinn": "Gewinn",
      "bestand": "Bestand"
    },
    "titles": {
      "dashboard": "Dashboard",
      "material": "Material",
      "kunden": "Kunden",
      "kundenView": "Kundendetails",
      "schuldner": "Schuldner",
      "glaeubiger": "Gläubiger",
      "settings": "Einstellungen",
      "dialog": {
        "newMaterial": "Neues Material",
        "editMaterial": "Material bearbeiten",
        "deleteMaterial": "Material löschen",
        "newKunde": "Neuer Kunde",
        "editKunde": "Kunde bearbeiten",
        "deleteKunde": "Kunde löschen",
        "newPostenMat": "Neuer Material-Posten",
        "editPostenMat": "Material-Posten bearbeiten",
        "deletePostenMat": "Material-Posten löschen",
        "newPostenNoMat": "Neuer sonstiger Posten",
        "editPostenNoMat": "Sonstiger Posten bearbeiten",
        "deletePostenNoMat": "Sonstiger Posten löschen",
        "newSchuldner": "Neuer Schuldner",
        "editSchuldner": "Schuldner bearbeiten",
        "deleteSchuldner": "Schuldner löschen",
        "newGlaeubiger": "Neuer Gläubiger",
        "editGlaeubiger": "Gläubiger bearbeiten",
        "deleteGlaeubiger": "Gläubiger löschen",
        "barBuchen": "Bar-Zahlung buchen",
        "rechnungErstellen": "Rechnung erstellen",
        "zahlungBuchen": "Zahlung buchen",
        "historie": "Historie"
      }
    },
    "buttons": {
      "speichern": "Speichern",
      "abbrechen": "Abbrechen",
      "loeschen": "Löschen",
      "neu": "Neu",
      "bearbeiten": "Bearbeiten",
      "schliessen": "Schließen",
      "buchen": "Buchen",
      "erstellen": "Erstellen",
      "zurueck": "Zurück",
      "weiter": "Weiter",
      "ja": "Ja",
      "nein": "Nein",
      "navigation": {
        "style": {
          "base": {
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "transition": "all 0.2s ease",
            "cursor": "pointer",
            "outline": "none",
            "border": "none"
          },
          "inactive": {
            "bg": "transparent"
          }
        }
      },
      "action": {
        "style": {
          "base": {
            "width": "40px",
            "height": "40px",
            "bg": "bg.card",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "transition": "all 0.2s ease",
            "cursor": "pointer",
            "outline": "none",
            "border": "none"
          }
        }
      },
      "act": {
        "style": {
          "base": {
            "width": "32px",
            "height": "32px",
            "bg": "transparent",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "transition": "opacity 0.2s ease",
            "cursor": "pointer",
            "outline": "none",
            "border": "none"
          }
        }
      },
      "rect": {
        "style": {
          "base": {
            "minWidth": "120px",
            "minWidthFull": "100%",
            "height": "44px",
            "display": "inline-flex",
            "alignItems": "center",
            "justifyContent": "center",
            "transition": "all 0.2s ease",
            "cursor": "pointer",
            "cursorDisabled": "not-allowed",
            "opacity": 1,
            "opacityDisabled": 0.5,
            "outline": "none",
            "border": "none"
          }
        }
      },
      "tab": {
        "style": {
          "base": {
            "minWidth": "100px",
            "height": "40px",
            "bg": "transparent",
            "display": "inline-flex",
            "alignItems": "center",
            "justifyContent": "center",
            "transition": "all 0.2s ease",
            "cursor": "pointer",
            "outline": "none",
            "border": "none"
          },
          "inactive": {
            "bg": "transparent"
          }
        }
      }
    },
    "messages": {
      "confirm": {
        "deleteMaterial": "Möchten Sie dieses Material wirklich löschen?",
        "deleteKunde": "Möchten Sie diesen Kunden wirklich löschen?",
        "deletePosten": "Möchten Sie diesen Posten wirklich löschen?",
        "deleteSchuldner": "Möchten Sie diesen Schuldner wirklich löschen?",
        "deleteGlaeubiger": "Möchten Sie diesen Gläubiger wirklich löschen?",
        "deleteHistorie": "Möchten Sie diesen Historie-Eintrag wirklich löschen?"
      },
      "success": {
        "created": "Erfolgreich erstellt",
        "updated": "Erfolgreich aktualisiert",
        "deleted": "Erfolgreich gelöscht",
        "booked": "Erfolgreich gebucht"
      },
      "error": {
        "createFailed": "Fehler beim Erstellen",
        "updateFailed": "Fehler beim Aktualisieren",
        "deleteFailed": "Fehler beim Löschen",
        "bookFailed": "Fehler beim Buchen",
        "loadFailed": "Fehler beim Laden",
        "networkError": "Netzwerkfehler",
        "validationError": "Validierungsfehler"
      },
      "validation": {
        "required": "Pflichtfeld",
        "invalidFormat": "Ungültiges Format",
        "minValue": "Mindestwert unterschritten",
        "maxValue": "Maximalwert überschritten",
        "invalidDate": "Ungültiges Datum",
        "invalidNumber": "Ungültige Zahl"
      }
    },
    "empty": {
      "material": "Keine Materialien vorhanden",
      "kunden": "Keine Kunden vorhanden",
      "postenMat": "Keine Material-Posten vorhanden",
      "postenNoMat": "Keine sonstigen Posten vorhanden",
      "schuldner": "Keine Schuldner vorhanden",
      "glaeubiger": "Keine Gläubiger vorhanden",
      "historie": "Keine Historie-Einträge vorhanden",
      "searchResults": "Keine Ergebnisse gefunden"
    },
    "loading": {
      "default": "Wird geladen...",
      "material": "Materialien werden geladen...",
      "kunden": "Kunden werden geladen...",
      "posten": "Posten werden geladen...",
      "schuldner": "Schuldner werden geladen...",
      "glaeubiger": "Gläubiger werden geladen...",
      "historie": "Historie wird geladen...",
      "saving": "Wird gespeichert...",
      "deleting": "Wird gelöscht..."
    },
    "descriptions": {
      "material": "Verwaltung aller Materialien mit EK/VK-Preisen und Bestandsübersicht",
      "kunden": "Kundenverwaltung mit offenen Posten und Zahlungshistorie",
      "schuldner": "Personen, die mir Geld schulden",
      "glaeubiger": "Personen, denen ich Geld schulde",
      "settings": "App-Einstellungen und Konfiguration"
    },
    "tokens": {
      "size": {
        "touchMin": "44px",
        "iconAction": "40px",
        "iconTableAction": "32px",
        "spinner": "32px"
      },
      "transition": {
        "fast": "all 0.2s ease",
        "opacityFast": "opacity 0.2s ease",
        "colors150": "colors 0.15s"
      },
      "cursor": {
        "default": "pointer",
        "disabled": "not-allowed"
      },
      "radius": {
        "sm": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem"
      }
    },
    "tables": {
      "loading": {
        "container": {
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "paddingY": "2rem"
        },
        "spinner": {
          "size": "32px",
          "borderWidth": "2px",
          "borderColor": "blue.500",
          "borderTopColor": "transparent",
          "borderRadius": "50%",
          "animation": "spin 1s linear infinite"
        }
      },
      "wrapper": {
        "style": {
          "overflowX": "auto",
          "overflowY": "hidden",
          "webkitOverflowScrollingMobile": "touch"
        }
      },
      "table": {
        "style": {
          "width": "100%",
          "minWidthMobile": "800px",
          "borderCollapse": "collapse",
          "tableLayout": "fixed"
        }
      },
      "header": {
        "style": {
          "textAlign": "center",
          "paddingY": "12px",
          "paddingX": "16px",
          "paddingXEdge": "20px"
        }
      },
      "cell": {
        "style": {
          "paddingY": "12px",
          "paddingX": "16px",
          "paddingXEdge": "20px",
          "borderTopWidth": "2px"
        },
        "content": {
          "display": "flex",
          "flexDirection": "column",
          "justifyContent": "center",
          "alignItems": "center",
          "textAlign": "center",
          "width": "100%",
          "height": "100%",
          "gap": "0px"
        }
      }
    },
    "dialogs": {
      "container": {
        "style": {
          "mobile": {
            "position": "fixed",
            "top": "0",
            "left": "0",
            "right": "0",
            "bottom": "0",
            "zIndex": "200",
            "borderRadius": "0",
            "padding": "20px",
            "overflow": "auto",
            "display": "flex",
            "flexDirection": "column"
          },
          "desktop": {
            "position": "relative",
            "zIndex": "200",
            "maxWidth": "800px",
            "width": "90%",
            "maxHeight": "90vh",
            "overflow": "auto"
          }
        }
      },
      "closeButtons": {
        "style": {
          "padding": "8px",
          "borderRadius": "0.375rem",
          "bg": "transparent",
          "border": "none",
          "cursor": "pointer",
          "minWidthMobile": "44px",
          "minHeightMobile": "44px",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center"
        }
      },
      "overlay": {
        "style": {
          "position": "absolute",
          "inset": "0",
          "bg": "overlay",
          "cursor": "pointer"
        }
      },
      "footer": {
        "style": {
          "display": "flex",
          "mobile": {
            "justifyContent": "stretch",
            "flexDirection": "column",
            "marginTop": "auto",
            "paddingTop": "20px"
          },
          "desktop": {
            "justifyContent": "center",
            "flexDirection": "row",
            "marginTop": "16px"
          }
        }
      },
      "header": {
        "style": {
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "space-between"
        }
      },
      "body": {
        "style": {
          "display": "flex",
          "flexDirection": "column",
          "mobile": {
            "flex": "1"
          }
        }
      }
    },
    "entry": {
      "container": {
        "style": {
          "display": "flex",
          "flexDirection": "column",
          "gap": "0.25rem"
        }
      },
      "input": {
        "style": {
          "width": "100%",
          "transition": "colors 0.15s",
          "textAlign": "center",
          "webkitTapHighlightColorMobile": "transparent",
          "minHeightMobile": "44px",
          "fontSizeMobile": "16px",
          "fontSizeDesktop": "0.875rem",
          "paddingX": "16px",
          "paddingY": "12px"
        },
        "focus": {
          "outline": "none",
          "ring": "2px"
        },
        "cursor": {
          "default": "pointer",
          "disabled": "not-allowed"
        }
      },
      "select": {
        "style": {
          "appearance": "none",
          "backgroundImage": "url('data:image/svg+xml,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 20 20\\'%3e%3cpath stroke=\\'%236b7280\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M6 8l4 4 4-4\\'/%3e%3c/svg%3e')",
          "backgroundPosition": "right 0.5rem center",
          "backgroundRepeat": "no-repeat",
          "backgroundSize": "1.5em 1.5em"
        },
        "cursor": {
          "default": "pointer",
          "disabled": "not-allowed"
        }
      },
      "label": {
        "style": {
          "fontSize": "0.875rem",
          "fontWeight": 500,
          "color": "neutral.700"
        }
      },
      "error": {
        "style": {
          "fontSize": "0.75rem",
          "color": "text.error"
        }
      }
    },
    "layout": {
      "pageContainer": {
        "style": {
          "display": "flex",
          "flexDirection": "column",
          "minHeight": "100vh"
        }
      },
      "navigation": {
        "style": {
          "mobile": {
            "position": "fixed",
            "bottom": "0",
            "left": "0",
            "right": "0",
            "zIndex": "100"
          }
        }
      },
      "header": {
        "style": {
          "display": "grid",
          "alignItems": "center"
        }
      },
      "content": {
        "style": {
          "flex": "1",
          "display": "flex",
          "flexDirection": "column",
          "overflow": "hidden"
        }
      }
    },
    "pages": {
      "grid": {
        "style": {
          "display": "grid",
          "gridTemplateColumns": "repeat(3, 1fr)",
          "gap": "1rem"
        },
        "buttonRow": {
          "style": {
            "display": "contents"
          }
        },
        "tableRow": {
          "style": {
            "gridColumn": "1 / -1"
          }
        }
      },
      "buttonsContainer": {
        "style": {
          "display": "flex",
          "justifyContent": "flex-end",
          "marginBottom": "16px"
        }
      },
      "error": {
        "style": {
          "padding": "1rem",
          "bg": "errorOverlay",
          "border": "1px solid",
          "borderColor": "border.error",
          "borderRadius": "0.375rem",
          "color": "text.error"
        }
      },
      "monthNavigation": {
        "style": {
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "gap": "0.75rem"
        }
      },
      "monthPicker": {
        "style": {
          "position": "absolute",
          "left": "50%",
          "zIndex": "10",
          "marginTop": "0.5rem",
          "transform": "translateX(-50%)",
          "minWidth": "14rem",
          "borderRadius": "0.5rem",
          "border": "1px solid",
          "borderColor": "neutral.700",
          "bg": "neutral.900",
          "bgOpacity": 0.9,
          "padding": "0.5rem",
          "boxShadow": "theme.shadows.dropdown",
          "backdropBlur": "theme.effects.backdropBlur"
        }
      },
      "dialogContent": {
        "style": {
          "display": "flex",
          "flexDirection": "column",
          "alignItems": "center",
          "textAlign": "center",
          "gap": "1rem"
        },
        "centered": {
          "style": {
            "width": "100%",
            "maxWidth": "32rem",
            "textAlign": "center"
          }
        }
      },
      "status": {
        "style": {
          "paddingX": "0.5rem",
          "paddingY": "0.25rem",
          "borderRadius": "0.25rem",
          "fontSize": "0.875rem"
        },
        "bezahlt": {
          "bg": "statusBezahlt",
          "color": "green.300"
        },
        "teilbezahlt": {
          "bg": "statusTeilbezahlt",
          "color": "yellow.300"
        },
        "offen": {
          "bg": "statusOffen",
          "color": "red.300"
        }
      },
      "actions": {
        "style": {
          "display": "flex",
          "gap": "0.5rem"
        }
      },
      "detailHeader": {
        "style": {
          "display": "flex",
          "justifyContent": "space-between",
          "alignItems": "center"
        }
      },
      "detailHeaderLeft": {
        "style": {
          "display": "flex",
          "alignItems": "center",
          "gap": "1rem"
        }
      },
      "detailHeaderActions": {
        "style": {
          "display": "flex",
          "gap": "0.5rem"
        }
      },
      "section": {
        "style": {
          "display": "flex",
          "flexDirection": "column",
          "gap": "0.5rem"
        }
      },
      "sectionHeader": {
        "style": {
          "display": "flex",
          "justifyContent": "space-between",
          "alignItems": "center"
        }
      },
      "settings": {
        "loading": {
          "style": {
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "height": "16rem"
          }
        },
        "message": {
          "style": {
            "padding": "1rem",
            "borderRadius": "0.375rem"
          },
          "error": {
            "bg": "red.100",
            "color": "red.900"
          },
          "success": {
            "bg": "green.100",
            "color": "green.900"
          }
        },
        "sections": {
          "style": {
            "display": "flex",
            "flexDirection": "column",
            "gap": "2rem"
          }
        },
        "sectionTitle": {
          "style": {
            "fontSize": "1.25rem",
            "fontWeight": "bold",
            "marginBottom": "1rem"
          }
        },
        "userCard": {
          "style": {
            "border": "1px solid",
            "borderColor": "border.default",
            "borderRadius": "0.375rem",
            "padding": "1rem"
          },
          "pending": {
            "style": {
              "display": "flex",
              "flexDirection": "column",
              "gap": "0.5rem"
            }
          },
          "pendingHeader": {
            "style": {
              "display": "flex",
              "justifyContent": "space-between",
              "alignItems": "flex-start"
            }
          },
          "pendingActions": {
            "style": {
              "display": "flex",
              "gap": "0.5rem",
              "alignItems": "center"
            }
          },
          "active": {
            "style": {
              "display": "flex",
              "justifyContent": "space-between",
              "alignItems": "center"
            }
          },
          "disabled": {
            "style": {
              "opacity": 0.5
            }
          }
        }
      }
    },
    "infobox": {
      "variants": {
        "info": {
          "bg": "bg.card",
          "border": "border.default",
          "iconColor": "text.active"
        },
        "success": {
          "bg": "bg.card",
          "border": "border.default",
          "iconColor": "text.success"
        },
        "warning": {
          "bg": "bg.card",
          "border": "border.default",
          "iconColor": "text.warning"
        },
        "error": {
          "bg": "bg.card",
          "border": "border.default",
          "iconColor": "text.error"
        }
      },
      "container": {
        "style": {
          "display": "flex",
          "gapMobile": "8px",
          "gapDesktop": "12px",
          "borderWidth": "1px",
          "borderStyle": "solid",
          "borderRadius": "12px",
          "paddingMobile": "12px",
          "paddingDesktop": "16px",
          "widthMobile": "100%"
        }
      },
      "icon": {
        "style": {
          "widthMobile": "1rem",
          "widthDesktop": "1.25rem",
          "heightMobile": "1rem",
          "heightDesktop": "1.25rem",
          "flexShrink": "0",
          "marginTop": "4px"
        }
      },
      "title": {
        "style": {
          "marginBottom": "4px"
        }
      },
      "content": {
        "style": {
          "flex": "1"
        }
      }
    },
    "dividers": {
      "month": {
        "style": {
          "padding": "8px 12px",
          "fontWeight": 600,
          "fontSize": "0.875rem",
          "textTransform": "uppercase",
          "textAlign": "center"
        }
      },
      "horizontal": {
        "style": {
          "border": "none",
          "borderTop": "1px solid",
          "borderColor": "border.default",
          "marginTop": "12px",
          "marginBottom": "12px"
        }
      }
    }
  },
  "components": {
    "icon": {
      "home": "home",
      "logout": "log-out",
      "settings": "settings",
      "kunden": "users",
      "material": "boxes",
      "schuldner": "hand-coins",
      "glaeubiger": "hand-coins",
      "plus": "plus",
      "bar": "banknote",
      "rechnung": "layers-plus",
      "billianz": "chart-candlestick",
      "bearbeiten": "pencil",
      "loeschen": "trash-2",
      "zurueckBlaettern": "arrow-left",
      "vorBlaettern": "arrow-right",
      "wartend": "history",
      "in_bearbeitung": "loader-pinwheel",
      "erledigt": "shield-check",
      "bestand_0_aber_aussenstaende": "database-x",
      "nav": {
        "buttonsSize": "48px",
        "iconSize": "36px",
        "radius": "16px"
      },
      "dash": {
        "buttonsSize": "64px",
        "iconSize": "48px",
        "radius": "16px"
      },
      "act": {
        "buttonsSize": "20px",
        "iconSize": "20px",
        "radius": "12px"
      }
    },
    "progressbar": {
      "height": "18px",
      "radius": "12px",
      "padding": "2px",
      "scale": {
        "progressPercent": {
          "themeScalePath": "theme.colors.progress",
          "min": 0,
          "max": 100,
          "step": 5,
          "direction": "normal",
          "showValueInsideBar": true,
          "unit": "%"
        },
        "progressPercent110": {
          "themeScalePath": "theme.colors.progress",
          "min": 0,
          "max": 110,
          "step": 5,
          "direction": "normal",
          "clampColorAtMaxScaleKey": "100",
          "showValueInsideBar": true,
          "unit": "%"
        },
        "stock": {
          "themeScalePath": "theme.colors.progress",
          "direction": "inverted",
          "showValueInsideBar": true,
          "unit": ""
        }
      }
    },
    "entry": {
      "height": "44px",
      "width": "200px",
      "radius": "12px",
      "paddingX": "12px",
      "paddingY": "10px"
    },
    "table": {
      "headerHeight": "52px",
      "rowHeight": "48px",
      "actionsColumnWidth": "80px",
      "columns": {
        "material": {
          "order": [
            "datum",
            "bezeichnung",
            "notiz",
            "ekStck",
            "ekGesamt",
            "vkStck",
            "menge",
            "einnahmen",
            "aussenstaende",
            "theorEinnahmen",
            "gewinn",
            "status",
            "bestand",
            "aktionen"
          ],
          "labels": {
            "datum": "Datum",
            "bezeichnung": "Bezeichnung",
            "notiz": "Notiz",
            "ekStck": "EK/Stck",
            "ekGesamt": "EK Gesamt",
            "vkStck": "VK/Stck",
            "menge": "Menge",
            "einnahmen": "Einnahmen",
            "aussenstaende": "Außenstände",
            "theorEinnahmen": "theor. Einnahmen",
            "gewinn": "Gewinn",
            "status": "Status",
            "bestand": "Bestand",
            "aktionen": "Aktionen"
          }
        },
        "kundenOverview": {
          "order": [
            "name",
            "notiz",
            "summeBetragPostenMat",
            "summeOffenPostenMat",
            "summeBetragPostenNoMat",
            "summeOffenPostenNoMat",
            "status",
            "fortschritt",
            "aktionen"
          ],
          "labels": {
            "name": "Name",
            "notiz": "Notiz",
            "summeBetragPostenMat": "Summe Betrag PostenMat",
            "summeOffenPostenMat": "Summe offen PostenMat",
            "summeBetragPostenNoMat": "Summe Betrag PostenNoMat",
            "summeOffenPostenNoMat": "Summe offen PostenNoMat",
            "status": "Status",
            "fortschritt": "Fortschritt",
            "aktionen": "Aktionen"
          }
        },
        "kundenViewPostenMat": {
          "order": [
            "datum",
            "bezeichnung",
            "notiz",
            "menge",
            "vkStck",
            "gesamt",
            "bezahlt",
            "offen",
            "status",
            "fortschritt",
            "aktionen"
          ],
          "labels": {
            "datum": "Datum",
            "bezeichnung": "Bezeichnung",
            "notiz": "Notiz",
            "menge": "Menge",
            "vkStck": "VK/Stck",
            "gesamt": "Gesamt",
            "bezahlt": "Bezahlt",
            "offen": "Offen",
            "status": "Status",
            "fortschritt": "Fortschritt",
            "aktionen": "Aktionen"
          }
        },
        "kundenViewPostenNoMat": {
          "order": [
            "datum",
            "notiz",
            "gesamt",
            "bezahlt",
            "offen",
            "status",
            "fortschritt",
            "aktionen"
          ],
          "labels": {
            "datum": "Datum",
            "notiz": "Notiz",
            "gesamt": "Gesamt",
            "bezahlt": "Bezahlt",
            "offen": "Offen",
            "status": "Status",
            "fortschritt": "Fortschritt",
            "aktionen": "Aktionen"
          }
        },
        "schuldner": {
          "order": [
            "datum",
            "name",
            "notiz",
            "betrag",
            "bezahlt",
            "offen",
            "status",
            "fortschritt",
            "aktionen"
          ],
          "labels": {
            "datum": "Datum",
            "name": "Name",
            "notiz": "Notiz",
            "betrag": "Betrag",
            "bezahlt": "Bezahlt",
            "offen": "Offen",
            "status": "Status",
            "fortschritt": "Fortschritt",
            "aktionen": "Aktionen"
          }
        },
        "glaeubiger": {
          "order": [
            "datum",
            "name",
            "notiz",
            "betrag",
            "bezahlt",
            "offen",
            "status",
            "fortschritt",
            "aktionen"
          ],
          "labels": {
            "datum": "Datum",
            "name": "Name",
            "notiz": "Notiz",
            "betrag": "Betrag",
            "bezahlt": "Bezahlt",
            "offen": "Offen",
            "status": "Status",
            "fortschritt": "Fortschritt",
            "aktionen": "Aktionen"
          }
        }
      },
      "format": {
        "moneyEur": {
          "type": "money",
          "align": "center",
          "sortable": false,
          "currency": "EUR",
          "minDecimals": 0,
          "maxDecimals": 2,
          "padToMaxIfFraction": true,
          "trimTrailingZeros": true
        },
        "qtyHalf": {
          "type": "quantity",
          "align": "center",
          "sortable": false,
          "rounding": "floorToStep",
          "step": 0.5,
          "minDecimals": 0,
          "maxDecimals": 1,
          "trimTrailingZeros": true
        },
        "date": {
          "type": "date",
          "align": "center",
          "sortable": true
        },
        "text": {
          "type": "text",
          "align": "center",
          "sortable": false
        },
        "status": {
          "type": "status",
          "align": "center",
          "sortable": false
        },
        "actions": {
          "type": "actions",
          "align": "center",
          "sortable": false
        }
      }
    },
    "status": {
      "common": {
        "order": [
          "wartend",
          "in_bearbeitung",
          "erledigt"
        ],
        "rule": {
          "wartend": {
            "when": {
              "started": false
            }
          },
          "in_bearbeitung": {
            "when": {
              "started": true,
              "erledigt": false
            }
          },
          "erledigt": {
            "when": {
              "erledigt": true
            }
          }
        }
      },
      "material": {
        "order": [
          "wartend",
          "in_bearbeitung",
          "bestand_0_aber_aussenstaende",
          "erledigt"
        ],
        "rule": {
          "wartend": {
            "when": {
              "started": false
            }
          },
          "in_bearbeitung": {
            "when": {
              "started": true,
              "bestand_gt": 0
            }
          },
          "bestand_0_aber_aussenstaende": {
            "when": {
              "bestand": 0,
              "aussenstaende_gt": 0
            }
          },
          "erledigt": {
            "when": {
              "bestand": 0,
              "aussenstaende": 0
            }
          }
        }
      }
    },
    "dialog": {
      "version": 1,
      "entryType": {
        "date": {
          "control": "date",
          "format": "components.table.format.date"
        },
        "text": {
          "control": "text",
          "format": "components.table.format.text"
        },
        "note": {
          "control": "textarea",
          "format": "components.table.format.text"
        },
        "moneyEur": {
          "control": "money",
          "format": "components.table.format.moneyEur"
        },
        "qtyHalf": {
          "control": "quantity",
          "format": "components.table.format.qtyHalf"
        },
        "materialSelect": {
          "control": "select",
          "format": "components.table.format.text",
          "optionsSource": "material",
          "optionLabelField": "bezeichnung",
          "optionValueField": "id"
        },
        "kundeSelect": {
          "control": "select",
          "format": "components.table.format.text",
          "optionsSource": "kunde",
          "optionLabelField": "name",
          "optionValueField": "id"
        }
      },
      "grid": {
        "oneColumn": {
          "columns": 1
        },
        "twoColumn": {
          "columns": 2
        },
        "threeColumn": {
          "columns": 3
        }
      },
      "form": {
        "material": {
          "gridPc": "twoColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "datum",
            "bezeichnung",
            "notiz",
            "ek_stck",
            "ek_gesamt",
            "vk_stck",
            "menge"
          ],
          "field": {
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "bezeichnung": {
              "entryType": "text",
              "label": "Bezeichnung",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 2,
              "gridSpanSmartphone": 1
            },
            "ek_stck": {
              "entryType": "moneyEur",
              "label": "EK / Stck",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "ek_gesamt": {
              "entryType": "moneyEur",
              "label": "EK gesamt",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "vk_stck": {
              "entryType": "moneyEur",
              "label": "VK / Stck",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "menge": {
              "entryType": "qtyHalf",
              "label": "Menge",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "kunde": {
          "gridPc": "oneColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "name",
            "notiz"
          ],
          "field": {
            "name": {
              "entryType": "text",
              "label": "Name",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "kundenviewPostenMat": {
          "gridPc": "twoColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "datum",
            "vk_stck",
            "gesamt",
            "menge"
          ],
          "field": {
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "edit"
              ],
              "editableOn": [
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "vk_stck": {
              "entryType": "moneyEur",
              "label": "VK / Stck",
              "visibleOn": [
                "edit"
              ],
              "editableOn": [
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "gesamt": {
              "entryType": "moneyEur",
              "label": "Gesamt",
              "visibleOn": [
                "edit"
              ],
              "editableOn": [
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "menge": {
              "entryType": "qtyHalf",
              "label": "Menge",
              "visibleOn": [
                "edit"
              ],
              "editableOn": [
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "kundenviewPostenNoMat": {
          "gridPc": "oneColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "datum",
            "notiz",
            "gesamt"
          ],
          "field": {
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "gesamt": {
              "entryType": "moneyEur",
              "label": "Gesamt",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "schuldner": {
          "gridPc": "twoColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "datum",
            "name",
            "notiz",
            "betrag"
          ],
          "field": {
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "name": {
              "entryType": "text",
              "label": "Name",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 2,
              "gridSpanSmartphone": 1
            },
            "betrag": {
              "entryType": "moneyEur",
              "label": "Betrag",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "glaeubiger": {
          "gridPc": "twoColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "datum",
            "name",
            "notiz",
            "betrag"
          ],
          "field": {
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "name": {
              "entryType": "text",
              "label": "Name",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 2,
              "gridSpanSmartphone": 1
            },
            "betrag": {
              "entryType": "moneyEur",
              "label": "Betrag",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "historieEdit": {
          "gridPc": "twoColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "bar",
            "menge"
          ],
          "field": {
            "bar": {
              "entryType": "moneyEur",
              "label": "Bar",
              "visibleOn": [
                "edit"
              ],
              "editableOn": [
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "menge": {
              "entryType": "qtyHalf",
              "label": "Menge",
              "visibleOn": [
                "edit"
              ],
              "editableOn": [
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "materialBar": {
          "gridPc": "oneColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "material",
            "datum",
            "bar",
            "notiz"
          ],
          "field": {
            "material": {
              "entryType": "materialSelect",
              "label": "Material",
              "visibleOn": [
                "new"
              ],
              "editableOn": [
                "new"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "new"
              ],
              "editableOn": [
                "new"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "bar": {
              "entryType": "moneyEur",
              "label": "Bar",
              "visibleOn": [
                "new"
              ],
              "editableOn": [
                "new"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new"
              ],
              "editableOn": [
                "new"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            }
          }
        },
        "materialRechnung": {
          "gridPc": "twoColumn",
          "gridSmartphone": "oneColumn",
          "order": [
            "kunde",
            "datum",
            "material",
            "menge",
            "vk_stck",
            "notiz"
          ],
          "field": {
            "kunde": {
              "entryType": "kundeSelect",
              "label": "Kunde",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "datum": {
              "entryType": "date",
              "label": "Datum",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "material": {
              "entryType": "materialSelect",
              "label": "Material",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "menge": {
              "entryType": "qtyHalf",
              "label": "Menge",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "vk_stck": {
              "entryType": "moneyEur",
              "label": "VK / Stck",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 1,
              "gridSpanSmartphone": 1
            },
            "notiz": {
              "entryType": "note",
              "label": "Notiz",
              "visibleOn": [
                "new",
                "edit"
              ],
              "editableOn": [
                "new",
                "edit"
              ],
              "gridSpanPc": 2,
              "gridSpanSmartphone": 1
            }
          }
        }
      }
    }
  }
} as const;
