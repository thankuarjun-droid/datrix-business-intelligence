import React, { useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';

const AdminPanelFull = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAllData();
  }, []);
  
  const fetchAllData = async () => {
    try {
      const [usersRes, assessmentsRes, questionsRes] = await Promise.all([
        fetch(apiUrl('/api/admin/users')),
        fetch(apiUrl('/api/admin/assessments')),
        fetch(apiUrl('/api/admin/questions'))
      ]);
      
      const usersData = await usersRes.json();
      const assessmentsData = await assessmentsRes.json();
      const questionsData = await questionsRes.json();
      
      setUsers(usersData.users || []);
      setAssessments(assessmentsData.assessments || []);
      setQuestions(questionsData.questions || []);
      setCategories(questionsData.categories || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  const approveUser = async (userId) => {
    try {
      const response = await fetch(apiUrl(`/api/admin/approve-user/${userId}`), {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`User approved! Assessment link:\n${window.location.origin}/assessment?token=${data.assessment_token}`);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to approve user');
    }
  };
  
  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    verifiedUsers: users.filter(u => u.is_verified && !u.is_approved).length,
    approvedUsers: users.filter(u => u.is_approved).length,
    totalAssessments: assessments.length,
    avgScore: assessments.length > 0 
      ? (assessments.reduce((sum, a) => sum + a.percentage, 0) / assessments.length).toFixed(1)
      : 0,
    totalQuestions: questions.length
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Datrix™ Admin Panel</h1>
              <p className="text-gray-600">Business Intelligence Scanner Management</p>
            </div>
            <button
              onClick={fetchAllData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'assessments', label: 'Assessments', icon: '📝' },
              { id: 'questions', label: 'Questions', icon: '❓' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Approval</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingUsers}</p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Assessments</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalAssessments}</p>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Score</p>
                    <p className="text-3xl font-bold text-green-600">{stats.avgScore}%</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Business</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.full_name}</td>
                        <td className="py-3 px-4">{user.business_name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'approved' ? 'bg-green-100 text-green-700' :
                            user.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Business</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Mobile</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{user.full_name}</td>
                      <td className="py-3 px-4">{user.business_name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.mobile}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'approved' ? 'bg-green-100 text-green-700' :
                          user.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.is_verified && !user.is_approved && (
                          <button
                            onClick={() => approveUser(user.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Approve
                          </button>
                        )}
                        {user.is_approved && (
                          <span className="text-green-600 text-sm">✓ Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Assessment Reports</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">User ID</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Percentage</th>
                    <th className="text-left py-3 px-4">Grade</th>
                    <th className="text-left py-3 px-4">Tier</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map(assessment => (
                    <tr key={assessment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{assessment.user_id.substring(0, 8)}...</td>
                      <td className="py-3 px-4">{assessment.total_score} / {assessment.max_score}</td>
                      <td className="py-3 px-4 font-bold">{assessment.percentage}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          assessment.overall_grade === 'A' ? 'bg-green-100 text-green-700' :
                          assessment.overall_grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          assessment.overall_grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {assessment.overall_grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">{assessment.performance_tier}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Question Management</h2>
                <div className="text-sm text-gray-600">
                  Total: {stats.totalQuestions} questions across {categories.length} categories
                </div>
              </div>
              
              {categories.map(category => {
                const categoryQuestions = questions.filter(q => q.category_id === category.id);
                return (
                  <div key={category.id} className="mb-6 last:mb-0">
                    <div className="bg-blue-50 p-4 rounded-lg mb-3">
                      <h3 className="font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {categoryQuestions.length} questions • Weight: {category.weight}%
                      </div>
                    </div>
                    
                    <div className="space-y-2 pl-4">
                      {categoryQuestions.map((q, index) => (
                        <div key={q.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-800">{q.question_text}</p>
                            {q.help_text && (
                              <p className="text-xs text-gray-500 mt-1">{q.help_text}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">Max: {q.max_score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">User Status Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pending</span>
                    <span>{stats.pendingUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(stats.pendingUsers/stats.totalUsers*100)}%`}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Verified</span>
                    <span>{stats.verifiedUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(stats.verifiedUsers/stats.totalUsers*100)}%`}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Approved</span>
                    <span>{stats.approvedUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${(stats.approvedUsers/stats.totalUsers*100)}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">Conversion Funnel</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Registered</div>
                    <div className="w-full bg-blue-200 rounded-full h-8 flex items-center px-3">
                      <span className="text-sm font-bold">{stats.totalUsers}</span>
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Approved</div>
                    <div className="w-full bg-green-200 rounded-full h-8 flex items-center px-3">
                      <span className="text-sm font-bold">{stats.approvedUsers}</span>
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Completed Assessment</div>
                    <div className="w-full bg-purple-200 rounded-full h-8 flex items-center px-3">
                      <span className="text-sm font-bold">{stats.totalAssessments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelFull;

