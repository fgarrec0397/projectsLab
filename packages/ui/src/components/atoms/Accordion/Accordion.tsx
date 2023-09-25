import AccordionLib, { AccordionProps as LibAccordionProps } from "@mui/material/Accordion";
import AccordionDetailsLib, {
    AccordionDetailsProps as LibAccordionDetailsProps,
} from "@mui/material/AccordionDetails";
import AccordionSummaryLib, {
    AccordionSummaryProps as LibAccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import ArrowDropDown from "@projectslab/icons/ArrowDropDown";
import { FC } from "react";

export type AccordionProps = LibAccordionProps;
export type AccordionSummaryProps = LibAccordionSummaryProps;
export type AccordionDetailsProps = LibAccordionDetailsProps;

const Accordion: FC<AccordionProps> = ({ children, ...props }) => {
    return <AccordionLib {...props}>{children}</AccordionLib>;
};

export const AccordionSummary: FC<AccordionSummaryProps> = ({ children, ...props }) => {
    return (
        <AccordionSummaryLib expandIcon={<ArrowDropDown />} {...props}>
            {children}
        </AccordionSummaryLib>
    );
};

export const AccordionDetails: FC<LibAccordionDetailsProps> = ({ children, ...props }) => {
    return <AccordionDetailsLib {...props}>{children}</AccordionDetailsLib>;
};

export default Accordion;
