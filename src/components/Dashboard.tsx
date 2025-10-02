import React from 'react';
import { Student } from '../../types';

interface DashboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  currentUser: Student;
}

const Dashboard: React.FC<DashboardProps> = ({ students, onSelectStudent, currentUser }) => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, {currentUser.name}</p>
      <h2>All Students</h2>
      <ul>
        {students.map(student => (
          <li key={student.id} onClick={() => onSelectStudent(student)}>
            {student.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;