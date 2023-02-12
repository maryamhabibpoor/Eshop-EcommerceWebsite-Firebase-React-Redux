import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Notiflix from "notiflix";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from "../../loader/Loader";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, STORE_PRODUCTS } from "../../../redux/slice/productSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import styles from "./ViewProducts.module.scss";

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, storage } from '../../../firebase/config'
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { FILTER_BY_SEARCH, selectFilteredProducts, } from "../../../redux/slice/filterSlice";
import Search from "../../search/Search";
import Pagination from "../../pagination/Pagination";




const ViewProducts = () => {
  const { data, isLoading } = useFetchCollection("products");
  // const [products, setProducts] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const products = useSelector(selectProducts);


  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  // Get Current Products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );




  //use this way

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
  }, [dispatch, data]);





  //get data when loading  #######expire this way

  // useEffect(() => {
  //     getProducts()
  // }, [])



  //get Data
  // const getProducts = () => {
  //     setIsLoading(true)
  //     try {
  //         const productRef = collection(db, "products")
  //         const q = query(productRef, orderBy("createdAt", "desc"))

  //         onSnapshot(q, (snapshot) => {
  //             // console.log(snapshot)
  //             // console.log(snapshot.docs)
  //             const allProducts = snapshot.docs.map((doc) => ({
  //                 id: doc.id,
  //                 ...doc.data()
  //             }))
  //             console.log(allProducts)
  //             setProducts(allProducts)
  //             setIsLoading(false)
  //             dispatch(
  //                 STORE_PRODUCTS({
  //                     products: allProducts
  //                 })
  //             )
  //         })
  //     } catch (error) {
  //         setIsLoading(false)
  //         toast.error(error.message)
  //     }
  // }



  //setting for search
  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);



  ///Delete product 
  const deleteProduct = async (id, imageURL) => {
    try {
      await deleteDoc(doc(db, "products", id));

      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef);
      toast.success("Product deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  };


  //confirm Delete product
  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      "Delete Product!!!",
      "You are about to delete this product",
      "Delete",
      "Cancel",
      function okCb() {
        deleteProduct(id, imageURL);
      },
      function cancelCb() {
        console.log("Delete Canceled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.table}>
        <h2>All Products</h2>

        <div className={styles.search}>
          <p>
            <b>{filteredProducts.length}</b> products found
          </p>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filteredProducts.length === 0 ? (
          <p>No product found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const { id, name, price, imageURL, category } = product;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={imageURL}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{`$${price}`}</td>
                    <td className={styles.icons}>
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(id, imageURL)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        />
      </div>
    </>
  );
}

export default ViewProducts