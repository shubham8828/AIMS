import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Spinner from "../Component/Spinner.jsx"; // Import your Spinner component
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Download from '../asset/download.png'
const PaymentList = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Number of items per page
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // New state for payment status filter

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true); // Start loading
        const email = localStorage.getItem("email");
        const response = await axios.post(
          "http://localhost:4000/api/payment-data",
          { email }
        );
        const fetchedData = response.data.data || [];
        setPaymentData(fetchedData); // Set full payment data
        setFilteredData(fetchedData); // Initially set filtered data to full data
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPaymentData();
  }, []);

  // Search functionality: Update filtered data
  useEffect(() => {
    const lowerCasedSearchTerm = searchTerm.toLowerCase();
    const filtered = paymentData.filter(
      (payment) =>
        (payment.customerName.toLowerCase().includes(lowerCasedSearchTerm) ||
          payment.invoiceId.toLowerCase().includes(lowerCasedSearchTerm) ||
          payment.customerPhone.toLowerCase().includes(lowerCasedSearchTerm) ||
          payment.paymentMethod.toLowerCase().includes(lowerCasedSearchTerm)) &&
        (paymentStatus === "" || payment.paymentStatus === paymentStatus) // Filter by payment status
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when search or status changes
  }, [searchTerm, paymentData, paymentStatus]);

  // Pagination: Get current page payment data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleAction = async (paymentStatus, invoiceId) => {
    if (paymentStatus === "Successful") {
      toast.success("Payment Already Done");
    } else if (paymentStatus === "Pending") {
      await axios
        .post("http://localhost:4000/api/getInvoice", { invoiceId })
        .then((response) => {
          navigate("/payments", { state: response.data.invoice });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

    const downloadTableData = () => {
      // Create a worksheet from the filtered payment data
      const ws = XLSX.utils.json_to_sheet(filteredData.map((payment, index) => ({
        "Sr. No.": startIndex + index + 1,
        "Invoice ID": payment.invoiceId,
        "Customer Name": payment.customerName,
        "Phone": payment.customerPhone,
        "Amount": payment.amount.toFixed(2),
        "Currency": payment.currency,
        "Payment Status": payment.paymentStatus,
        "Payment Date": payment.paymentDate
          ? new Date(payment.paymentDate).toLocaleDateString()
          : "N/A",
        "Payment Method": payment.paymentMethod,
        "Payment ID": payment.paymentId,
        "Card Details": payment.paymentMethod === "Card" && payment.cardDetails
          ? `**** **** **** ${payment.cardDetails.cardNumber.slice(-4)}`
          : "N/A",
      })));
    
      // Create a workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
    
      // Trigger the download
      XLSX.writeFile(wb, "Payment_Data.xlsx");
    };
    

  if (loading) {
    return <Spinner />; // Show spinner while loading
  }

  return (
    <div>
      <div className="payment-top">
        <h1>Payment Details</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by Customer Name, Invoice ID, Phone, or Payment Method"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            className="status-filter"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Successful">Successful</option>
          </select>

          <button
          className="report-download-btn"
          onClick={downloadTableData}
          
        >
          <img src={Download} className="report-download-btn-icon"/>
        </button>
        </div>
        
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Invoice ID</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Payment Status</th>
            <th>Payment Date</th>
            <th>Payment Method</th>
            <th>Payment ID</th>
            <th>Card Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((transaction, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{transaction.invoiceId}</td>
              <td>{transaction.customerName}</td>
              <td>{transaction.customerPhone}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.currency}</td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor:
                    transaction.paymentStatus === "Pending"
                      ? "#f8d7da" // Light red background for Pending
                      : "#d4edda", // Light green background for Done
                  color:
                    transaction.paymentStatus === "Pending"
                      ? "#721c24" // Dark red text for Pending
                      : "#155724", // Dark green text for Done
                  fontWeight: "bold",
                  textAlign: "center", // Center align the text
                  borderRadius: "4px", // Subtle rounding for better design
                }}
              >
                {transaction.paymentStatus}
              </td>
              <td>
                {transaction.paymentDate
                  ? new Date(transaction.paymentDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{transaction.paymentMethod}</td>
              <td>{transaction.paymentId}</td>
              <td>
                {transaction.paymentMethod === "Card" && transaction.cardDetails
                  ? `**** **** **** ${transaction.cardDetails.cardNumber.slice(
                      -4
                    )}`
                  : "N/A"}
              </td>
              <td>
                <button
                  onClick={() =>
                    handleAction(
                      transaction.paymentStatus,
                      transaction.invoiceId
                    )
                  }
                  style={{
                    backgroundColor:
                      transaction.paymentStatus === "Pending"
                        ? "#ff4d4d"
                        : "#28a745", // Red for Pending, Green for Done
                    color: "white", // White text for better contrast
                    border: "none", // Remove border
                    padding: "5px 10px", // Add padding for better design
                    borderRadius: "4px", // Subtle rounding for modern look
                    cursor: "pointer", // Pointer cursor for better UX
                  }}
                >
                  {transaction.paymentStatus === "Pending" ? "Pay" : "Done"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="more">
        <button
          className="previous-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
