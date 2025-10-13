<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Task Type">{{ item.TaskType }}</md-table-cell>
        <md-table-cell md-label="Country">{{ item.country }}</md-table-cell>
        <md-table-cell md-label="Task Post by">{{
          item.TaskPostBy
        }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "ordered-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selected: [],
      users: [
        {
          id: 1,
          name: "Dakota Rice",
          TaskType: "Delivery",
          country: "Kota Kinabalu",
          TaskPostBy: "Admin",
        },
        {
          id: 2,
          name: "Minerva Hooper",
          TaskType: "Installation",
          country: "Lahad Datu",
          TaskPostBy: "Admin",
        },
        {
          id: 3,
          name: "Sage Rodriguez",
          TaskType: "Ordering",
          country: "Papar",
          TaskPostBy: "Admin",
        },
        {
          id: 4,
          name: "Philip Chaney",
          TaskType: "Installation",
          country: "Labuan",
          TaskPostBy: "Admin",
        },
      ],
    };
  },
};
</script>
