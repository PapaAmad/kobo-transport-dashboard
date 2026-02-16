const supplierLabels: Record<string, string> = {
  "1": "Importateur",
  "2": "Producteur",
  "3": "Grossiste ou demi-grossiste",
  "4": "Autre"
};

const unitLabels: Record<string, string> = {
  "1": "Millier de tonne (Kt)",
  "2": "Tonne",
  "3": "Kilogramme",
  "4": "Gramme",
  "5": "Litre",
  "6": "Metre cube",
  "7": "Metre",
  "8": "Metre carre",
  "9": "Sac",
  "10": "Sachet",
  "11": "Bidon",
  "12": "Bouteille",
  "13": "Boite",
  "14": "Paquet",
  "15": "Panier",
  "16": "Bassin",
  "17": "Unite",
  "18": "Charrette",
  "19": "Camion",
  "20": "Conteneur",
  "21": "Autre"
};

export function getSupplierLabel(code: string): string {
  return supplierLabels[code] ?? `Type ${code || "non renseigne"}`;
}

export function getUnitLabel(code: string): string {
  return unitLabels[code] ?? `Unite ${code || "non renseignee"}`;
}
