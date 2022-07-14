import { currentProvidersType, parsedData } from "./interfaces";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const parseBody = (
  currentProviders: currentProvidersType,
  fileData: null | any
) => {
  const data: parsedData = [];

  fileData.body.forEach((el: string | any[]) => {
    if (el.length === 19) {
      data.push({
        date: getDate(),
        draft: false,
        provider: getProviderID(el[5].trim().toLowerCase(), currentProviders),
        document_type: "invoice",
        document_number: el[3],
        annotations: "",
        expense_lines: [
          {
            description: el[8],
            base: el[11],
            tax: el[12] * 100,
            retention: el[14] > 0 ? el[14] * 100 : el[14],
            imputation: el[16] > 0 ? el[16] * 100 : el[16],
            expense_type: el[9].split(" ")[0],
            investment: false,
          },
        ],
        payments: [
          {
            date: false,
            amount: el[17],
            payment_method: "cash",
            paid: false,
            origin_account: 47646,
            destination_account: "B87625489",
          },
        ],
      });
    }
  });
  return data;
};

function getDate() {
  const date = new Intl.DateTimeFormat("es-EU").format().toString();
  const dateArray = date.split("/");
  const formatedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;

  return formatedDate;
}

const getProviderID = (CIF: string, currentProviders: currentProvidersType) => {
  const test = currentProviders?.find((el: { cif: string; id: any }) =>
    el.cif === CIF ? el.id : ""
  );

  console.log(
    "Para el CIF: " +
      CIF +
      " Se ha encontrado el ID: " +
      test?.id +
      " y el CIF : " +
      test?.cif
  );

  return test?.id;
};

export { formatBytes, parseBody };
