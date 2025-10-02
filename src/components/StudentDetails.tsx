import React from 'react';
import { Student } from '../../types';

interface StudentDetailsProps {
  student: Student;
  updateStudentData: (student: Student) => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, updateStudentData }) => {
  return (
    <div>
      <h1>Student Details</h1>
      <p>Name: {student.name}</p>
      <p>CPF: {student.cpf}</p>
    </div>
  );
};

export default StudentDetails;