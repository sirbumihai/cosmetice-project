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

// Înregistrăm modulele pentru ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const OrdersByYearChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => `User: ${item.username}`),
    datasets: [
      {
        label: "Order Total",
        data: data.map((item) => parseFloat(item.total)),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
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
          text: "Orders",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

OrdersByYearChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      comanda_id: PropTypes.number.isRequired,
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      username: PropTypes.string,
    })
  ).isRequired,
};

export default OrdersByYearChart;
