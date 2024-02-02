import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Card, { CardProps } from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import MenuItem from "@mui/material/MenuItem";
import { ApexOptions } from "apexcharts";
import { useCallback, useState } from "react";

import Chart, { useChart } from "@/components/chart";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import { fData } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
    title?: string;
    subheader?: string;
    chart: {
        labels: {
            [key: string]: string[];
        };
        colors?: string[];
        series: {
            type: string;
            data: {
                name: string;
                data: number[];
            }[];
        }[];
        options?: ApexOptions;
    };
}

export default function FileDataActivity({ title, subheader, chart, ...other }: Props) {
    const { labels, colors, series, options } = chart;

    const popover = usePopover();

    const [seriesData, setSeriesData] = useState("Week");

    const chartOptions = useChart({
        chart: {
            stacked: true,
        },
        colors,
        stroke: {
            width: 0,
        },
        xaxis: {
            categories:
                (seriesData === "Week" && labels.week) ||
                (seriesData === "Month" && labels.month) ||
                labels.year,
        },
        tooltip: {
            y: {
                formatter: (value: number) => fData(value),
            },
        },
        plotOptions: {
            bar: {
                borderRadius: (seriesData === "Week" && 8) || (seriesData === "Month" && 6) || 10,
                columnWidth: "20%",
            },
        },
        ...options,
    });

    const handleChangeSeries = useCallback(
        (newValue: string) => {
            popover.onClose();
            setSeriesData(newValue);
        },
        [popover]
    );

    return (
        <>
            <Card {...other}>
                <CardHeader
                    title={title}
                    subheader={subheader}
                    action={
                        <ButtonBase
                            onClick={popover.onOpen}
                            sx={{
                                pl: 1,
                                py: 0.5,
                                pr: 0.5,
                                borderRadius: 1,
                                typography: "subtitle2",
                                bgcolor: "background.neutral",
                            }}
                        >
                            {seriesData}

                            <Iconify
                                width={16}
                                icon={
                                    popover.open
                                        ? "eva:arrow-ios-upward-fill"
                                        : "eva:arrow-ios-downward-fill"
                                }
                                sx={{ ml: 0.5 }}
                            />
                        </ButtonBase>
                    }
                />

                {series.map((item) => (
                    <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
                        {item.type === seriesData && (
                            <Chart
                                dir="ltr"
                                type="bar"
                                series={item.data}
                                options={chartOptions}
                                width="100%"
                                height={364}
                            />
                        )}
                    </Box>
                ))}
            </Card>

            <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
                {series.map((option) => (
                    <MenuItem
                        key={option.type}
                        selected={option.type === seriesData}
                        onClick={() => handleChangeSeries(option.type)}
                    >
                        {option.type}
                    </MenuItem>
                ))}
            </CustomPopover>
        </>
    );
}