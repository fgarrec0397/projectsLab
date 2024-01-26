import { mock } from "./mock";

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
];

const ITEMS = [...Array(3)].map((_, index) => ({
    id: mock.id(index),
    sku: `16H9UR${index}`,
    quantity: index + 1,
    name: mock.productName(index),
    coverUrl: mock.image.product(index),
    price: mock.number.price(index),
}));

export const orders = [...Array(20)].map((_, index) => {
    const shipping = 10;

    const discount = 10;

    const taxes = 10;

    const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

    const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

    const subTotal = items.reduce(
        (accumulator, item) => accumulator + item.price * item.quantity,
        0
    );

    const totalAmount = subTotal - shipping - discount + taxes;

    const customer = {
        id: mock.id(index),
        name: mock.fullName(index),
        email: mock.email(index),
        avatarUrl: mock.image.avatar(index),
        ipAddress: "192.158.1.38",
    };

    const delivery = {
        shipBy: "DHL",
        speedy: "Standard",
        trackingNumber: "SPX037739199373",
    };

    const history = {
        orderTime: mock.time(1),
        paymentTime: mock.time(2),
        deliveryTime: mock.time(3),
        completionTime: mock.time(4),
        timeline: [
            { title: "Delivery successful", time: mock.time(1) },
            { title: "Transporting to [2]", time: mock.time(2) },
            { title: "Transporting to [1]", time: mock.time(3) },
            {
                title: "The shipping unit has picked up the goods",
                time: mock.time(4),
            },
            { title: "Order has been created", time: mock.time(5) },
        ],
    };

    return {
        id: mock.id(index),
        orderNumber: `#601${index}`,
        createdAt: mock.time(index),
        taxes,
        items,
        history,
        subTotal,
        shipping,
        discount,
        customer,
        delivery,
        totalAmount,
        totalQuantity,
        shippingAddress: {
            fullAddress: "19034 Verna Unions Apt. 164 - Honolulu, RI / 87535",
            phoneNumber: "365-374-4961",
        },
        payment: {
            cardType: "mastercard",
            cardNumber: "**** **** **** 5678",
        },
        status:
            (index % 2 && "completed") ||
            (index % 3 && "pending") ||
            (index % 4 && "cancelled") ||
            "refunded",
    };
});
