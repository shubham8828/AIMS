import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Download from "../asset/download.png";
import * as XLSX from "xlsx";
import Spinner from "../Component/Spinner";
const Invoices = () => {
  const [allInvoices, setAllInvoices] = useState([]); // Holds all invoices
  const [filteredInvoices, setFilteredInvoices] = useState([]); // Holds filtered invoices
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoice, setInvoice] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 50;

  // Fetch all invoices once from the backend
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("email");
      const response = await axios.post("http://localhost:4000/api/invoices", {
        email,
      });
      const fetchedInvoices = response.data.invoices;
      setInvoice(fetchedInvoices);
      setLoading(false);
      // Sort invoices in LIFO order (most recent first)
      const sortedInvoices = fetchedInvoices.reverse();

      setAllInvoices(sortedInvoices);
      setFilteredInvoices(sortedInvoices); // Initially set filtered invoices to all invoices
    } catch (error) {
      setLoading(false);

      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle invoice deletion
  const deleteInvoice = async (id) => {
    console.log(id);
    setLoading(true);
  
    try {
      // Sending `id` as a URL parameter
      await axios
        .delete(`http://localhost:4000/api/delete/${id}`)
        .then((res) => {
          toast.success(res.data.msg, { position: "top-center" });
          setAllInvoices(allInvoices.filter((invoice) => invoice._id !== id));
          setFilteredInvoices(
            filteredInvoices.filter((invoice) => invoice._id !== id)
          );
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      toast.error("Internal Server Error", { position: "top-center" });
    }
  };
  

  // Filter invoices by name based on the search term
  useEffect(() => {
    const results = allInvoices.filter((invoice) =>
      invoice.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(results);
    setCurrentPage(1); // Reset to first page when search term changes

    const handleScroll = () => {
      const button = document.querySelector(".report-download-btn");
      if (window.scrollY > window.innerHeight) {
        button.style.display = "flex"; // Show the button
      } else {
        button.style.display = "none"; // Hide the button
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [searchTerm, allInvoices]);

  // Pagination: Get current page invoices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Handle next page click
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handle previous page click
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  // Download customer and product data in Excel format
  const downloadCustomerData = (invoices) => {
    setLoading(true);

    if (!Array.isArray(invoices) || invoices.length === 0) {
      console.error("No invoices found.");
      return;
    }

    // Extract customer details
    const customerData = invoices.map((invoice) => ({
      "Invoice ID": invoice.invoiceId || "N/A",
      Name: invoice.to || "N/A",
      Email: invoice.email || "N/A",
      Phone: invoice.phone || "N/A",
      Address: invoice.address || "N/A",
      Date: new Date(invoice.date).toLocaleDateString() || "N/A",
      Total: invoice.total || 0,
    }));

    // Extract product details from all invoices
    const productData = invoices.flatMap((invoice, index) =>
      (invoice.products || []).map((product, productIndex) => ({
        Product_id: index + 1,
        "Invoice ID": invoice.invoiceId || "N/A",
        "Product Name": product.name || "N/A",
        Price: product.price || 0,
        Quantity: product.quantity || 0,
        "Total Price": product.totalPrice || 0,
      }))
    );

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert customer and product data to worksheets
    const customerSheet = XLSX.utils.json_to_sheet(customerData);
    const productSheet = XLSX.utils.json_to_sheet(productData);

    // Append sheets to the workbook
    XLSX.utils.book_append_sheet(wb, customerSheet, "Customer Info");
    XLSX.utils.book_append_sheet(wb, productSheet, "Product Info");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `Customer_Data.xlsx`);
    setLoading(false);
  };

  return (
    <>
      {loading && <Spinner />} {/* Show spinner if loading is true */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="invoices-table-container">
        {currentInvoices.length > 0 ? (
          <table
            style={{
              minWidth: "93vw",
              borderCollapse: "collapse",
              margin: "20px 0px",
            }}
          >
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Invoice ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((data, index) => {
                const serialNumber = startIndex + index + 1;
                return (
                  <tr key={data._id || index}>
                    <td>{serialNumber}</td>
                    <td>{data.invoiceId}</td>
                    <td>{data.to}</td>
                    <td>{new Date(data.date).toLocaleDateString()}</td>
                    <td>Rs. {data.total.toFixed(2)}</td>
                    <td>{data.address}</td>
                    <td>{data.phone}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteInvoice(data._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button
                        onClick={() =>
                          navigate("/invoice-details", { state: data })
                        }
                        className="view-btn"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-invoice-wrapper">
            <p>No invoices match your search criteria.</p>
            <button onClick={() => navigate("/new-invoice")}>
              Create New Invoice
            </button>
          </div>
        )}
      </div>
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
      <button
        className="report-download-btn"
        onClick={() => downloadCustomerData(invoice)}
      >
        <img
          src={Download}
          className="report-download-btn-icon"
          alt="Download Report"
        />
      </button>
    </>
  );
};

export default Invoices;
