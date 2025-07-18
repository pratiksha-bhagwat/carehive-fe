import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaMoneyBillWave } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';

const PaymentScreen = () => {
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [upiId, setUpiId] = useState('');
    const [services, setServices] = useState({});
    const bookingId = sessionStorage.getItem("bookingId");
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const paymentMethodAnim = useSpring({
        opacity: paymentMethod ? 1 : 0,
        transform: paymentMethod ? 'translateY(0px)' : 'translateY(-20px)',
    });

    // Fetch Services Data
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get("/service/list", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const serviceData = response.data.reduce((acc, service) => {
                    acc[service.serviceId] = service.serviceTitle;
                    return acc;
                }, {});
                setServices(serviceData);
            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error("Failed to fetch services.");
            }
        };

        const fetchBookingDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookingDetails(response.data);
                console.log(response.data);
            } catch (error) {
                toast.error('Failed to fetch booking details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchServices();
            fetchBookingDetails();
        }
    }, [bookingId, token]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success('Payment successful!');
            navigate('/success-payment');
        } catch {
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!bookingDetails) {
        return <div className="text-center py-10 text-gray-600">Booking not found.</div>;
    }

    const { serviceId, price, bookingId: bId, bookingHrs } = bookingDetails;

    const yearOptions = [];
    const monthOptions = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 10; i++) {
        yearOptions.push(`${(currentYear + i).toString().slice(-2)}`);
    }

    for (let month = 1; month <= 12; month++) {
        const monthString = month < 10 ? `0${month}` : `${month}`;
        monthOptions.push(monthString);
    }

    // Price Calculation
    const calculatedTotal = price * bookingHrs;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-gray-300 flex justify-center items-center py-8">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all hover:scale-105 hover:shadow-2xl">
                {/* Header */}
                <h1 className="text-2xl font-medium text-gray-700 mb-4 text-center tracking-wide">
                    Booking Bill - Payment Details
                </h1>

                {/* Bill Details Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-5">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Bill Summary</h2>

                    {/* Booking Info */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span><strong>Booking ID:</strong></span>
                            <span>{bId}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span><strong>Service:</strong></span>
                            <span>{services[serviceId] || "Unknown Service"}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span><strong>Booking Hours:</strong></span>
                            <span>{bookingHrs} hours</span>
                        </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span><strong>Price per Hour:</strong></span>
                            <span>₹{price}</span>
                        </div>

                        {/* Price Calculation */}
                        <div className="flex justify-between text-lg font-semibold text-green-600 bg-green-50 p-3 rounded-lg mt-3 shadow-sm">
                            <span><strong>Total Price:</strong></span>
                            <span>₹{calculatedTotal}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selector Section */}
                <div className="mb-5">
                    <p className="text-sm text-gray-600 font-medium mb-2">Select Payment Method:</p>
                    <div className="space-y-3">
                        <label
                            className={`flex items-center space-x-3 cursor-pointer ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'} transition-colors hover:text-blue-700`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="form-radio"
                            />
                            <FaCreditCard className="text-blue-500 text-lg" />
                            <span>Credit/Debit Card</span>
                        </label>

                        <label
                            className={`flex items-center space-x-3 cursor-pointer ${paymentMethod === 'upi' ? 'text-indigo-600' : 'text-gray-600'} transition-colors hover:text-indigo-700`}
                            onClick={() => setPaymentMethod('upi')}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="upi"
                                checked={paymentMethod === 'upi'}
                                onChange={() => setPaymentMethod('upi')}
                                className="form-radio"
                            />
                            <FaPaypal className="text-indigo-600 text-lg" />
                            <span>UPI</span>
                        </label>

                        <label
                            className={`flex items-center space-x-3 cursor-pointer ${paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-600'} transition-colors hover:text-green-700`}
                            onClick={() => setPaymentMethod('cod')}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="form-radio"
                            />
                            <FaMoneyBillWave className="text-green-500 text-lg" />
                            <span>Cash on Delivery (COD)</span>
                        </label>
                    </div>
                </div>

                {/* Animated Form Section based on selected payment method */}
                <animated.div style={paymentMethodAnim}>
                    {paymentMethod === 'card' && (
                        <div className="space-y-4 mb-5">
                            <div className="flex flex-col space-y-3">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    disabled={loading}
                                />
                                <div className="flex space-x-3">
                                    <div className="w-1/2">
                                        <select
                                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="" disabled>Select Year</option>
                                            {yearOptions.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2">
                                        <select
                                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="" disabled>Select Month</option>
                                            {monthOptions.map((month) => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    placeholder="CVV"
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'upi' && (
                        <div className="space-y-4 mb-5">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Enter UPI ID"
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    disabled={loading}
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'cod' && (
                        <div className="mb-5">
                            <p className="text-sm text-gray-600">Pay at the time the service is completed</p>
                        </div>
                    )}
                </animated.div>

                {/* Payment Button Section */}
                <div className="text-center mt-4">
                    <button
                        onClick={handlePayment}
                        className={`w-full p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 shadow-lg'} `}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentScreen;
