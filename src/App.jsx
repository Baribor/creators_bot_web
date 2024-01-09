import { Outlet, RouterProvider, createBrowserRouter, defer } from 'react-router-dom'
import './App.css'
import AdminSignIn from './pages/admin/SigninPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminStatPage from './pages/admin/StatPage'
import AboutContentPage from './pages/AboutContentPage'
import { BASE_URL } from './states'
import { ADMIN_KEY } from './lib/constants'
import CreatorsStatPage from './pages/admin/CreatorsPage'
import CustomersStatPage from './pages/admin/CustormersPage'
import ContentsStatPage from './pages/admin/ContentsPage'
//import SettingsPageRoot from './pages/SettingsPage'
import WithdrawalPageRoot from './pages/admin/WithdrawalRequests'
import MyContentsPage from './pages/ContentPage'
import ContentDetailPage from './pages/admin/ContentDetails'
import VerificationPage from './pages/admin/VerificationPage'
import VerificationDetail from './pages/admin/VerificationDetail'
import ContentDetails from './pages/ContentDetails'
import Checkout from './pages/CheckoutPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import CheckoutLayout from './components/CheckoutLayout'



const routes = [
  {
    path: "/",
    children: [

      /* Admin Application */
      {
        path: "admin/",
        element: <AdminLayout />,
        loader: () => {
          return localStorage.getItem(ADMIN_KEY);
        },

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
            },

          },

          {
            path: "content/detail/:content_id",
            element: <ContentDetailPage />,
            loader: async ({ params }) => {
              const data = fetch(BASE_URL + `/admin/content?content_id=${params.content_id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(ADMIN_KEY)}`
                }
              }).then(res => res.json()).catch(err => null)
              return defer({ data })
            },
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
          {
            path: "verification",
            element: <VerificationPage />,
          },
          {
            path: "verification/detail",
            element: <VerificationDetail />
          },
          {
            path: "withdrawal_requests",
            element: <WithdrawalPageRoot />,
          },

        ],

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
        path: "contents/:creatorId",
        element: <MyContentsPage />
      },
      {
        path: "contents/:creatorId/details",
        element: <ContentDetails />
      },

      {
        path: "checkout",
        element: <CheckoutLayout />,
        children: [
          {
            path: "",
            element: <Checkout />,
            index: true
          },
          {
            path: "success",
            element: <PaymentSuccess />
          },
          {
            path: "cancel",
            element: <PaymentCancel />
          },
        ]

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
