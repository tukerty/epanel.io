<script>
import { Bar } from "vue-chartjs";

export default {
  name: "PingChart",
  extends: Bar,
  data() {
    return {
      chartData: {
        labels: ["January", "February"],
        datasets: [
          {
            label: "GitHub Commits",
            backgroundColor: "#f87979",
            data: [40, 20]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
};
</script>
