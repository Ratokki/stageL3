<template>

    <div
      ref="echartPie"
      style="width: 500%; height: 200px; margin-top: -20px; margin-left: -135px"
    ></div>
  
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      pieChartOptions: {
        tooltip: {
          trigger: "item",
        },
        color: ["#58d67ed7", "#9bf560d3", "#b6e9f8"],
        legend: {
          orient: "vertical", // Orienter la légende verticalement
          left: "67%", // Positionner la légende à droite
          top: "center",
        },
        grid: {
          left: "30%", // Aligne le graphique à gauche du card
          right: "10%", // Réserve l'espace pour la légende à droite
          containLabel: true,
        },
        series: [
          {
            name: "Répartition des utilisateurs",
            type: "pie",
            radius: ["30%", "49%"],
            avoidLabelOverlap: false,
            padAngle: 3,
            itemStyle: {
              borderRadius: 5,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "15",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "Employé" },
              { value: 735, name: "Chef de Projet" },
              { value: 580, name: "Partenaire" },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    // Initialisation du graphique circulaire ECharts après le montage du composant
    this.initEchart();
  },
  methods: {
    initEchart() {
      const chartDom = this.$refs.echartPie; // Référence à la div
      const myChart = echarts.init(chartDom); // Initialiser ECharts
      myChart.setOption(this.pieChartOptions); // Définir les options pour ECharts
    },
  },
};
</script>