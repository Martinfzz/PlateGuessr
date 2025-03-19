export interface GameOptions {
  toggleColors: boolean;
  toggleBorders: boolean;
  toggleLabels: boolean;
  color: string;
  gameMode: string;
  numberOfRounds: number;
}

export interface PlayedCountryInfo {
  countryId: number;
}

export interface PopupInfo {
  longitude: number | null;
  latitude: number | null;
  zoom: number | null;
  countryId: number | null;
  name: string;
  color: string;
}

export interface HoverInfo {
  longitude: number | null;
  latitude: number | null;
  countryId: number | null;
}

export interface Markers {
  user: { longitude: number; latitude: number }[];
  answer: { longitude: number; latitude: number }[];
  color: string;
}

export interface MapState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export enum AuthActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
}

export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
  isVerified: boolean;
  authSource: "self" | "google";
}
