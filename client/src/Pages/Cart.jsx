import React, { useState } from 'react'
import { showcart, addcart, lesscart } from './apicall'
import Wrapper from '../Common/Wrapper';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const userId = localStorage.getItem("userid");
    const [cartdata, setcartData] = useState([])
    const [isLoading, setisLoading] = useState(true);

    const getData = async () => {
        const response = await showcart(userId);
        console.log("Cart response...", response);
        setcartData(response);
        setisLoading(false);
    }


    useEffect(() => {
        getData(userId);
    }, [])


    // Handle for add to cart
    const handleAddToCart = async (productId) => {
        const data = { userId, productId };
        await addcart(data);
        getData();
    };

    // Handle for less to cart
    const handleLessToCart = async (productId) => {
        const data = { userId, productId, quantity: 1 };
        await lesscart(data); // Using the addcart function you defined earlier
        getData();
    };

    if (isLoading) {
        return <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Loading...</h1>
    }

    return (
        <>
            <Wrapper>
                <div style={{ marginTop: '100px' }}>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Image</th>
                                <th scope="col">Product</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Action</th>
                                <th scope="col">Total price</th>
                            </tr>
                        </thead>
                        <tbody>

                            {cartdata && cartdata.length > 0 ? (
                                Array.isArray(cartdata) && cartdata
                                    .slice(0, cartdata.length)
                                    .reverse()
                                    .map((value) => (
                                        <tr key={value?.productId}>
                                            <th scope="row">1</th>
                                            <td>
                                                <img
                                                    src={`${process.env.REACT_APP_BASE_URL}${value?.image}`}
                                                    alt=""
                                                    style={{ height: '80px' }}
                                                />
                                            </td>
                                            <td>{value?.name}</td>
                                            <td>{value?.price}</td>
                                            <td>{value?.quantity}</td>
                                            <td>
                                                <button onClick={() => handleAddToCart(value?.productId)}>+</button>{' '}
                                                <button onClick={() => handleLessToCart(value?.productId)}>-</button>
                                            </td>
                                            <td>{value?.totalprice}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        No cart items found.
                                    </td>
                                </tr>
                            )}


                        </tbody>
                    </table>
                </div>

            </Wrapper>
        </>
    )
}

export default Cart
