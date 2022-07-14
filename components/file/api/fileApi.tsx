import { parsedData } from "../interfaces";

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", process.env.NEXT_PUBLIC_CUENTICA_TOKEN || "");

const page1URL = "https://api.cuentica.com/provider";
const page2URL = "https://api.cuentica.com/provider?page=2";

const handleFetchProviders = async () => {
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const [responseFirstPage, responseSecondPage] = await Promise.all([
      fetch(page1URL, requestOptions),
      fetch(page2URL, requestOptions),
    ]);

    const [rawDataFirstPage, rawDataSecondPage] = await Promise.all([
      responseFirstPage.json(),
      responseSecondPage.json(),
    ]);

    const rawData = rawDataFirstPage.concat(rawDataSecondPage);

    const data = rawData.map((el: { id: number; cif: string }) => {
      return { id: el.id, cif: el.cif.trim().toLowerCase() };
    });

    return { success: true, data };
  } catch (error) {
    return { success: true, error: error };
  }
};

const handleCuenticaPost = async (data: parsedData) => {
  myHeaders.append("Content-Type", "application/json");

  for await (const el of data) {
    const raw = JSON.stringify(el);
    const requestOptions: RequestInit | undefined = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://api.cuentica.com/expense",
        requestOptions
      );
      const data = await response.text();
    } catch (error) {
      console.log(error);
    }
  }
};

export { handleFetchProviders, handleCuenticaPost };
