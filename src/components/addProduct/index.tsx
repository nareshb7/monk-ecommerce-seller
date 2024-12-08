import React, { useState } from "react";
import { useProductContext } from "../../context";
import { DragIcon } from "../../utils/constants";
import ProductList from "../productList";
import { ProductSchema } from "../productList/type";
import ProductCard from "./ProductCard";
import "./style.css";

const AddProduct: React.FC = () => {
  // const context = useProductContext();
  const [showProductList, setShowProductList] = useState(false);
  const [productList, setProductList] = useState<ProductSchema[]>([]);
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [editIndex, setEditIndex] = useState<number>(-1)
  const handleAddProduct = (idx?: number) => {
    setShowProductList(true);
    setEditIndex(idx || -1);
  };
  const handleClose = () => {
    setShowProductList(false);
    setEditIndex(-1);
  };
  const handleAdd = (data: ProductSchema[]) => {
    if (editIndex !== -1) {
      productList.splice(editIndex, 1);
      productList.splice(editIndex, 0, ...data)
      setEditIndex(-1)
      setProductList([...productList as ProductSchema[]])
    }else {
      setProductList((prev) =>[...prev,...data]);
    }
    setShowProductList(false);
  };
  const handleDragStart = (
    e: React.DragEvent<HTMLSpanElement>,
    idx: number
  ) => {
    setDragIndex(idx);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    if (idx !== dragIndex) {
      const data = productList.find((x, i) => i === dragIndex);
      productList.splice(dragIndex, 1);
      productList.splice(idx, 0, data as ProductSchema);

      setProductList([...productList]);
      setDragIndex(-1);
    }
  };

  return (
    <div className="add-product__wrapper">
      <h3 className="add-product__title">AddProduct</h3>
      <div>
        <div className="add-product__header">
          <h5>Product</h5>
          <h5>Discount</h5>
        </div>
        {productList.length === 0 ? (
          <DefaultCard />
        ) : (
          <>
            {productList.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product as ProductSchema}
                handleEditClick={handleAddProduct}
                index={index}
                type="PRODUCT"
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            ))}
          </>
        )}
      </div>

      <div className="add-product__btn">
        <button className="btn" onClick={() =>handleAddProduct()}>
          Add Product
        </button>
      </div>

      {showProductList && (
        <ProductList onClose={handleClose} onAdd={handleAdd} />
      )}
    </div>
  );
};

export default AddProduct;

export const DefaultCard = () => (
  <div className="add-product__list--wrapper">
    <div className="add-product__list">
      <div>
        <span className="add-product__drag-icon " draggable>
          <DragIcon />
        </span>
        <span className="add-product__sl-no">1.</span>
        <span className="add-product__file-name">
          <input type="text" placeholder="Select Product" className="input" />
          <span className="add-product__edit-icon">
            <i className="fa fa-pencil" />
          </span>
        </span>
      </div>
      <div>
        <button className="btn">Add Discount</button>

        {/* <span className="add-product__dicount">
      <input className="input" />
      <input className="input" type="text" />
      <i className="fa fa-close" />
    </span> */}
      </div>
    </div>
  </div>
);
