import { useState } from "react";
import { Student } from "../types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { initialStudents } from "./data/initialStudents";

// Components
import Dashboard from "./components/Dashboard";
import StudentDetails from "./components/StudentDetails";
import Login from "./components/Login";
import Header from "./components/Header";
import { Toaster } from "./components/common/Toast";

function App() {
  const [students, setStudents] = useLocalStorage<Student[]>("students", initialStudents);
  const [currentUser, setCurrentUser] = useLocalStorage<Student | null>("currentUser", null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleLogin = (user: Student) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedStudent(null);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackToDashboard = () => {
    setSelectedStudent(null);
  };

  const updateStudentData = (updatedStudent: Student) => {
    const updatedStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updatedStudents);
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
    if (currentUser?.id === updatedStudent.id) {
      setCurrentUser(updatedStudent);
    }
  };

  if (!currentUser) {
    return <Login students={students} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Toaster />
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onBack={selectedStudent ? handleBackToDashboard : undefined}
        showBack={!!selectedStudent}
      />
      <main className="p-4 sm:p-6 md:p-8">
        {selectedStudent ? (
          <StudentDetails
            student={selectedStudent}
            updateStudentData={updateStudentData}
          />
        ) : (
          <Dashboard
            students={students}
            onSelectStudent={handleSelectStudent}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );
}

export default App;