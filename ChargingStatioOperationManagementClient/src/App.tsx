import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Monitor from "@/pages/Monitor";
import Stations from "@/pages/Stations";
import Piles from "@/pages/Piles";
import FeeRules from "@/pages/FeeRules";
import AlarmSettings from "@/pages/AlarmSettings";
import AlarmMessages from "@/pages/AlarmMessages";
import OperationReports from "@/pages/OperationReports";
import CustomerAnalysis from "@/pages/CustomerAnalysis";
import StationStatus from "@/pages/StationStatus";
import CardManagement from "@/pages/CardManagement";
import ReservationManagement from "@/pages/ReservationManagement";
import CustomerManagement from "@/pages/CustomerManagement";
import ChargeRecords from "@/pages/ChargeRecords";
import TransactionFlow from "@/pages/TransactionFlow";
import RechargeRecords from "@/pages/RechargeRecords";
import TaskManagement from "@/pages/TaskManagement";
import MaintenanceStaff from "@/pages/MaintenanceStaff";
import FaultAnalysis from "@/pages/FaultAnalysis";
import EnergyConsumption from "@/pages/EnergyConsumption";
import FinancialReport from "@/pages/FinancialReport";
import VehicleManagement from "@/pages/VehicleManagement";
import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="ml-56">
        <AuthContext.Provider
          value={{ isAuthenticated, setIsAuthenticated, logout }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/station/:id" element={<StationStatus />} />
            <Route path="/station-pile" element={<Navigate to="/station-pile/stations" replace />} />
            <Route path="/station-pile/stations" element={<Stations />} />
            <Route path="/station-pile/piles" element={<Piles />} />
    <Route path="/operation" element={<Navigate to="/operation/cards" replace />} />
    <Route path="/operation/cards" element={<CardManagement />} />
    <Route path="/operation/reservations" element={<ReservationManagement />} />
    <Route path="/operation/customers" element={<CustomerManagement />} />
    <Route path="/operation/vehicles" element={<VehicleManagement />} />
    <Route path="/orders" element={<Navigate to="/orders/charges" replace />} />
    <Route path="/orders/charges" element={<ChargeRecords />} />
    <Route path="/orders/transactions" element={<TransactionFlow />} />
    <Route path="/orders/recharges" element={<RechargeRecords />} />
    <Route path="/operation/fee-rules" element={<FeeRules />} />
    <Route path="/maintenance/tasks" element={<TaskManagement />} />
    <Route path="/maintenance/staff" element={<MaintenanceStaff />} />
    <Route path="/alarm" element={<Navigate to="/alarm/settings" replace />} />
    <Route path="/alarm/settings" element={<AlarmSettings />} />
    <Route path="/alarm/messages" element={<AlarmMessages />} />


    <Route path="/reports/operation" element={<OperationReports />} />
    <Route path="/reports/fault" element={<FaultAnalysis />} />

    <Route path="/reports/energy" element={<EnergyConsumption />} />
    <Route path="/reports/financial" element={<FinancialReport />} />
          </Routes>
        </AuthContext.Provider>
      </div>
    </div>
  );
}