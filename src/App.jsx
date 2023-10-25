import { Route, RouterProvider, Routes, createBrowserRouter, redirect } from 'react-router-dom'
import './App.css'
import CreatorSignup from './pages/SignupPage'
import MainLayout from './components/MainLayout'
import StatPage from './pages/StatPage'
import SettingsPage from './pages/SettingsPage'
import AdminSignIn from './pages/admin/SigninPage'
import MyContentsPage from './pages/ContentPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminStatPage from './pages/admin/StatPage'
import CreatorsPage from './pages/admin/CreatorsPage'
import LoginPage from './pages/LoginPage'
import PublishContent from './pages/PublishContent'
import AboutContentPage from './pages/AboutContentPage'
import { BASE_URL } from './states'

const routes = [
  {
    path: "/",
    children: [

      /* Main application */
      {
        path: "home/",
        element: <MainLayout />,
        loader: async () => {
          const u = localStorage.getItem("creatorBotUser");
          if (u) {
            const cu = JSON.parse(u);

            try {
              const res = await fetch(BASE_URL + "/creator", {
                headers: {
                  Authorization: `Bearer ${cu.token}`,
                }
              }).then(res => res.json());
              console.log(res)
              if (res.status) {
                return ({ ...res.creator, token: cu.token });
              } else {
                localStorage.removeItem("creatorBotUser");
                location.replace("/login")
              }
            } catch (err) {
              localStorage.removeItem("creatorBotUser");
              location.replace("/login")
            }
          } else {
            location.replace("/login")

          }
          return null;
        },
        children: [
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "contents",
            element: <MyContentsPage />,
          },
          {
            path: "create",
            element: <PublishContent />,
          },
          {
            path: "",
            element: <StatPage />,
            index: true
          },
        ]
      },


      /* Admin Application */
      {
        path: "admin/",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminStatPage />
          },
          {
            path: "creators",
            element: <CreatorsPage />
          },
          {
            path: "signin",
            element: <AdminSignIn />
          },
        ]
      },


      {
        path: "content/:contentId",
        element: <AboutContentPage />,
        loader: async ({ params }) => {
          let content = await fetch(BASE_URL + `/content?contentId=${params.contentId}`).then(res => res.json())
            .catch(() => null);

          return content?.content;
        }
      },


      {
        path: "register",
        element: <CreatorSignup />
      },


      {
        path: "login",
        element: <LoginPage />
      },

    ]
  }
]

const router = createBrowserRouter(routes)

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
