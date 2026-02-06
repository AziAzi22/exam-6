export interface CreateProductDTO {
    title: string;
    price: number;
    quantity: number;
    description?: string;
    categoryId: number;
}


export interface UpdateProductDTO {
    title?: string;
    price?: number;
    quantity?: number;
    description?: string;
    categoryId?: number;
}