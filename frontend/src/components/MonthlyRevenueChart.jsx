import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

// Înregistrăm modulele
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyRevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => `${item.luna}/${item.an}`),
    datasets: [
      {
        label: "Monthly Revenue",
        data: data.map((item) => parseFloat(item.venit_total)), // Conversie explicită
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month/Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

MonthlyRevenueChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      luna: PropTypes.number.isRequired,
      an: PropTypes.number.isRequired,
      venit_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired, // Accept string sau number
    })
  ).isRequired,
};

export default MonthlyRevenueChart;
