import { Route, RouterProvider, Routes, createBrowserRouter, defer, redirect } from 'react-router-dom'
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
import { ADMIN_KEY, USER_KEY } from './lib/constsnts'
import { enqueueSnackbar } from 'notistack'
import InProgress from './pages/admin/InProgress'



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

            loader: async () => {
              let user = localStorage.getItem("creatorBotUser")
              user = JSON.parse(user);
              const res = fetch(BASE_URL + "/contents", {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }).then(res => res.json())

              return defer({ contents: res });
            }
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
            index: true,
            element: <AdminStatPage />,
            loader: async () => {
              const data = fetch(BASE_URL + "/admin/dashboard", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(ADMIN_KEY)}`
                }
              }).then(res => res.json()).catch(err => null)

              return defer({ data })
            }
          },
          {
            path: "creators",
            element: <InProgress />,
          },
          {
            path: "contents",
            element: <InProgress />,
          },
          {
            path: "customers",
            element: <InProgress />,
          },

        ],

        loader: () => {
          return localStorage.getItem(ADMIN_KEY);
        }
      },

      {
        path: "auth/admin/login",
        element: <AdminSignIn />,
        loader: async () => {
          if (localStorage.getItem(ADMIN_KEY)) {
            location.replace("/admin")
          }
          return null
        }
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
        element: <CreatorSignup />,
        loader: async () => {
          let user = localStorage.getItem(USER_KEY)
          if (!user) {
            location.replace("/login")
          } else {
            user = JSON.parse(user);
            const data = await fetch(BASE_URL + "/creator", {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }).then(res => res.json()).catch(() => null);

            if (data?.creator) {
              location.replace("/home")
            }
          }
          return user;
        }
      },


      {
        path: "login",
        element: <LoginPage />,
        loader: async () => {
          const searchParams = new URLSearchParams(location.search)

          addEventListener("message", (event) => {
            if (typeof event.data === "string") {
              try {
                const data = JSON.parse(event.data)
                if (data.event === "auth_user") {
                  const params = data.auth_data;
                  params.redirect = searchParams.get("redirect")

                  window.removeEventListener("message", window)
                  const url = location.origin + location.pathname + "?" + new URLSearchParams(params)
                  location.replace(url)
                }
              } catch (error) {
                //do nothing
                console.log(error)
              }
            }
          })
          if (searchParams.has("id")) {
            const res = await fetch(BASE_URL + "/auth/login?" + searchParams)
              .then(res => res.json())
            if (res.status) {
              localStorage.setItem(USER_KEY, JSON.stringify(res.user));
              location.replace("/" + searchParams.get("redirect"))
            } else {
              enqueueSnackbar({
                message: res.message,
                variant: "error"
              })
              location.replace("/login")
            }
            return true;
          }
          return null
        }
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
