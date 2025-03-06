import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';
import axios from 'axios';

const Manage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupFilter, setGroupFilter] = useState('');

  // Fetch students function
  const fetchStudents = async () => {
    try {
      const response = await axios.get('${process.env.REACT_APP_API_BASE_URL}/api/students');
      setStudents(response.data.data);
      setFilteredStudents(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students by group number
  useEffect(() => {
    if (groupFilter) {
      const filtered = students.filter(student => 
        student.groupNumber.toLowerCase().includes(groupFilter.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [groupFilter, students]);

  // Delete student handler
  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/students/${studentId}`);
        fetchStudents();
        alert('Student deleted successfully');
      } catch (error) {
        console.error('Failed to delete student', error);
        alert('Failed to delete student');
      }
    }
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="relative flex items-center justify-between mb-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
        
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-800">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Manage Groups
          </span>
        </h2>
      </div>

      {/* Group Filter */}
      <div className="mb-4 relative">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Filter by Group Number"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <th className="py-2 px-4">Group Number</th>
                <th className="py-2 px-4">Service ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Workspace Name</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 text-center">{student.groupNumber}</td>
                  <td className="py-2 px-4 text-center">{student.serviceId}</td>
                  <td className="py-2 px-4 text-center">{student.name}</td>
                  <td className="py-2 px-4 text-center">{student.username}</td>
                  <td className="py-2 px-4 text-center">{student.workspaceName}</td>
                  <td className="py-2 px-4 text-center">
                    <button 
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Student"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No students found matching the group filter.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Manage;