import { Route, Router, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import Blog from "../pages/blog/Blog";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import AdminLayout from "../layouts/AdminLayout";
import StaffLayout from "../layouts/StaffLayout";
import DashboardMain from "../components/DashboardMain";
import ToursAdmin from "../components/ToursAdmin";
import BookingsAdmin from "../components/admin/BookingsAdmin";
import UsersAdmin from "../components/admin/UsersAdmin";
import PromotionsAdmin from "../components/admin/PromotionsAdmin";
import DeparturesAdmin from "../components/admin/DeparturesAdmin";
import PaymentsAdmin from "../components/admin/PaymentsAdmin";
import InvoicesAdmin from "../components/admin/InvoicesAdmin";
import PricePoliciesAdmin from "../components/admin/PricePoliciesAdmin";
import SettingsAdmin from "../components/admin/SettingsAdmin";
import Login from "../pages/authen/Login";
import Register from "../pages/authen/Register";
import StaffLogin from "../pages/authen/StaffLogin";
import ArticlesAdmin from "../components/admin/Articles";
import ReviewsAdmin from "../components/admin/Reviews";
import TourDetail from "../pages/tour/TourDetail";
import ToursList from "../pages/tour/ToursList";
import BookingPage from "../pages/BookingPage";
import PaymentPage from "../pages/PaymentPage";
import Gallery from "../components/GalleryComp";
import StaffDashboard from "../pages/staff/StaffDashBoard";
import StaffChatDetail from "../pages/staff/StaffChatDetail";
import StaffQueryPage from "../pages/staff/StaffQueryPage";
import { PrivateStaffRoute } from "./PrivateRoute";
import BlogDetail from "../pages/blog/BlogDetail";
import DeletedCustomers from "../components/admin/DeletedCustomers";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="tours" element={<ToursList />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:postId" element={<BlogDetail />} />
        <Route path="tour/:tourId" element={<TourDetail />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="payment" element={<PaymentPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff" element={<StaffLayout />}>
        <Route
          path="dashboard"
          element={
            <PrivateStaffRoute>
              <StaffDashboard />
            </PrivateStaffRoute>
          }
        />
        <Route
          path="chat/:sessionId"
          element={
            <PrivateStaffRoute>
              <StaffChatDetail />
            </PrivateStaffRoute>
          }
        />
        <Route
          path="query"
          element={
            <PrivateStaffRoute>
              <StaffQueryPage />
            </PrivateStaffRoute>
          }
        />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardMain />} />
        <Route path="tours" element={<ToursAdmin />} />
        <Route path="bookings" element={<BookingsAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="users/deleted" element={<DeletedCustomers />} />
        <Route path="promotions" element={<PromotionsAdmin />} />
        <Route path="departures" element={<DeparturesAdmin />} />
        <Route path="articles" element={<ArticlesAdmin />} />
        <Route path="reviews" element={<ReviewsAdmin />} />
        <Route path="payments" element={<PaymentsAdmin />} />
        <Route path="invoices" element={<InvoicesAdmin />} />
        <Route path="price-policies" element={<PricePoliciesAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
      <Route path="/"></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
