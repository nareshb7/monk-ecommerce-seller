import React, { createContext, ReactNode, useContext, useState } from "react";
import { ProductSchema } from "../components/productList/type";

export interface ContextWrapperProps {
  children: ReactNode;
}

export interface ProductContextInterface {
  productList?: ProductSchema[];
  setProductList: React.Dispatch<React.SetStateAction<ProductSchema[]>>,
  selectedProducts: Record<number, number[]>,
  setSelectedProducts:React.Dispatch<React.SetStateAction<Record<number, number[]>>>
}
export const ProductContext = createContext<ProductContextInterface | null>(
  null
);

const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
    const [productList, setProductList] = useState<ProductSchema[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<
    Record<number, number[]>
  >({});
  const value = {
    productList, 
    setProductList,
    selectedProducts,
    setSelectedProducts
  };
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ContextWrapper;

export const useProductContext = () => useContext(ProductContext) as ProductContextInterface;
