import React, { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "../../common/modal";
import { useProductContext } from "../../context";
import { mockProduct, ProductSchema, ProductVariant } from "./mockData";
import "./style.css";

export const debounce = (fn: any, delay = 1000) => {
  let timer: NodeJS.Timeout;
  console.log("debounce initiated");
  return function (...args: any) {
    clearTimeout(timer);
    console.log("timer", timer);
    timer = setTimeout(() => {
      console.log("fn call");
      fn(...args);
    }, delay);
  };
};

export interface ProductListProps {
  onClose: () => void;
  onAdd: (products: ProductSchema[]) => void
}

const ProductList: React.FC<ProductListProps> = ({ onClose, onAdd }) => {
  const {selectedProducts, setSelectedProducts, productList, setProductList} = useProductContext();
  console.log('contexr:::',{selectedProducts, productList} )
  // const [data, setData] = useState<ProductSchema[]>(mockProduct);
  // const [selectedProducts, setSelectedProducts] = useState<
  //   Record<number, number[]>
  // >({});
  const [search, setSearch] = useState("");

  const getSearchData = useCallback((val: string) => {
    console.log("search val::", val);
    // getProductData(val);
  }, []);

  const debounceSearch = useMemo(() => debounce(getSearchData, 1000), []);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("val::::");
    const { value } = e.target;
    setSearch(value);
    debounceSearch(value);
  };
  const handleSelect = (product: ProductSchema) => {
    console.log("prdocy", product);
    if (selectedProducts[product.id]) {
      const newIds = { ...selectedProducts };
      delete newIds[product.id];
      setSelectedProducts(newIds);
    } else {
      setSelectedProducts((prev) => {
        return {
          ...prev,
          [product.id]: [...product.variants.map((variant) => variant.id)],
        };
      });
    }
  };
  const handleSubProductChange = (parentId: number, subId: number) => {
    if (selectedProducts[parentId]) {
      const list = [...selectedProducts[parentId]];
      if (selectedProducts[parentId]?.includes(subId)) {
        const idx = list.findIndex((id) => id === subId);
        list.splice(idx, 1);
        selectedProducts[parentId] = list;
        setSelectedProducts({ ...selectedProducts });
      } else {
        selectedProducts[parentId].push(subId);
        setSelectedProducts({ ...selectedProducts });
      }
    } else {
      selectedProducts[parentId] = [subId];
      setSelectedProducts({ ...selectedProducts });
    }
  };
  const handleAdd = () => {
    const selectedData = Object.keys(selectedProducts).map((productId) => {
      const selected = productList?.find((li) => li.id === Number(productId));
      if (selected) {
        const selectedVariants: ProductVariant[] = selected?.variants.filter(
          (variant) => selectedProducts[Number(productId)]?.includes(variant.id)
        );

        selected["variants"] = selectedVariants;
      }
      return selected as ProductSchema
    });
    console.log("adddata:;", selectedProducts, selectedData);
    onAdd(selectedData || [])
  };
  const getProductData = async (searchVal = "") => {
    const url = `https://stageapi.monkcommerce.app/task/products/search=${searchVal}?limit=100`;
    const response = await fetch(url, {
      headers: {
        "x-api-key": "72njgfa948d9aS7gs5",
      },
    });
    const result = await response.json();
    setProductList(result);
    console.log("res", result);
  };
  useEffect(() => {
    //  getProductData()
  }, []);
  // console.log('data:::', data)
  const len = Object.keys(selectedProducts).length
  const Footer = () => {
    return (
      <div className="product-list__footer">
        <span>{len} Products selected</span>
        <div>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    );
  };

  console.log("selected:::", selectedProducts);

  return (
    <Modal Footer={Footer} onClose={onClose}>
      <div className="product-list__wrapper">
        <div className="product-list__search">
          <span className="search-icon">
            <i className="fa fa-search" />{" "}
          </span>
          <input value={search} onChange={handleSearch} type="text" />
        </div>
        <div className="product-list__list">
          {productList?.map((product) => {
            return (
              <div className="product-list__list-item" key={product.id}>
                <div className="product-list__parent" onClick={() => handleSelect(product)}>
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
                  />
                  <span>{product.title}</span>
                </div>
                {product.variants?.length &&
                  product.variants.map((variant) => (
                    <div key={variant.id} className="product-list__sub">
                      <div className="product-list__sub-left" onClick={() => handleSubProductChange(product.id, variant.id)}>
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
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ProductList;
