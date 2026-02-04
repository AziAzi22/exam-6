export interface CreateProductDTO {
    title: string;
    price: number;
    quantity: number;
    description?: string;
    imageOneUrl: string;
    imageTwoUrl?: string;
    imageThreeUrl?: string;
    imageFourUrl?: string;
    categoryId: number;
    adminId: number;
}


export interface UpdateProductDTO {
    title?: string;
    price?: number;
    quantity?: number;
    description?: string;
    imageOneUrl?: string;
    imageTwoUrl?: string;
    imageThreeUrl?: string;
    imageFourUrl?: string;
    categoryId?: number;
}