<template>
  <v-card elevation="4" style="border-radius: 30px;">
    <v-list-item class="px-5" height="70">   
      <template v-slot:title><v-btn  icon="mdi-format-list-checks" size="x-small" style="margin-top: -10px;"></v-btn>  <span style="font-size:18px;">{{ task.titre }}</span></template>
    </v-list-item>

    <v-divider></v-divider>

    <v-card-text class="text-medium-emphasis pa-6">

      <div class="mb-2" style="margin-top:-7px;"><span>Progrés : </span><span class="text-h5 font-weight-black mb-2">{{ task.pourcentage_avancement }}%</span></div>

      <v-progress-linear
        bg-color="surface-variant"
        class="mb-6"
        color="success"
        height="10"
        :model-value="task.pourcentage_avancement"
        rounded="pill"
      ></v-progress-linear>

      <v-row>
        <!-- Titre à gauche -->
        <v-col cols="4" class="d-flex align-center">
          <span>Debuté le:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="8" class="d-flex justify-end align-center">
          <span>{{ formatDate(task.date_debut) }}</span>
        </v-col>
      </v-row>

      <v-row style="margin-top: -10px;">
        <!-- Titre à gauche -->
        <v-col cols="6" class="d-flex align-center">
          <span><v-icon color="red">mdi-clock-alert</v-icon> Retard:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="6" class="d-flex justify-end align-center">
          <span>{{ task.retard_jours }} jours</span>
        </v-col>
      </v-row>

    </v-card-text>

    <v-card-actions style="margin-top: -10px;">

      <v-chip
                            :color="getStatusColor(task.statut)"
                            small
                            dark
                            class="text-none mx-2 mb-2"
                            slim
                        >
                            {{ task.statut }}
                        </v-chip>
      <v-spacer></v-spacer>
      <v-btn
        class="text-none mx-2 mb-2"
        color="primary"
        text="Voir détails"
        variant="text"
        slim
        rounded
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TaskCard",
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      // Formater la date au format lisible (par exemple, DD/MM/YYYY)
      if (!date) return "Non spécifiée";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("fr-FR", options);
    },
    getStatusColor(status) {
            switch (status) {
                case 'À faire':
                    return 'blue';
                case 'En cours':
                    return 'orange';
                case 'Terminé':
                    return 'green';
                case 'En retard':
                    return 'red';
                default:
                    return 'grey';
            }
        },
  }
};
</script>

<style scoped>
/* Ajoutez des styles spécifiques à la carte des tâches si nécessaire */
.v-card {
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
}
.v-card:hover {
  transform: scale(1.02);
}
</style>
