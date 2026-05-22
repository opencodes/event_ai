import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { GuestRoute } from '@/components/GuestRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardOverview } from '@/pages/dashboard/DashboardOverview'
import { DashboardEvents } from '@/pages/dashboard/DashboardEvents'
import { DashboardPlaceholder } from '@/pages/dashboard/DashboardPlaceholder'
import { DashboardMarketplace } from '@/pages/dashboard/DashboardMarketplace'
import { DashboardSettings } from '@/pages/dashboard/DashboardSettings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="events" element={<DashboardEvents />} />
        <Route
          path="rituals"
          element={
            <DashboardPlaceholder
              title="Rituals & Ceremonies"
              icon="fa-om"
              description="Plan sacred rituals, timelines, and ceremony sequences for your events."
              actionLabel="Configure Rituals"
            />
          }
        />
        <Route
          path="rsvp"
          element={
            <DashboardPlaceholder
              title="RSVP & Guests"
              icon="fa-users"
              description="Track invitations, responses, and guest accommodations."
              actionLabel="Manage Guests"
            />
          }
        />
        <Route
          path="checkpoints"
          element={
            <DashboardPlaceholder
              title="Checkpoints"
              icon="fa-list-check"
              description="Milestone checkpoints keep your celebration on schedule."
              actionLabel="View Checkpoints"
            />
          }
        />
        <Route
          path="budget"
          element={
            <DashboardPlaceholder
              title="Budget"
              icon="fa-indian-rupee-sign"
              description="Track expenses, contributions, and vendor payments in one place."
              actionLabel="Open Budget"
            />
          }
        />
        <Route
          path="vendors"
          element={
            <DashboardPlaceholder
              title="Vendors"
              icon="fa-store"
              description="Manage halwais, photographers, decorators, and other vendors."
              actionLabel="Add Vendor"
            />
          }
        />
        <Route
          path="bhoj"
          element={
            <DashboardPlaceholder
              title="Bhoj & Catering"
              icon="fa-utensils"
              description="Plan menus, seating, and feast logistics for your celebration."
              actionLabel="Plan Bhoj"
            />
          }
        />
        <Route
          path="clothing"
          element={
            <DashboardPlaceholder
              title="Clothing"
              icon="fa-shirt"
              description="Coordinate traditional attire for the wedding party and family."
              actionLabel="Manage Outfits"
            />
          }
        />
        <Route
          path="gifting"
          element={
            <DashboardPlaceholder
              title="Gifting"
              icon="fa-gift"
              description="Track gifts, return favors, and ceremonial offerings."
              actionLabel="Manage Gifts"
            />
          }
        />
        <Route path="marketplace" element={<DashboardMarketplace />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
