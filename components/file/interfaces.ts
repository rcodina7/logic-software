export interface fileInfo {
  lastModifiedDate: string;
  name: string;
  size: string;
}

export interface headData {
  fecha: string;
  fechaContable: string;
  documento: string;
  TipoDoc: string;
  CIF: string;
  nombre: string;
  razonCocial: string;
  descripcion: string;
  tipoGasto: string;
  etiquetas: string;
  baseImp: string;
  cuotaIVA: string;
  totalIVA: string;
  cuotaRET: string;
  totalRET: string;
  imputa: string;
  total: string;
  adjunto: string;
}

export interface parsedDataItem {
  date: string;
  draft: boolean;
  provider: number;
  document_type: string;
  document_number: string;
  annotations: string;
  expense_lines: [
    {
      description: string;
      base: number;
      tax: number;
      retention: number;
      imputation: number;
      expense_type: string;
      investment: boolean;
    }
  ];
  payments: [
    {
      date: boolean;
      amount: number;
      payment_method: string;
      paid: boolean;
      origin_account: number;
      destination_account: string;
    }
  ];
}

interface currentProvidersInterface {
  [x: string]: any;
  id: number;
  cif: string;
}
export type currentProvidersType = currentProvidersInterface | null;

export type parsedData = parsedDataItem[];
