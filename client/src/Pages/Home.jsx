import React, { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Download from '../asset/download.png'
import Chart from "../Component/Chart.jsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Typing from "../Component/Typing.jsx";
import Spinner from "../Component/Spinner.jsx";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  // Fetch invoice data
  const getData = async () => {
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:4000/api/invoices", {
        email: localStorage.getItem("email"),
      });
      setInvoices(response.data.invoices);
      getOverAllTotal(response.data.invoices);
      getMonthsTotal(response.data.invoices);
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.error("Error fetching data:", error);
    }
    
  };

  // Calculate total amount from all invoices
  const getOverAllTotal = (invoiceList) => {
    const overallTotal = invoiceList.reduce((acc, curr) => acc + curr.total, 0);
    setTotal(overallTotal);
  };

  // Calculate this month's total
  const getMonthsTotal = (invoiceList) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthTotal = invoiceList
      .filter((invoice) => {
        const invoiceDate = invoice.date.seconds
          ? new Date(invoice.date.seconds * 1000)
          : new Date(invoice.date);
        return (
          invoiceDate.getMonth() === currentMonth &&
          invoiceDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, curr) => acc + curr.total, 0);
    setTotalMonthCollection(monthTotal);
  };

  // Calculate month-wise data for the chart
  const calculateMonthWiseData = (invoices) => {
    const monthWiseData = {};
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    invoices.forEach((invoice) => {
      const date = invoice.date.seconds
        ? new Date(invoice.date.seconds * 1000)
        : new Date(invoice.date);
      const monthName = monthNames[date.getMonth()];

      if (!monthWiseData[monthName]) {
        monthWiseData[monthName] = { invoiceCount: 0, totalPrice: 0 };
      }

      monthWiseData[monthName].invoiceCount += 1;
      monthWiseData[monthName].totalPrice += invoice.total;
    });

    return monthWiseData;
  };

  const dynamicMonthData = calculateMonthWiseData(invoices);

  // Static chart data with default values
  const chartData = [
    { month: "January", invoiceCount: 20, totalPrice: 5000 },
    { month: "February", invoiceCount: 10, totalPrice: 7000 },
    { month: "March", invoiceCount: 5, totalPrice: 1000 },
    { month: "April", invoiceCount: 50, totalPrice: 70000 },
    { month: "May", invoiceCount: 2, totalPrice: 20000 },
    { month: "June", invoiceCount: 10, totalPrice: 50000 },
    { month: "July", invoiceCount: 50, totalPrice: 60000 },
    { month: "August", invoiceCount: 9, totalPrice: 4000 },
    { month: "September", invoiceCount: 10, totalPrice: 80000 },
    { month: "October", invoiceCount: 20, totalPrice: 700 },
    { month: "November", invoiceCount: 10, totalPrice: 9000 },
    { month: "December", invoiceCount: 40, totalPrice: 1000 },
  ];

  // Merge dynamic data into static chartData
  const mergedData = chartData.map((monthData) => {
    const month = monthData.month;
    if (dynamicMonthData[month]) {
      return {
        ...monthData,
        invoiceCount: dynamicMonthData[month].invoiceCount,
        totalPrice: dynamicMonthData[month].totalPrice,
      };
    }
    return monthData;
  });

  // Format currency values
  const formatCurrency = (value) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const handleInvoiceClick = (invoice) => {
    navigate("/invoice-details", { state: invoice });
  };

  useEffect(() => {

    getData();

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

  }, []);

  // report Download

  const reportDownload = () => {
    setLoading(true)
    const element = document.querySelector(".home-container");
  
    if (element) {
      html2canvas(element, {
        scale: 2, // Increase resolution for better quality
        useCORS: true, // Handle cross-origin issues for external assets
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
  
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
  
        const imgHeightInPDF = (pdfWidth * canvasHeight) / canvasWidth;
        let currentHeight = 0;
  
        // Loop through the height of the canvas to ensure elements fit fully on pages
        while (currentHeight < canvasHeight) {
          const pageHeightInCanvas = (pdfHeight * canvasWidth) / pdfWidth;
  
          const croppedCanvas = document.createElement("canvas");
          croppedCanvas.width = canvasWidth;
          croppedCanvas.height = pageHeightInCanvas;
  
          const context = croppedCanvas.getContext("2d");
  
          // Draw only the part that fits on one page
          context.drawImage(
            canvas,
            0,
            currentHeight,
            canvasWidth,
            pageHeightInCanvas,
            0,
            0,
            canvasWidth,
            pageHeightInCanvas
          );
  
          const croppedImgData = croppedCanvas.toDataURL("image/png");
  
          if (currentHeight > 0) pdf.addPage();
          pdf.addImage(croppedImgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  
          // Move to the next page
          currentHeight += pageHeightInCanvas;
  
          // Adjust to avoid splitting elements (snap to an element boundary if needed)
          const nextElementBoundary = Math.floor(currentHeight);
          currentHeight = nextElementBoundary;
        }
  
        pdf.save("Dashboard_Report.pdf");
        setLoading(false)
      });
    }
  };
  

  return (
    <>
      {loading && <Spinner />} 

    <div className="home-container">
      <Typing />
      <div className="home-first-row">
        <div className="home-box box-1">
          <h1>Rs. {formatCurrency(total)}</h1>
          <p>Overall Total</p>
        </div>
        <div className="home-box box-2">
          <h1>{invoices.length}</h1>
          <p>Total Invoices</p>
        </div>
        <div className="home-box box-3">
          <h1>Rs. {formatCurrency(totalMonthCollection)}</h1>
          <p>This Month's Collection</p>
        </div>
      </div>

      <Chart data={mergedData} />

      <div className="home-second-row">
        <div className="recent-invoice-list">
          <h3>Top 10 Customer List</h3>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .sort((a, b) => b.total - a.total) // Sort invoices by 'total' in descending order
                .slice(0, 10) // Get the top 10 invoices after sorting
                .map((data, index) => {
                  const dateObj = data.date.seconds
                    ? new Date(data.date.seconds * 1000)
                    : new Date(data.date);
                  return (
                    <tr
                      key={index}
                      onClick={() => handleInvoiceClick(data)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{data.invoiceId}</td>
                      <td>{data.to}</td>
                      <td>{formatCurrency(data.total)}</td>
                      <td>
                        {!isNaN(dateObj)
                          ? dateObj.toLocaleDateString()
                          : "Invalid Date"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="report-download-btn"
        onClick={reportDownload}
        style={{ display: "none" }} // Initially hidden
      >
        <img src={Download} className="report-download-btn-icon"/>
      </button>
    </div>
    </>
  );
};

export default Home;
