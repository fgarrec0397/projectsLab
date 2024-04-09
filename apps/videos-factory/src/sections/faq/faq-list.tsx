import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";

// ----------------------------------------------------------------------

const faqs = [
    {
        id: "id",
        value: `value`,
        heading: `Questions `,
        detail: "details",
    },
    {
        id: "id2",
        value: `value2`,
        heading: `Questions 2`,
        detail: "details 2",
    },
];

export default function FaqList() {
    return (
        <div>
            {faqs.map((accordion) => (
                <Accordion key={accordion.id}>
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                        <Typography variant="subtitle1">{accordion.heading}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography>{accordion.detail}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
