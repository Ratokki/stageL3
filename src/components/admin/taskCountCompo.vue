<template>
<v-row>
<v-col cols="12" sm="5">
<div
    ref="echartPie"
    style="width: 500%; height: 200px; margin-top: -40px; margin-left: -150px;"
  ></div>
</v-col>
 </v-row> 
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  data() {
    return {
      pieChartOptions: {
        tooltip: {
          trigger: "item",
        },
        color: ["#58d67ed7", "#9bf560d3", "#b6e9f8"],
        legend: {
          orient: "vertical",
          left: "67%",
          top: "center",
        },
        grid: {
          left: "30%",
          right: "10%",
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
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.fetchUserData(); // Appeler la méthode pour récupérer les données
  },
  methods: {
    async fetchUserData() {
  try {
    const response = await axios.get('http://localhost:5000/admin/countUser');
    const counts = response.data;

    this.pieChartOptions.series[0].data = [
      { value: counts.find(role => role.role === 'Employé')?.count || 0, name: "Employé" },
      { value: counts.find(role => role.role === 'Chef de projet')?.count || 0, name: "Chef de Projet" },
    ];

    this.initEchart();
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
},
    initEchart() {
      const chartDom = this.$refs.echartPie;
      const myChart = echarts.init(chartDom);
      myChart.setOption(this.pieChartOptions);
    },
  },
};
</script>
