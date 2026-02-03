import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Marketplace from '../pages/Marketplace'
import ListingDetails from '../pages/ListingDetails'
import Store from '../pages/Store'
import Profile from '../pages/Profile'
import CreateListing from '../pages/CreateListing'
import Settings from '../pages/Settings'
import GetVerified from '../pages/GetVerified'
import ProtectedRoute from '../components/ProtectedRoute'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/store/:username" element={<Store />} />
      <Route path="/profile" element={<Profile />} />
      <Route 
        path="/create-listing" 
        element={
          <ProtectedRoute>
            <CreateListing />
          </ProtectedRoute>
        } 
      />
      <Route path="/settings" element={<Settings />} />
      <Route 
        path="/get-verified" 
        element={
          <ProtectedRoute>
            <GetVerified />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default Router

