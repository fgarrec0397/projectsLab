"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { isEqual } from "@projectslab/helpers";
import { usePrevious } from "@projectslab/helpers-client";
import { useCallback, useEffect, useState } from "react";

import { FILE_TYPE_OPTIONS } from "@/_mock";
import { useAuthContext } from "@/auth/hooks";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import { ConfirmDialog } from "@/components/custom-dialog";
import EmptyContent from "@/components/empty-content";
import { fileFormat } from "@/components/file-thumbnail";
import Iconify from "@/components/iconify";
import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { useSnackbar } from "@/components/snackbar";
import { getComparator, useTable } from "@/components/table";
import { useBoolean } from "@/hooks/use-boolean";
import { deleteFiles } from "@/services/filesService/filesService";
import { useGetFiles } from "@/services/filesService/hooks/useGetFiles";
import { pxToRem } from "@/theme/typography";
import { IFile, IFileFilters, IFileFilterValue } from "@/types/file";
import { isAfter, isBetween } from "@/utils/format-time";

import FileManagerFilters from "../file-manager-filters";
import FileManagerFiltersResult from "../file-manager-filters-result";
import FileManagerGridView, { showFoldersSection } from "../file-manager-grid-view";
import FileManagerNewFolderDialog from "../file-manager-new-folder-dialog";
import FileManagerTable from "../file-manager-table";
import { useFolderBreadcrumbs } from "../hooks/use-folder-breadcrumbs";

// ----------------------------------------------------------------------

const defaultFilters: IFileFilters = {
    name: "",
    type: [],
    startDate: null,
    endDate: null,
};

// ----------------------------------------------------------------------

const showDisplayToggles = false;

export default function FileManagerView() {
    const auth = useAuthContext();

    const breadcrumbsLinks = useFolderBreadcrumbs();

    const previousBreadcrumbsLinks = usePrevious(breadcrumbsLinks);

    const { enqueueSnackbar } = useSnackbar();

    const table = useTable({ defaultRowsPerPage: 10 });

    const openDateRange = useBoolean();

    const confirm = useBoolean();

    const upload = useBoolean();

    const [view, setView] = useState("grid");

    const { files, isFilesLoading } = useGetFiles();

    const [tableData, setTableData] = useState<IFile[]>([]);

    const [filters, setFilters] = useState(defaultFilters);

    const dateError = isAfter(filters.startDate, filters.endDate);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
        dateError,
    });

    const canReset =
        !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    useEffect(() => {
        if (!isEqual(breadcrumbsLinks, previousBreadcrumbsLinks)) {
            table.onChangePage(undefined, 0);
        }
    }, [breadcrumbsLinks, previousBreadcrumbsLinks, table]);

    useEffect(() => {
        setTableData(files);
    }, [files]);

    const handleChangeView = useCallback(
        (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
            if (newView !== null) {
                setView(newView);
            }
        },
        []
    );

    const handleFilters = useCallback(
        (name: string, value: IFileFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const handleDeleteItem = useCallback(
        async (id: string) => {
            enqueueSnackbar(`Deleting item...`, {
                variant: "warning",
            });

            await deleteFiles(auth.user?.accessToken, id);

            enqueueSnackbar("Item deleted with success!");
        },
        [auth.user?.accessToken, enqueueSnackbar]
    );

    const handleDeleteItems = useCallback(async () => {
        enqueueSnackbar(`Deleting ${table.selected.length} items...`, {
            variant: "warning",
        });
        await deleteFiles(auth.user?.accessToken, table.selected);

        enqueueSnackbar(`${table.selected.length} items were delected with success!`);

        table.setSelected([]);
    }, [auth.user?.accessToken, enqueueSnackbar, table]);

    const renderFilters = (
        <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-end", md: "center" }}
        >
            <FileManagerFilters
                openDateRange={openDateRange.value}
                onCloseDateRange={openDateRange.onFalse}
                onOpenDateRange={openDateRange.onTrue}
                //
                filters={filters}
                onFilters={handleFilters}
                //
                dateError={dateError}
                typeOptions={FILE_TYPE_OPTIONS}
            />

            {showDisplayToggles && (
                <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
                    <ToggleButton value="list">
                        <Iconify icon="solar:list-bold" />
                    </ToggleButton>

                    <ToggleButton value="grid">
                        <Iconify icon="mingcute:dot-grid-fill" />
                    </ToggleButton>
                </ToggleButtonGroup>
            )}
        </Stack>
    );

    const renderResults = (
        <FileManagerFiltersResult
            filters={filters}
            onResetFilters={handleResetFilters}
            //
            canReset={canReset}
            onFilters={handleFilters}
            //
            results={dataFiltered.length}
        />
    );

    return (
        <>
            <PageWrapper
                title={
                    showFoldersSection ? (
                        <CustomBreadcrumbs
                            heading="Files Manager"
                            links={breadcrumbsLinks}
                            sx={{
                                marginTop: pxToRem(-5),
                            }}
                        />
                    ) : (
                        "Files Manager"
                    )
                }
                titleItem={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={upload.onTrue}
                    >
                        Upload
                    </Button>
                }
                subContent={
                    <>
                        {renderFilters}

                        {canReset && renderResults}
                    </>
                }
                isLoading={isFilesLoading}
            >
                {notFound ? (
                    <EmptyContent
                        filled
                        title="No Data"
                        sx={{
                            py: 10,
                        }}
                    />
                ) : (
                    <>
                        {view === "list" ? (
                            <FileManagerTable
                                table={table}
                                dataFiltered={dataFiltered}
                                onDeleteRow={handleDeleteItem}
                                notFound={notFound}
                                onOpenConfirm={confirm.onTrue}
                            />
                        ) : (
                            <FileManagerGridView
                                table={table}
                                dataFiltered={dataFiltered}
                                onDeleteItem={handleDeleteItem}
                                onOpenConfirm={confirm.onTrue}
                            />
                        )}
                    </>
                )}
            </PageWrapper>

            <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong>{" "}
                        items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteItems();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filters,
    dateError,
}: {
    inputData: IFile[];
    comparator: (a: any, b: any) => number;
    filters: IFileFilters;
    dateError: boolean;
}) {
    const { name, type, startDate, endDate } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (type.length) {
        inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
    }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter((file) => isBetween(file.modifiedAt, startDate, endDate));
        }
    }

    return inputData;
}
