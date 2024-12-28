
export interface Product {
    type: string;
    productId: string;
    active: boolean;
    count: number;
    name: string;
    price: number;
    deposit: number,
    description: string;
    imageUrl: string;
    datesReserved: Date[];
}