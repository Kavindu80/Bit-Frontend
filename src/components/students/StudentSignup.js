import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentSignup = () => {
  const teams = ['MERN', 'JAVA', 'C#', 'PYTHON', 'DevOps', 'PHP', 'Flutter', 'UI/UX', 'Chatbot', 'DRS', 'QA'];
  
  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    groupNumber: '',
    username: '',
    password: '',
    token: '',
    workspaceName: ''
  });
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [groupNumberValue, setGroupNumberValue] = useState(1);
  const [useCustomGroup, setUseCustomGroup] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleTeamChange = (e) => {
    const teamValue = e.target.value;
    setSelectedTeam(teamValue);
    
    // Update the groupNumber in formData with combined value
    if (teamValue) {
      setFormData({
        ...formData,
       groupNumber: `${teamValue} ${groupNumberValue}`
      });
    } else {
      setFormData({
        ...formData,
        groupNumber: ''
      });
    }
    
    // Clear the error for this field when user selects a team
    if (errors.groupNumber) {
      setErrors({
        ...errors,
        groupNumber: null
      });
    }
  };

  const handleGroupNumberChange = (e) => {
    const numValue = parseInt(e.target.value) || 1;
    setGroupNumberValue(numValue);
    
    // Update the groupNumber in formData with combined value
    if (selectedTeam) {
      setFormData({
        ...formData,
        groupNumber: `${selectedTeam} ${numValue}` 
      });
    }
  };

  const toggleCustomGroup = () => {
    setUseCustomGroup(!useCustomGroup);
    // Reset the group number when toggling between custom and predefined
    setFormData({
      ...formData,
      groupNumber: ''
    });
    setSelectedTeam('');
    setGroupNumberValue(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Client-side validation
    const newErrors = {};
    if (!formData.serviceId) newErrors.serviceId = 'Service ID is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.groupNumber) newErrors.groupNumber = 'Group number is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (formData.username && formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.token) newErrors.token = 'Token is required';
    if (!formData.workspaceName) newErrors.workspaceName = 'Workspace name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/students/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Show success message
        alert('Signup successful!');
        // Reset form
        setFormData({
          serviceId: '',
          name: '',
          groupNumber: '',
          username: '',
          password: '',
          token: '',
          workspaceName: ''
        });
        setUseCustomGroup(false);
        setSelectedTeam('');
        setGroupNumberValue(1);
        // Redirect to login page
        navigate('/');
      } else {
        // Handle server validation errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Student Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service ID</label>
                    <input
                      type="text"
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.serviceId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.serviceId && (
                      <p className="mt-1 text-sm text-red-600">{errors.serviceId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Group Name</label>
                      <button
                        type="button"
                        onClick={toggleCustomGroup}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {useCustomGroup ? 'Use Predefined Team' : 'Enter Custom Name'}
                      </button>
                    </div>
                    
                    {useCustomGroup ? (
                      <input
                        type="text"
                        name="groupNumber"
                        value={formData.groupNumber}
                        onChange={handleChange}
                        placeholder="Enter custom group name"
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          errors.groupNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <div className="flex space-x-2">
                        <div className="flex-grow">
                          <select
                            value={selectedTeam}
                            onChange={handleTeamChange}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                              errors.groupNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select a team</option>
                            {teams.map((team) => (
                              <option key={team} value={team}>
                                {team}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            value={groupNumberValue}
                            onChange={handleGroupNumberChange}
                            min="1"
                            placeholder="Group #"
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                              errors.groupNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                    
                    {!useCustomGroup && selectedTeam && (
                      <p className="mt-1 text-xs text-gray-500">
                        Selected: {selectedTeam} {groupNumberValue}
                      </p>
                    )}
                    
                    {errors.groupNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.groupNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Token</label>
                    <input
                      type="text"
                      name="token"
                      value={formData.token}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.token ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.token && (
                      <p className="mt-1 text-sm text-red-600">{errors.token}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Workspace Name</label>
                    <input
                      type="text"
                      name="workspaceName"
                      value={formData.workspaceName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.workspaceName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.workspaceName && (
                      <p className="mt-1 text-sm text-red-600">{errors.workspaceName}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;