import { add, subDays } from "date-fns";

import { addressBooks } from "./_others";
import { mock } from "./mock";

// ----------------------------------------------------------------------

export const INVOICE_STATUS_OPTIONS = [
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
    { value: "draft", label: "Draft" },
];

export const INVOICE_SERVICE_OPTIONS = [...Array(8)].map((_, index) => ({
    id: mock.id(index),
    name: mock.role(index),
    price: mock.number.price(index),
}));

const ITEMS = [...Array(3)].map((__, index) => {
    const total = INVOICE_SERVICE_OPTIONS[index].price * mock.number.nativeS(index);

    return {
        id: mock.id(index),
        total,
        title: mock.productName(index),
        description: mock.sentence(index),
        price: INVOICE_SERVICE_OPTIONS[index].price,
        service: INVOICE_SERVICE_OPTIONS[index].name,
        quantity: mock.number.nativeS(index),
    };
});

export const invoices = [...Array(20)].map((_, index) => {
    const taxes = mock.number.price(index + 1);

    const discount = mock.number.price(index + 2);

    const shipping = mock.number.price(index + 3);

    const subTotal = ITEMS.reduce(
        (accumulator, item) => accumulator + item.price * item.quantity,
        0
    );

    const totalAmount = subTotal - shipping - discount + taxes;

    const status =
        (index % 2 && "paid") || (index % 3 && "pending") || (index % 4 && "overdue") || "draft";

    return {
        id: mock.id(index),
        taxes,
        status,
        discount,
        shipping,
        subTotal,
        totalAmount,
        items: ITEMS,
        invoiceNumber: `INV-199${index}`,
        invoiceFrom: addressBooks[index],
        invoiceTo: addressBooks[index + 1],
        sent: mock.number.nativeS(index),
        createDate: subDays(new Date(), index),
        dueDate: add(new Date(), { days: index + 15, hours: index }),
    };
});
