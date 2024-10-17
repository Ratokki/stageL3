<template>
<div>
  <v-img src="../assets/Fiantso.png" width="130" style="margin: 25px 10px -40px 40px"></v-img>
  
  <v-container class="mt-8">
    <v-row no-gutters justify="center" align="center"> 
      <v-col cols="12" md="4" order="1" class="pa-4 text-center">
   
        <RegisterCompo />
        
      </v-col>    
      <v-col cols="12" md="5" order="6" class="pa-4 text-center">
        <v-img 
            alt="auction logo"
            class="mt-2 mx-auto"
            contain
            src="../assets/imgAccueil.png"
            transition="scale-transition"
            width="550" 
            style="margin-top: 20px;"           
          /> 
      </v-col>
            
    </v-row>
  </v-container>
</div>
</template>

<script>
import RegisterCompo from "@/components/RegisterCompo.vue";

export default {

  data() {
    return {
      isSmallScreen: false,
    };
  },
  created() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth < 600;
    },
  },
  components: { RegisterCompo },
};
</script>

<style scoped>
.shrink {
  display: none;
}
</style>

<!--

<v-col cols="12" md="6">
        
        <center v-if="!isSmallScreen">
          <v-img
            alt="auction logo"
            class="mt-2"
            contain
            src="../assets/img.png"
            transition="scale-transition"
            width="400"
            style="margin-right: 60px"
          />
        </center>
      </v-col>
      <v-col cols="12" md="6">
        <LoginCompo />
      </v-col>

-->
