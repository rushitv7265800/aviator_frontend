import React, { useState } from "react";
import PaymantAll from '../assets/Image/paymantAll.png'
import axios from "axios";
export default function DepositFundPage() {
    const [amount, setAmount] = useState(100)
    const [error, setError] = useState('');
    const [orderDetails, setOrderDetails] = useState({
        orderId: null,
        currency: null,
        receipt: null,
        amount: null,
    });

    
    const handleCreateOrder = async (price, currency, amount,) => {
        const amountAdd = price * 100
        axios.post('https://aviator-backend-945q.onrender.com/razorpay/create-order', { amount: amountAdd, receipt: `${amount + "Coin Purchase"}` })
            .then(response => {
                setOrderDetails({
                    ...orderDetails,
                    orderId: response.data?.order?.id
                })
                var options = {
                    "key": "rzp_test_HQF5r9XZ9o5lVJ",
                    // "key_secret": "scvW6xIBUqOv2e4khSxr3D8k",
                    "amount": price,
                    "currency": "INR",
                    "name": "Test",
                    "description": `${amount + "Coin Purchase"}`,
                    "order_id": orderDetails?.orderId,
                    handler: function (response) {
                        alert(response.razorpay_payment_id);
                    },
                    "prefill": {
                        "name": "Test",
                        "email": "test@gmail.com",
                        "contact": "1111111111",
                    },
                    "notes": {
                        "address": "note value",
                    },
                    "theme": {
                        "color": "#F37254"
                    }
                };

                var rzp1 = new window.Razorpay(options)
                rzp1.open();
            })
    }
    const handleChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            const numValue = parseInt(value);
            if (numValue < 100) {
                setError('Amount must be at least 100.');
                setAmount(100);
            } else if (numValue > 10000) {
                setError('Amount must not exceed 10,000.');
                setAmount(10000);
            } else {
                setError('');
                setAmount(numValue);
            }
        } else {
            setError('Please enter a valid number.');
        }
    };
    return (
        <>
            <div className="dipositPage">
                <h6>Deposit Fund</h6>
                <div className="boxDeposit">
                    <div className="showBox">
                        <img src={PaymantAll} />
                    </div>
                    <div className="showBoxPayment">
                        <h6>Minimum:<span>100</span></h6>
                        <div className="showButtomAmount">
                            <div className="showAmount">
                                <label>
                                    <input type="text" onChange={handleChange} />
                                    <span>INR</span>
                                </label>
                            </div>
                            <button onClick={()=>handleCreateOrder()}>Deposit</button>
                        </div>
                        {error && <h5>{error}</h5>}
                        <div className="showAmoutChip">
                            <h4 onClick={() => setAmount(500)} className={`${amount === 500 && "activeShowAmount"}`}>500</h4>
                            <h4 onClick={() => setAmount(1000)} className={`${amount === 1000 && "activeShowAmount"}`}>1000</h4>
                            <h4 onClick={() => setAmount(3000)} className={`${amount === 3000 && "activeShowAmount"}`}>3000</h4>
                            <h4 onClick={() => setAmount(5000)} className={`${amount === 5000 && "activeShowAmount"}`}>5000</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}