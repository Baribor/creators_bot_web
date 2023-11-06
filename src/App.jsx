import { RouterProvider, createBrowserRouter, defer } from 'react-router-dom'
import './App.css'
import CreatorSignup from './pages/SignupPage'
import MainLayout from './components/MainLayout'
import StatPage from './pages/StatPage'
import AdminSignIn from './pages/admin/SigninPage'
import MyContentsPage from './pages/ContentPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminStatPage from './pages/admin/StatPage'
import LoginPage from './pages/LoginPage'
import PublishContent from './pages/PublishContent'
import AboutContentPage from './pages/AboutContentPage'
import { BASE_URL } from './states'
import { ADMIN_KEY, USER_KEY } from './lib/constsnts'
import { enqueueSnackbar } from 'notistack'
import CreatorsStatPage from './pages/admin/CreatorsPage'
import CustomersStatPage from './pages/admin/CustormersPage'
import ContentsStatPage from './pages/admin/ContentsPage'
import SettingsPageRoot from './pages/SettingsPage'



const routes = [
  {
    path: "/",
    children: [

      /* Main application */
      {
        path: "home/",
        element: <MainLayout />,
        loader: async () => {
          const token = localStorage.getItem("creatorBotUser");
          if (token) {

            try {
              const res = await fetch(BASE_URL + "/creator", {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              }).then(res => res.json());

              if (res.status) {
                return (res.creator);
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
            element: <SettingsPageRoot />,
          },
          {
            path: "contents",
            element: <MyContentsPage />,

            loader: async () => {
              let token = localStorage.getItem("creatorBotUser")
              const res = fetch(BASE_URL + "/contents", {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).then(res => res.json());

              return defer({ contents: res });
            }
          },
          {
            path: "create",
            element: <PublishContent />,
            loader: async () => {
              const token = localStorage.getItem(USER_KEY);

              const data = fetch(BASE_URL + "/creator/subs", {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).then(res => res.json())
                .catch(err => null);

              return defer({ data });
            }
          },
          {
            path: "",
            element: <StatPage />,
            index: true,
            loader: async () => {
              const token = localStorage.getItem(USER_KEY);

              const data = fetch(BASE_URL + "/creator/stats", {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).then(res => res.json())
                .catch(err => null);

              return defer({ data });
            }
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
            element: <CreatorsStatPage />,
            loader: async () => {
              const data = fetch(BASE_URL + "/admin/creators", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(ADMIN_KEY)}`
                }
              }).then(res => res.json()).catch(err => null)
              return defer({ data })
            }
          },
          {
            path: "contents",
            element: <ContentsStatPage />,
            loader: async () => {
              const data = fetch(BASE_URL + "/admin/contents", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(ADMIN_KEY)}`
                }
              }).then(res => res.json()).catch(err => null)
              return defer({ data })
            }
          },
          {
            path: "customers",
            element: <CustomersStatPage />,
            loader: async () => {
              const data = fetch(BASE_URL + "/admin/customers", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(ADMIN_KEY)}`
                }
              }).then(res => res.json()).catch(err => null)
              return defer({ data })
            }
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
            try {
              user = JSON.parse(user);
              return user;
            } catch (err) {
              location.replace("/home")
              return null;
            }
          }
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
                  const redirect = searchParams.get("redirect");
                  params.redirect = redirect ? redirect : "home"

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
              localStorage.setItem(USER_KEY, res.user ? JSON.stringify(res.user) : res.token);
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
