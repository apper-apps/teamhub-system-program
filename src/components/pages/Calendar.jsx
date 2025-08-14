import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CalendarModal from "@/components/organisms/CalendarModal";
import ApperIcon from "@/components/ApperIcon";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, day
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const { 
    leaves, 
    loading: leavesLoading, 
    error: leavesError, 
    createLeave, 
    updateLeave, 
    updateLeaveStatus, 
    deleteLeave,
    refetch: refetchLeaves 
  } = useLeaveRequests();
  
  const { 
    employees, 
    loading: employeesLoading, 
    error: employeesError 
  } = useEmployees();

  const loading = leavesLoading || employeesLoading;
  const error = leavesError || employeesError;

  const getStatusColor = (status) => {
    const colors = {
      "Approved": "success",
      "Pending": "warning", 
      "Rejected": "error"
    };
    return colors[status] || "default";
  };

  const getStatusBgColor = (status) => {
    const colors = {
      "Approved": "bg-green-100 border-green-300",
      "Pending": "bg-yellow-100 border-yellow-300", 
      "Rejected": "bg-red-100 border-red-300"
    };
    return colors[status] || "bg-gray-100 border-gray-300";
  };

  const filteredLeaves = leaves.filter(leave => {
    const employeeMatch = !selectedEmployee || leave.employeeId === parseInt(selectedEmployee);
    const statusMatch = !selectedStatus || leave.status === selectedStatus;
    return employeeMatch && statusMatch;
  });

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.Id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  const getEmployeePhoto = (employeeId) => {
    const employee = employees.find(emp => emp.Id === employeeId);
    return employee?.photo;
  };

  const getLeavesForDate = (date) => {
    return filteredLeaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return date >= leaveStart && date <= leaveEnd;
    });
  };

  const handleDateClick = (date) => {
    const leavesOnDate = getLeavesForDate(date);
    if (leavesOnDate.length === 1) {
      setSelectedLeave(leavesOnDate[0]);
    } else {
      setSelectedDate(date);
    }
    setModalOpen(true);
  };

  const handleLeaveClick = (leave, e) => {
    e.stopPropagation();
    setSelectedLeave(leave);
    setSelectedDate(null);
    setModalOpen(true);
  };

  const handleCreateLeave = () => {
    setSelectedLeave(null);
    setSelectedDate(new Date());
    setModalOpen(true);
  };

  const handleSaveLeave = async (leaveData) => {
    if (selectedLeave) {
      await updateLeave(selectedLeave.Id, leaveData);
    } else {
      await createLeave(leaveData);
    }
    refetchLeaves();
  };

  const handleDeleteLeave = async (leaveId) => {
    await deleteLeave(leaveId);
    refetchLeaves();
  };

  const handleUpdateLeaveStatus = async (leaveId, status, approvedBy, rejectionReason) => {
    await updateLeaveStatus(leaveId, status, approvedBy, rejectionReason);
    refetchLeaves();
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLeave(null);
    setSelectedDate(null);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map(day => {
          const leavesOnDay = getLeavesForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toISOString()}
              className={`
                bg-white p-2 min-h-[100px] cursor-pointer hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                ${isToday ? "bg-blue-50 border border-blue-200" : ""}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`
                  text-sm font-medium 
                  ${isToday ? "text-blue-600" : isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                `}>
                  {format(day, "d")}
                </span>
                {leavesOnDay.length > 0 && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-1 rounded">
                    {leavesOnDay.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {leavesOnDay.slice(0, 2).map(leave => (
                  <div
                    key={leave.Id}
                    className={`
                      text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-all
                      ${getStatusBgColor(leave.status)}
                    `}
                    onClick={(e) => handleLeaveClick(leave, e)}
                  >
                    <div className="flex items-center gap-1">
                      <Avatar
                        src={getEmployeePhoto(leave.employeeId)}
                        name={getEmployeeName(leave.employeeId)}
                        size="sm"
                        className="w-4 h-4"
                      />
                      <span className="truncate flex-1">
                        {getEmployeeName(leave.employeeId)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {leave.type}
                    </div>
                  </div>
                ))}
                
                {leavesOnDay.length > 2 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{leavesOnDay.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={() => {
          refetchLeaves();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Calendar</h1>
          <p className="text-gray-600">Track and manage employee leave requests</p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleCreateLeave}
          icon="Plus"
        >
          New Leave Request
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigateMonth("prev")}
              icon="ChevronLeft"
              size="sm"
            />
            <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigateMonth("next")}
              icon="ChevronRight"
              size="sm"
            />
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              size="sm"
            >
              Today
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.Id} value={emp.Id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Rejected</span>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <Card padding="lg">
        {renderMonthView()}
      </Card>

      {/* Upcoming Leave Requests */}
      {filteredLeaves.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Leave Requests Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredLeaves.filter(l => l.status === "Approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredLeaves.filter(l => l.status === "Pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {filteredLeaves.filter(l => l.status === "Rejected").length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </Card>
      )}

      {filteredLeaves.length === 0 && (
        <Empty
          title="No Leave Requests"
          description="No leave requests found for the selected filters. Create a new leave request to get started."
          actionLabel="Create Leave Request"
          onAction={handleCreateLeave}
          icon="Calendar"
        />
      )}

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={modalOpen}
        onClose={closeModal}
        leaveRequest={selectedLeave}
        selectedDate={selectedDate}
        onSave={handleSaveLeave}
        onDelete={handleDeleteLeave}
        onUpdateStatus={handleUpdateLeaveStatus}
      />
    </div>
  );
};

export default Calendar;