import React, { useState } from "react";
import { DragIcon } from "../../utils/constants";
import { ProductSchema, ProductVariant } from "../productList/type";
export interface ProductCardProps {
  product: ProductSchema | ProductVariant;
  handleEditClick?: (idx: number) => void;
  index: number;
  type: "PRODUCT" | "VARIANT";
  onDragStart: (e: React.DragEvent<HTMLSpanElement>, idx: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, idx: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  type,
  index,
  handleEditClick,
  onDragOver,
  onDragStart,
  onDrop,
}) => {
  const [showDiscount, setShowDiscount] = useState(false);
  const [showVariant, setShowVariant] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1);
  const handleVariant = () => {
    setShowVariant((prev) => !prev);
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
    const variants = (product as ProductSchema)?.variants;
    if (idx !== dragIndex) {
      if (variants) {
        const data = variants?.find((_, i) => i === dragIndex);
        variants.splice(dragIndex, 1);
        variants.splice(idx, 0, data as ProductVariant);
        setDragIndex(-1);
      }
    }
  };

  return (
    <div
      className={`add-product__list--wrapper ${
        type === "VARIANT" && "sub-product"
      }`}
    >
      <div
        className={`add-product__list ${
          type === "VARIANT" ? "VARIANT" : "PRODUCT"
        }`}
        onDrop={(e) => onDrop(e, index)}
        onDragOver={onDragOver}
      >
        <div className="add-product__data">
          <span
            className="add-product__drag-icon "
            draggable
            onDragStart={(e) => onDragStart(e, index)}
          >
            <DragIcon />
          </span>
          <span className="add-product__sl-no">{index + 1}.</span>
          <div className="add-product__file-name">
            <span className="add-product__title">{product.title}</span>
            {type === "PRODUCT" && (
              <span
                className="add-product__edit-icon"
                onClick={() =>
                  handleEditClick && handleEditClick(index)
                }
              >
                <i className="fa fa-pencil" />
              </span>
            )}
          </div>
        </div>
        <div>
          {showDiscount ? (
            <span className="add-product__dicount">
              <input className="input" value={"20"} />
              <input className="input" type="text" value="%Off" />
              <span
                onClick={() => setShowDiscount(false)}
                style={{ cursor: "pointer" }}
              >
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
            <ProductCard
              key={variant.id}
              product={variant}
              type="VARIANT"
              index={idx}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
