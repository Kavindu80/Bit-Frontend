import React, { useState, useEffect } from 'react';
import { Users, Search, Code, GitBranch, Clock, Activity, FolderGit } from 'lucide-react';

const ProjectDashboard = () => {
  const [contributors, setContributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/admin/all-contributors');
      if (!response.ok) throw new Error('Failed to fetch contributors');
      const data = await response.json();
      setContributors(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load contributors data');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Group by projects first, then contributors
  const groupedByProjects = contributors.reduce((acc, contributor) => {
    contributor.commits.forEach(commit => {
      if (!acc[commit.projectName]) {
        acc[commit.projectName] = {
          projectName: commit.projectName,
          contributors: {}
        };
      }
      
      const name = contributor.author.split('<')[0].trim();
      if (!acc[commit.projectName].contributors[name]) {
        acc[commit.projectName].contributors[name] = {
          name,
          avatar: name[0].toUpperCase(),
          commits: []
        };
      }
      
      acc[commit.projectName].contributors[name].commits.push(commit);
    });
    
    return acc;
  }, {});

  const filteredProjects = Object.values(groupedByProjects)
    .filter(project => 
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(project.contributors).some(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const stats = {
    totalProjects: filteredProjects.length,
    totalContributors: new Set(
      filteredProjects.flatMap(project => 
        Object.values(project.contributors).map(c => c.name)
      )
    ).size,
    totalCommits: filteredProjects.reduce((acc, project) => 
      acc + Object.values(project.contributors)
        .reduce((sum, contributor) => sum + contributor.commits.length, 0)
    , 0)
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-red-50 p-4 rounded-lg text-red-700 shadow-lg">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Section with better spacing */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white transform transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm uppercase tracking-wider">Total Projects</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalProjects}</p>
                </div>
                <FolderGit className="h-12 w-12 text-blue-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-5 text-white transform transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm uppercase tracking-wider">Contributors</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalContributors}</p>
                </div>
                <Users className="h-12 w-12 text-indigo-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white transform transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm uppercase tracking-wider">Total Commits</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalCommits}</p>
                </div>
                <GitBranch className="h-12 w-12 text-purple-200 opacity-80" />
              </div>
            </div>
          </div>

          {/* Search Bar with improved spacing */}
          <div className="relative mt-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search projects or contributors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section with improved styling */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="sticky top-0 px-6 py-4 text-left text-sm font-semibold text-gray-600 first:pl-8">
                      <div className="flex items-center space-x-2">
                        <FolderGit className="h-4 w-4 text-gray-500" />
                        <span>Project</span>
                      </div>
                    </th>
                    <th className="sticky top-0 px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Contributors</span>
                      </div>
                    </th>
                    <th className="sticky top-0 px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-gray-500" />
                        <span>Recent Commits</span>
                      </div>
                    </th>
                    <th className="sticky top-0 px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span>Latest Activity</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProjects.map(project => 
                    Object.values(project.contributors).map((contributor, contributorIndex) => (
                      <tr 
                        key={`${project.projectName}-${contributor.name}`}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        {contributorIndex === 0 && (
                          <td className="px-6 py-4 pl-8" rowSpan={Object.keys(project.contributors).length}>
                            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                              <FolderGit className="h-4 w-4 mr-2" />
                              {project.projectName}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold">{contributor.avatar}</span>
                            </div>
                            <div className="font-medium text-gray-900">{contributor.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-3">
                            {contributor.commits.slice(0, 3).map((commit, index) => (
                              <div 
                                key={commit.hash}
                                className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:scale-[1.01] ${
                                  index === 0 
                                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                                    : index === 1
                                      ? 'bg-indigo-50 border-indigo-500'
                                      : 'bg-purple-50 border-purple-500'
                                }`}
                              >
                                <p className="text-sm font-medium text-gray-900">{commit.message}</p>
                                <div className="flex items-center mt-1.5 text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(commit.date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {formatDate(contributor.commits[0].date)}
                            </div>
                            <div className="text-gray-500 mt-1.5 flex items-center">
                              <Activity className="w-4 h-4 mr-1" />
                              Latest commit
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
