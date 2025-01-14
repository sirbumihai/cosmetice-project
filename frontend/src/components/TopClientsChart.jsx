import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

const TopClientsChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.username),
    datasets: [
      {
        label: "Total Orders",
        data: data.map((item) => Number(item.total_comenzi)), // Conversie explicită
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
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
          text: "Clients",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Orders",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

TopClientsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      total_comenzi: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired, // Acceptă string sau number
    })
  ).isRequired,
};

export default TopClientsChart;
