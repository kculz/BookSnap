import { Route, Routes } from "react-router-dom"
import { AdminDashboardLayout, AuthLayout, NotFound, Signin, Signup, UserDashboardLayout } from "./components"
import { About, AdminDashboard, AdminProfile, Contact, Home, ManageBookings, ManageUsers, Pricing, UserDashboard, UserProfile } from "./pages"


function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />

      <Route path="/user" element={<UserDashboardLayout />}>
        <Route index path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route index path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-bookings" element={<ManageBookings />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />} >
        <Route index path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      <Route path="*" element={<NotFound />} />

     </Routes>
    </>
  )
}

export default App
