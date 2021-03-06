import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";

import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import { read, utils } from "xlsx";
import BasicTable from "../components/tables/BasicTable";
import {
  handleCuenticaPost,
  handleFetchProviders,
} from "../components/file/api/fileApi";
import { currentProvidersType, fileInfo } from "../components/file/interfaces";
import { formatBytes, parseBody } from "../components/file/utils";
import BasicAlert from "../components/Alert";

const Input = styled("input")({
  display: "none",
});

const File: NextPage = () => {
  const [fileInfo, setFileInfo] = React.useState<null | fileInfo>(null);
  const [fileData, setFileData] = React.useState<null | unknown>(null);
  const [displayAlert, setDisplayAlert] = React.useState<null | {
    success: string;
    message: string;
  }>(null);
  const [enviando, setEnviando] = React.useState(false);
  // const [currentProviders, setCurrentProviders] =
  //   React.useState<currentProvidersType>(null);
  // const [isLoading, setIsLoading] = React.useState(true);

  // React.useEffect(() => {
  //   const fetchProviders = async () => {
  //     const providers = await handleFetchProviders();

  //     if (!providers.success) {
  //       return alert("algo ha ido mal..." + providers.error);
  //     }

  //     setCurrentProviders(providers.data);
  //     setIsLoading(false);
  //   };

  //   if (isLoading) fetchProviders();
  // }, [isLoading]);

  const handleChange = (e: any) => {
    const [file] = e.target.files;

    const { lastModifiedDate, name, size } = file;
    parseExcel(e, file);

    const formatedDate = new Intl.DateTimeFormat("es-EU")
      .format(lastModifiedDate)
      .toString();

    const formatedSize = formatBytes(size);

    setFileInfo({
      lastModifiedDate: formatedDate,
      name,
      size: formatedSize,
    });
  };

  const parseExcel = (e: any, file: Blob) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const bstr = e.target?.result;

      const wb = read(bstr, { type: "binary" });

      const first_worksheet = wb.Sheets[wb.SheetNames[0]];
      const excelData: any = utils.sheet_to_json(first_worksheet, {
        header: 1,
      });

      const head: string[] = excelData[0];

      const body = excelData.slice(1);

      setFileData({ head, body });
    };
    reader.readAsBinaryString(file);
  };

  const resetForm = () => {
    setFileInfo(null);
    setFileData(null);
  };

  const handleSendFile = async () => {
    setEnviando(true);
    // const parsedBodyData = parseBody(currentProviders, fileData);
    const parsedBodyData = parseBody(fileData);

    // const parsedExcelTotalAmount = parsedBodyData
    //   .reduce((prev, curr) => prev + curr.payments[0].amount, 0)
    //   .toFixed(2);

    // const excelTotalAmount =
    //   fileData.body[fileData.body.length - 1][17].toFixed(2);

    // const numbersMatch = parsedExcelTotalAmount === excelTotalAmount;

    // if (!numbersMatch)
    //   return alert(
    //     "Cuidado el importe total de la factura en excel y el importe total de los datos entrados, no coincide"
    //   );

    // alert("enviando datos...");

    const { success, errors } = await handleCuenticaPost(parsedBodyData);
    ("errores son: ");
    errors;

    handleDisplayAlert(success, errors);
  };

  const handleDisplayAlert = (success: boolean, errors: number) => {
    setDisplayAlert({
      success: success ? "success" : "error",
      message:
        errors > 0
          ? `${errors} ${errors === 1 ? "gasto" : "gastos"} no se ${
              errors === 1 ? "ha" : "han"
            } podido enviar`
          : "Se ha enviado todo correctamente",
    });

    setEnviando(false);

    setTimeout(() => {
      setDisplayAlert(null);
    }, 5000);
  };

  return (
    <Container maxWidth="lg">
      {displayAlert && (
        <BasicAlert
          success={displayAlert.success}
          message={displayAlert.message}
        />
      )}
      <Box
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Load file page
        </Typography>
        <Box maxWidth="sm">
          <Button variant="contained" component={Link} noLinkStyle href="/">
            Go to the home page
          </Button>
        </Box>
      </Box>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: " center",
        }}
      >
        {fileInfo ? (
          <Button variant="contained" color="warning" onClick={resetForm}>
            Cancelar
          </Button>
        ) : (
          <label htmlFor="contained-button-file">
            <Input
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleChange}
            />

            <Button variant="contained" component="span">
              Subir factura
            </Button>
          </label>
        )}

        {fileInfo && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography>Name: {fileInfo.name}</Typography>
            <Typography>Size: {fileInfo.size}</Typography>
            <Typography>Last modified: {fileInfo.lastModifiedDate}</Typography>
            {fileData &&
              (enviando ? (
                <LoadingButton loading variant="outlined">
                  Submit
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSendFile}
                >
                  Enviar
                </Button>
              ))}
          </div>
        )}
      </Stack>
      <br />
      {fileData && <BasicTable fileData={fileData} />}

      <ProTip />
      <Copyright />
    </Container>
  );
};

export default File;
