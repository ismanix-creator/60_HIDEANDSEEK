/**
 * @file        api.types.ts
 * @description API Model Types (Frontend)
 * @version     0.1.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-07 01:36:51 CET
 * @author      frontend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial types für API-Modelle
 */

// Material
export interface Material {
  id: number;
  datum: string;
  bezeichnung: string;
  menge: number;
  ek_stueck: number;
  ek_gesamt: number;
  vk_stueck: number;
  bestand: number;
  einnahmen_bar: number;
  einnahmen_kombi: number;
  gewinn_aktuell: number;
  gewinn_theoretisch: number;
  notiz?: string;
  created_at: string;
  updated_at: string;
}

// Material Bewegungen
export interface MaterialBewegungBar {
  id: number;
  material_id: number;
  datum: string;
  menge: number;
  preis: number;
  info?: string;
  notiz?: string;
  created_at: string;
}

export interface MaterialBewegungKombi {
  id: number;
  material_id: number;
  kunde_id: number;
  datum: string;
  menge: number;
  preis: number;
  notiz?: string;
  created_at: string;
}

export interface MaterialHistorieItem {
  datum: string;
  typ: 'bar' | 'kombi';
  menge: number;
  preis: number;
  kunde_name?: string;
  info?: string;
  notiz?: string;
}

// Kunden
export interface Kunde {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface KundeWithSummary extends Kunde {
  gesamt: number;
  bezahlt: number;
  offen: number;
  status: 'offen' | 'teilbezahlt' | 'bezahlt';
}

// Kunden Posten
export interface KundenPostenMat {
  id: number;
  kunde_id: number;
  material_id: number;
  datum: string;
  menge: number;
  preis: number;
  bezahlt: number;
  offen: number;
  status: 'offen' | 'teilbezahlt' | 'bezahlt';
  notiz?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  material_bezeichnung?: string;
  kunde_name?: string;
}

export interface KundenPostenNoMat {
  id: number;
  kunde_id: number;
  datum: string;
  bezeichnung: string;
  betrag: number;
  bezahlt: number;
  offen: number;
  status: 'offen' | 'teilbezahlt' | 'bezahlt';
  notiz?: string;
  created_at: string;
  updated_at: string;
  // Joined field
  kunde_name?: string;
}

// Gläubiger & Schuldner
export interface Glaeubiger {
  id: number;
  datum: string;
  name: string;
  betrag: number;
  bezahlt: number;
  offen: number;
  faelligkeit?: string;
  status: 'offen' | 'teilbezahlt' | 'bezahlt';
  notiz?: string;
  created_at: string;
  updated_at: string;
}

export interface Schuldner {
  id: number;
  datum: string;
  name: string;
  betrag: number;
  bezahlt: number;
  offen: number;
  faelligkeit?: string;
  status: 'offen' | 'teilbezahlt' | 'bezahlt';
  notiz?: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface CreateMaterialRequest {
  datum: string;
  bezeichnung: string;
  menge: number;
  ek_stueck: number;
  vk_stueck: number;
  notiz?: string;
}

export interface UpdateMaterialRequest extends Partial<CreateMaterialRequest> {
  id: number;
}

export interface CreateBarBewegungRequest {
  material_id: number;
  datum: string;
  menge: number;
  preis: number;
  info?: string;
  notiz?: string;
}

export interface CreateKombiBewegungRequest {
  material_id: number;
  kunde_id: number;
  datum: string;
  menge: number;
  preis: number;
  notiz?: string;
}

export interface CreateKundeRequest {
  name: string;
}

export interface UpdateKundeRequest {
  id: number;
  name: string;
}

export interface CreateKundenPostenMatRequest {
  kunde_id: number;
  material_id: number;
  datum: string;
  menge: number;
  preis: number;
  notiz?: string;
}

export interface UpdateKundenPostenMatRequest extends Partial<
  Omit<CreateKundenPostenMatRequest, 'kunde_id' | 'material_id'>
> {
  id: number;
}

export interface ZahlungRequest {
  betrag: number;
}

export interface CreateKundenPostenNoMatRequest {
  kunde_id: number;
  datum: string;
  bezeichnung: string;
  betrag: number;
  notiz?: string;
}

export interface UpdateKundenPostenNoMatRequest extends Partial<Omit<CreateKundenPostenNoMatRequest, 'kunde_id'>> {
  id: number;
}

export interface CreateGlaeubigerRequest {
  datum: string;
  name: string;
  betrag: number;
  faelligkeit?: string;
  notiz?: string;
}

export interface UpdateGlaeubigerRequest extends Partial<CreateGlaeubigerRequest> {
  id: number;
}

export interface CreateSchuldnerRequest {
  datum: string;
  name: string;
  betrag: number;
  faelligkeit?: string;
  notiz?: string;
}

export interface UpdateSchuldnerRequest extends Partial<CreateSchuldnerRequest> {
  id: number;
}
