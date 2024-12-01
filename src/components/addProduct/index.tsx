import React, { useState } from "react";
import { useProductContext } from "../../context";
import { DragIcon } from "../../utils/constants";
import ProductList from "../productList";
import { ProductSchema } from "../productList/mockData";
import ProductCard from "./ProductCard";
import "./style.css";

const AddProduct: React.FC = () => {
  const context = useProductContext()
  console.log('con::', context)
  const [showProductList, setShowProductList] = useState(false);
  const [productList, setProductList] = useState<ProductSchema[]>([]);
  const handleAddProduct = () => {
    console.log("click");
    setShowProductList(true);
  };
  const handleClose = () => {
    setShowProductList(false);
  };
  const handleAdd = (data: ProductSchema[]) => {
    setProductList(data);
    setShowProductList(false);
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
          <div className="add-product__list--wrapper">
            <div className="add-product__list">
              <div>
                <span className="add-product__drag-icon " draggable><DragIcon /></span>
                <span className="add-product__sl-no">1.</span>
                <span className="add-product__file-name">
                  <input
                    type="text"
                    placeholder="Select Product"
                    className="input"
                  />
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
        ) : (
          <>
            {productList.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product as ProductSchema}
                handleEditClick={handleAddProduct}
                index={index}
                type="PRODUCT"
              />
            ))}
          </>
        )}
      </div>

      <div className="add-product__btn">
        <button className="btn" onClick={handleAddProduct}>
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
