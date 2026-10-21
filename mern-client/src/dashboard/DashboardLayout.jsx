import SideBar from './SideBar'
import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row'>
      <SideBar />
      <Outlet />
    </div>
  )
}

export default DashboardLayout;