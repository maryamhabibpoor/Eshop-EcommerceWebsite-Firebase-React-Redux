// import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
// import { toast } from 'react-toastify'
// import { db } from '../../../firebase/config'
import spinnerImg from "../../../assets/spinner.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  DECREASE_CART,
  selectCartItems,
} from "../../../redux/slice/cartSlice";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import Card from "../../card/Card";
import StarsRating from "react-star-rate";


const ProductDetails = () => {
  const { id } = useParams()
  // console.log(id)
  const [product, setProduct] = useState(null)
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { document } = useFetchDocument("products", id);


//setting for reviews####################
  const { data } = useFetchCollection("reviews");
  // console.log(data)
  const filteredReviews = data.filter((review) => review.productID === id);



  // we use nother way################################################################
  // const getProduct = async()=>{
  //   const docRef = doc(db , "products", id);
  //   const docSnap= await getDoc(docRef);
  //   if(docSnap.exists()){
  //     // console.log("Document Data", docSnap.data());
  //     const obj = {
  //       id: id,
  //       ...docSnap.data()
  //     }
  //     setProduct(obj)
  //     console.log(obj)
  //   }else{
  //     toast.error("product not found")
  //   }
  // }


  // useEffect(() => {
  //     getProduct()
  // }, [])


  //###################################################################################

  useEffect(() => {
    setProduct(document)
  }, [document])


  //setting the number of the quantity
  const cart = cartItems.find((cart) => cart.id === id);

  ///setting for appeare or disapeare decearse or incraese
  const isCartAdded = cartItems.findIndex((cart) => {
    return cart.id === id;
  });

  //setting add to cart
  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  //setting decrease from cart
  const decreaseCart = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };



  return (
    <section>
      <div className={`container ${styles.product}`}>
        <h2>Product Details</h2>
        <div>
          <Link to="/#products">&larr; Back To Products</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="Loading" style={{ width: "50px" }} />
        ) : (
          <>
            <div className={styles.details}>
              <div className={styles.img}>
                <img src={product.imageURL} alt={product.name} />
              </div>
              <div className={styles.content}>
                <h3>{product.name}</h3>
                <p className={styles.price}>{`$${product.price}`}</p>
                <p>{product.desc}</p>
                <p>
                  <b>SKU</b> {product.id}
                </p>
                <p>
                  <b>Brand</b> {product.brand}
                </p>

                <div className={styles.count}>
                  {isCartAdded < 0 ? null : (
                    <>
                      <button
                        className="--btn"
                        onClick={() => decreaseCart(product)}
                      >
                        -
                      </button>
                      <p>
                        <b>{cart.cartQuantity}</b>
                      </p>
                      <button
                        className="--btn"
                        onClick={() => addToCart(product)}
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="--btn --btn-danger"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </>
        )}
        <Card cardClass={styles.card}>
          <h3>Product Reviews</h3>
          <div>
            {filteredReviews.length === 0 ? (
              <p>There are no reviews for this product yet.</p>
            ) : (
              <>
                {filteredReviews.map((item, index) => {
                  const { rate, review, reviewDate, userName } = item;
                  return (
                    <div key={index} className={styles.review}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>by: {userName}</b>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
export default ProductDetails