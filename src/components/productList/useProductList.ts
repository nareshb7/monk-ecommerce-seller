import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce, ProductListProps } from ".";
import { useProductContext } from "../../context";
import { ProductSchema, ProductVariant } from "./mockData";
const LIMIT = 10;

const useProductList = ({ onAdd }: ProductListProps) => {
  const { productList, setProductList } =
    useProductContext();
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number[]>>([])
  const productListRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  // const [data, setData] = useState<ProductSchema[]>(mockProduct);
  // const [selectedProducts, setSelectedProducts] = useState<
  //   Record<number, number[]>
  // >({});
  const [search, setSearch] = useState("");

  const getProductData = async (
    searchVal = "",
    page = pageNum,
    scroll = false
  ) => {
    try {
      setIsLoading(true);
      const url = `https://stageapi.monkcommerce.app/task/products/search?search=${searchVal}&page=${page}&limit=${LIMIT}`;
      const response = await fetch(url, {
        headers: {
          "x-api-key": "72njgfa948d9aS7gs5",
        },
      });
      const result = await response.json();
      if (result?.length == 0) {
        setHasMoreData(false);
      }
      if (scroll) {
        setProductList((prev) => [...(prev as ProductSchema[]), ...result]);
        setPageNum(page);
      } else {
        setProductList(result);
      }
    } catch (err: any) {
      console.error("get_data_error", err.message);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchData = useCallback((val: string) => {
    console.log("search val::", val);
    getProductData(val);
  }, []);

  const debounceSearch = useMemo(() => debounce(getSearchData, 1000), []);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("val::::");
    const { value } = e.target;
    setSearch(value);
    debounceSearch(value);
  };
  const handleSelect = (product: ProductSchema) => {
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
      return selected as ProductSchema;
    });
    onAdd(selectedData || []);
  };

  const loadMore = useCallback((search: string, pageNum: number) => {
    getProductData(search, pageNum, true);
  }, []);
  const debounceLoadMore = useMemo(() => debounce(loadMore, 1000), []);
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      productListRef.current as HTMLDivElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 2 &&
      hasMoreData &&
      !isLoading
    ) {
      debounceLoadMore(search, pageNum + 1);
    }
  };
  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (productListRef.current) {
        productListRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [productList, isLoading, pageNum, hasMoreData]);
  useEffect(() => {
     getProductData()
  }, []);
  return {
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
  };
};

export default useProductList;
