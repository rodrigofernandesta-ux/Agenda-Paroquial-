export enum LiturgicalColor {
  ROXO = 'Roxo',
  BRANCO = 'Branco',
  VERDE = 'Verde',
}

export interface RepertoireItem {
  name: string;
  key: string;
}

export interface Repertoire {
  entrada: RepertoireItem;
  atoPenitencial: RepertoireItem;
  gloria: RepertoireItem;
  salmo: RepertoireItem;
  aclamacao: RepertoireItem;
  ofertorio: RepertoireItem;
  santo: RepertoireItem;
  comunhao: RepertoireItem;
  final: RepertoireItem;
}

export interface MassEvent {
  id: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  cor: LiturgicalColor;
  local: string;
  equipe: string;
  responsavel: string;
  repertoire: Repertoire;
}

export type TabType = 'missas' | 'liturgia' | 'musica';

export interface User {
  username: string;
}