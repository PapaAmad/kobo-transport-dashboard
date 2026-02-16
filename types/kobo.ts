export type KoboPrimitive = string | number | boolean | null;

export type KoboObject = {
  [key: string]: KoboValue;
};

export type KoboValue = KoboPrimitive | KoboObject | KoboValue[];

export interface KoboApiPage {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: KoboObject[];
}

export interface KoboImportPayload {
  baseUrl: string;
  token: string;
  assetUid: string;
}
