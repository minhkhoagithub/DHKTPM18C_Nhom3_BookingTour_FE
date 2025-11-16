import { Route, Router, Routes } from "react-router-dom"
import Home from "../pages/home/Home"
import About from "../pages/about/About"
import Contact from "../pages/contact/Contact"
import Blog from "../pages/blog/Blog"
import MainLayout from "../layouts/MainLayout"
import NotFound from "../pages/NotFound"
import AdminLayout from "../layouts/AdminLayout"
import DashboardMain from "../components/DashboardMain"
import ToursAdmin from "../components/ToursAdmin"
import BookingsAdmin from "../components/admin/BookingsAdmin"
import UsersAdmin from "../components/admin/UsersAdmin"
import PromotionsAdmin from "../components/admin/PromotionsAdmin"
import DeparturesAdmin from "../components/admin/DeparturesAdmin"
import PaymentsAdmin from "../components/admin/PaymentsAdmin"
import InvoicesAdmin from "../components/admin/InvoicesAdmin"
import PricePoliciesAdmin from "../components/admin/PricePoliciesAdmin"
import SettingsAdmin from "../components/admin/SettingsAdmin"
import Login from "../pages/authen/Login"
import Register from "../pages/authen/Register"
import ArticlesAdmin from "../components/admin/Articles";
import ReviewsAdmin from "../components/admin/Reviews";
import TourDetail from "../pages/tour/TourDetail"
import ToursList from "../pages/tour/ToursList"
export default function AppRouter () {
    return(
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="tours" element={<ToursList />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="tour/:tourId" element={<TourDetail />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminLayout />} >
                    <Route index element={<DashboardMain />} />
                    <Route path="tours" element={<ToursAdmin/>} />
                    <Route path="bookings" element={<BookingsAdmin />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="promotions" element={<PromotionsAdmin />} />
                    <Route path="departures" element={<DeparturesAdmin />} />
                    <Route path="articles" element={<ArticlesAdmin />} />
                    <Route path="reviews" element={<ReviewsAdmin />} />  
                    <Route path="payments" element={<PaymentsAdmin />} />
                    <Route path="invoices" element={<InvoicesAdmin />} />
                    <Route path="price-policies" element={<PricePoliciesAdmin />} />
                    <Route path="settings" element={<SettingsAdmin />} />
                </Route>
                <Route path="/" >
                    
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>    
    )
}