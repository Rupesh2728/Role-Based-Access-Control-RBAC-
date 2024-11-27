import React from 'react'
import TopBar from './TopBar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <>
      <TopBar/>
      <Outlet/>
    </>
  )
}

export default Dashboard