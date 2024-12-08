import React from "react";
import Modal from "../../common/modal";
import { ProductSchema } from "./mockData";
import "./style.css";
import useProductList from "./useProductList";

export const debounce = (fn: any, delay = 1000) => {
  let timer: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export interface ProductListProps {
  onClose: () => void;
  onAdd: (products: ProductSchema[]) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onClose, onAdd }) => {
  const {
    productListRef,
    productList,
    search,
    selectedProducts,
    isLoading,
    hasMoreData,
    handleSelect,
    handleSubProductChange,
    handleAdd,
    handleSearch,
  } = useProductList({ onClose, onAdd });
  const len = Object.keys(selectedProducts).length;
  const Footer = () => {
    return (
      <div className="product-list__footer">
        {len !== 0 && <span>{len} Products selected</span>}
        <div>
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn add" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal Footer={Footer} onClose={onClose}>
      <div className="product-list__wrapper" ref={productListRef}>
        <div className="product-list__search">
          <span className="search-icon">
            <i className="fa fa-search" />{" "}
          </span>
          <input value={search} onChange={handleSearch} type="text" />
        </div>
        <div className="product-list__list">
          {isLoading && <div>Loading......</div>}
          {productList?.map((product) => {
            return (
              <div className="product-list__list-item" key={product.id}>
                <div
                  className="product-list__parent"
                  onClick={() => handleSelect(product)}
                >
                  <input
                    className="input"
                    type="checkbox"
                    checked={Boolean(
                      selectedProducts[product.id] &&
                        selectedProducts[product.id]?.length ===
                          product.variants.length
                    )}
                    onChange={() => handleSelect(product)}
                  />
                  <img
                    width={30}
                    height={30}
                    src={product.image.src}
                    loading={"lazy"}
                    alt="img"
                  />
                  <span>{product.title}</span>
                </div>
                {product.variants?.length &&
                  product.variants.map((variant) => (
                    <div key={variant.id} className="product-list__sub">
                      <div
                        className="product-list__sub-left"
                        onClick={() =>
                          handleSubProductChange(product.id, variant.id)
                        }
                      >
                        <input
                          className="input"
                          type="checkbox"
                          checked={
                            selectedProducts[product.id]?.includes(
                              variant.id
                            ) || false
                          }
                          onChange={() =>
                            handleSubProductChange(product.id, variant.id)
                          }
                        />
                        <span>{variant.title}/cotton</span>
                      </div>
                      <div className="product-list__sub-right">
                        <span>{variant.inventory_quantity || 0} available</span>
                        <span>{variant.price}</span>
                      </div>
                    </div>
                  ))}
                {!hasMoreData && <div>No More Data</div>}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ProductList;
