import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../shop/SingleBook";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadBook from "../dashboard/UploadBook";
import ManageBook from "../dashboard/ManageBook";
import EditBooks from "../dashboard/EditBooks";
import { createBrowserRouter, Link, useRouteError } from "react-router";

const RouteError = () => {
    const error = useRouteError();
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";

    return (
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Page could not be loaded</h1>
            <p className="mt-3 text-gray-600">{message}</p>
            <Link className="mt-6 inline-block text-blue-700 underline" to="/admin/dashboard">
                Return to dashboard
            </Link>
        </main>
    );
};

const NotFound = () => (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600">Check the address or return to the dashboard.</p>
        <Link className="mt-6 inline-block text-blue-700 underline" to="/admin/dashboard">
            Return to dashboard
        </Link>
    </main>
);

const router = createBrowserRouter([
    {
        path:"/",
        element:<App />,
        errorElement: <RouteError />,
        children:[
        {
            path:'/',
            element:<Home/>,
        },

        {   path:"/shop",
            element:<Shop />,

         },

        {   path:"/about",
            element:<About />,
        },

        {   path:"/blog",
            element:<Blog />,
        },

        {
            path: "/book/:id",
            element: <SingleBook />,
            loader: ({ params }) => fetch(`http://localhost:3000/book/${params.id}`)
        },





]
    },

    {
        path: "/admin/dashboard",
        element: <DashboardLayout />,
        errorElement: <RouteError />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },

            {
                path: "upload",
                element: <UploadBook />,
            },

            {
                path:"manage",
                element:<ManageBook />
            },

            {
                path:"edit-books/:id",
                element:<EditBooks/>,
                loader: ({params})=> fetch(`http://localhost:3000/book/${params.id}`)
            }


        ]

    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
