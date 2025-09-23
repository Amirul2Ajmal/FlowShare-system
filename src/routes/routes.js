import Login from "@/pages/Login.vue";
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Icons from "@/pages/Icons.vue";
import Notifications from "@/pages/Notifications.vue";

const routes = [
  // 🔹 Login is OUTSIDE DashboardLayout
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  // 🔹 Dashboard and other pages use DashboardLayout
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/login",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons,
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
    ],
  },
];

export default routes;
