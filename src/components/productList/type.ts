export interface ProductImage {
    "id": number,
    "product_id": number,
    "src": string
}

export interface ProductOptions  {
    "id": number;
    "product_id": number;
    "name": string;
    "position": number,
    "values": string[]
}


export interface ProductVariant {
    "id": number;
    "product_id": number;
    "title": string;
    "inventory_policy": string;
    "price": string;
    "compare_at_price": string;
    "inventory_management": string;
    "option1":string;
    "option2": string;
    "created_at": string;
    "updated_at": string;
    "inventory_quantity": number;
    "admin_graphql_api_id": string;
}

export interface ProductSchema {
    "id": number,
    "title": string;
    "vendor": string;
    "handle": string;
    "created_at": string;
    "updated_at":string;
    "published_at": string;
    "tags": string;
    "options": ProductOptions[],
    "image": ProductImage,
    "images": ProductImage[],
    "admin_graphql_api_id": string,
    "status": string,
    "variants": ProductVariant[]
}