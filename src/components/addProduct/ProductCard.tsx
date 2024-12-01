import React, { useState } from "react";
import { DragIcon } from "../../utils/constants";
import { ProductSchema, ProductVariant } from "../productList/mockData";
export interface ProductCardProps {
  product: ProductSchema | ProductVariant;
  handleEditClick?: (product: ProductSchema) => void;
  index: number;
  type: "PRODUCT" | "VARIANT";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  type,
  index,
  handleEditClick,
}) => {
  const [showDiscount, setShowDiscount] = useState(false);
  const [showVariant, setShowVariant] = useState(false);
  const handleVariant = () => {
    setShowVariant((prev) => !prev);
  };
  return (
    <div className={`add-product__list--wrapper ${type === "VARIANT" && "sub-product"}`}>
      <div className="add-product__list">
        <div className="add-product__data">
          <span className="add-product__drag-icon ">
          <DragIcon />
          </span>
          <span className="add-product__sl-no">{index + 1}.</span>
          <span className="add-product__file-name">
            <input
              type="text"
              value={product.title}
              placeholder="Select Product"
              className="input"
            />
            {type === "PRODUCT" && (
              <span
                className="add-product__edit-icon"
                onClick={() =>
                  handleEditClick && handleEditClick(product as ProductSchema)
                }
              >
                <i className="fa fa-pencil" />
              </span>
            )}
          </span>
        </div>
        <div>
          {showDiscount ? (
            <span className="add-product__dicount">
              <input className="input" value={"20"} />
              <input className="input" type="text" value="%Off" />
              <span onClick={() => setShowDiscount(false)}>
                <i className="fa fa-close" />
              </span>
            </span>
          ) : (
            <button className="btn" onClick={() => setShowDiscount(true)}>
              Add Discount
            </button>
          )}
        </div>
      </div>

      {type === "PRODUCT" && (
        <div className="add-product__show-variant">
          <a href="#" onClick={handleVariant}>
            {showVariant ? "Hide" : "Show"} variants
          </a>
        </div>
      )}

      {showVariant && (
        <div>
          {(product as ProductSchema)?.variants?.map((variant, idx) => (
            <ProductCard product={variant} type="VARIANT" index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
