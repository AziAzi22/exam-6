export interface CreateCategoryDTO {
  title: string;
  imageUrl: string;
  adminId: number;
}

export interface UpdateCategoryDTO {
  title?: string;
  imageUrl?: string;
}
