import Login from './pages/login/Login'
import './App.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
const router = createBrowserRouter([

  {
    path: "/Login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/",
    Component: Dashboard,
  },
]);

  return <RouterProvider router={router}/>
}

export default App
