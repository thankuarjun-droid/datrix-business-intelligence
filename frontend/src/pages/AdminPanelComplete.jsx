import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  Users, CheckCircle, XCircle, Clock, TrendingUp, FileText, Shield, Activity,
  Download, Eye, Calendar, BarChart3, UserCheck, UserX, Mail, Phone, Building2
} from 'lucide-react';

const API_URL = '/api';

const AdminPanelComplete = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    pending_users: 0,
    verified_users: 0,
    approved_users: 0,
    total_assessments: 0,
    assessments_last_30_days: 0,
    new_users_last_7_days: 0,
    scheduled_consultations: 0,
    conversion_rate: 0
  });
  
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch(`${API_URL}/admin/users`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const usersList = usersData.users || [];
        setUsers(usersList);
        
        // Calculate comprehensive stats
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const pendingCount = usersList.filter(u => u.status === 'pending').length;
        const verifiedCount = usersList.filter(u => u.is_verified && !u.is_approved).length;
        const approvedCount = usersList.filter(u => u.is_approved).length;
        const newUsersCount = usersList.filter(u => new Date(u.created_at) > sevenDaysAgo).length;
        
        setStats(prev => ({
          ...prev,
          total_users: usersList.length,
          pending_users: pendingCount,
          verified_users: verifiedCount,
          approved_users: approvedCount,
          new_users_last_7_days: newUsersCount
        }));
      }
      
      // Fetch assessments
      const assessmentsResponse = await fetch(`${API_URL}/admin/assessments`);
      if (assessmentsResponse.ok) {
        const assessmentsData = await assessmentsResponse.json();
        const assessmentsList = assessmentsData.assessments || [];
        setAssessments(assessmentsList);
        
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentAssessments = assessmentsList.filter(a => 
          new Date(a.created_at) > thirtyDaysAgo
        ).length;
        
        setStats(prev => ({
          ...prev,
          total_assessments: assessmentsList.length,
          assessments_last_30_days: recentAssessments,
          conversion_rate: users.length > 0 ? ((assessmentsList.length / users.length) * 100).toFixed(1) : 0
        }));
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/approve-user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`✅ User approved!\n\nAssessment Token: ${data.assessment_token}\n\nShare this link with the user:\n${window.location.origin}/assessment?token=${data.assessment_token}`);
        fetchAllData();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/reject-user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        alert('User rejected successfully');
        fetchAllData();
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setActiveTab('user-details');
  };

  const viewAssessmentDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setActiveTab('assessment-details');
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      verified: 'bg-blue-100 text-blue-800 border-blue-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      suspended: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <Badge className={`${colors[status] || 'bg-gray-100 text-gray-800'} border`}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  const getGradeBadge = (grade) => {
    const colors = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-blue-100 text-blue-800',
      C: 'bg-yellow-100 text-yellow-800',
      D: 'bg-orange-100 text-orange-800',
      F: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[grade] || 'bg-gray-100 text-gray-800'}>
        Grade {grade}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Datrix™ Admin Panel</h1>
                <p className="text-sm text-gray-600">Complete Business Intelligence Management</p>
              </div>
            </div>
            <Button onClick={fetchAllData} variant="outline" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending_users})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-600">{stats.total_users}</span>
                    <Users className="w-8 h-8 text-blue-600 opacity-50" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">All registered users</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-yellow-600">{stats.pending_users}</span>
                    <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Awaiting verification</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">{stats.approved_users}</span>
                    <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Active users</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-purple-600">{stats.total_assessments}</span>
                    <FileText className="w-8 h-8 text-purple-600 opacity-50" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Completed scans</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest 5 registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-600">{user.business_name}</p>
                          <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>Latest completed assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assessments.slice(0, 5).map(assessment => {
                      const user = users.find(u => u.id === assessment.user_id);
                      return (
                        <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{user?.full_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">Score: {assessment.percentage}%</p>
                            <p className="text-xs text-gray-500">{new Date(assessment.created_at).toLocaleDateString()}</p>
                          </div>
                          {getGradeBadge(assessment.overall_grade)}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete user management and details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.business_name}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewUserDetails(user)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!user.is_approved && (
                              <Button size="sm" variant="default" onClick={() => handleApproveUser(user.id)}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>All Assessments</CardTitle>
                <CardDescription>View and download assessment reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map(assessment => {
                      const user = users.find(u => u.id === assessment.user_id);
                      return (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">{user?.full_name || 'Unknown'}</TableCell>
                          <TableCell>{user?.business_name || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{width: `${assessment.percentage}%`}}
                                />
                              </div>
                              <span className="text-sm font-medium">{assessment.percentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getGradeBadge(assessment.overall_grade)}</TableCell>
                          <TableCell>{new Date(assessment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => viewAssessmentDetails(assessment)}>
                                <Eye className="w-4 h-4 mr-1" /> View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" /> PDF
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Users awaiting admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.status === 'pending').map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.business_name}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="default" onClick={() => handleApproveUser(user.id)}>
                              <UserCheck className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user.id)}>
                              <UserX className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Registration to Approval Rate</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.total_users > 0 ? ((stats.approved_users / stats.total_users) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Approval to Assessment Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.approved_users > 0 ? ((stats.total_assessments / stats.approved_users) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Overall Conversion Rate</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.conversion_rate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Pending</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{width: `${stats.total_users > 0 ? (stats.pending_users / stats.total_users) * 100 : 0}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{stats.pending_users}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Verified</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${stats.total_users > 0 ? (stats.verified_users / stats.total_users) * 100 : 0}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{stats.verified_users}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Approved</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${stats.total_users > 0 ? (stats.approved_users / stats.total_users) * 100 : 0}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{stats.approved_users}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Funnel Tab */}
          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle>User Journey Funnel</CardTitle>
                <CardDescription>Track users through the complete journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Funnel Stage 1 */}
                  <div className="relative">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                      <Users className="w-8 h-8" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">1. Registration</h3>
                        <p className="text-sm opacity-90">Users who signed up</p>
                      </div>
                      <div className="text-3xl font-bold">{stats.total_users}</div>
                    </div>
                  </div>

                  {/* Funnel Stage 2 */}
                  <div className="relative ml-8">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                      <CheckCircle className="w-8 h-8" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">2. Approved</h3>
                        <p className="text-sm opacity-90">Admin approved users</p>
                      </div>
                      <div className="text-3xl font-bold">{stats.approved_users}</div>
                      <div className="text-sm opacity-90">
                        ({stats.total_users > 0 ? ((stats.approved_users / stats.total_users) * 100).toFixed(0) : 0}%)
                      </div>
                    </div>
                  </div>

                  {/* Funnel Stage 3 */}
                  <div className="relative ml-16">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
                      <FileText className="w-8 h-8" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">3. Assessment Completed</h3>
                        <p className="text-sm opacity-90">Finished business scan</p>
                      </div>
                      <div className="text-3xl font-bold">{stats.total_assessments}</div>
                      <div className="text-sm opacity-90">
                        ({stats.approved_users > 0 ? ((stats.total_assessments / stats.approved_users) * 100).toFixed(0) : 0}%)
                      </div>
                    </div>
                  </div>

                  {/* Funnel Stage 4 */}
                  <div className="relative ml-24">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg">
                      <Calendar className="w-8 h-8" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">4. Consultation Scheduled</h3>
                        <p className="text-sm opacity-90">Booked appointment</p>
                      </div>
                      <div className="text-3xl font-bold">{stats.scheduled_consultations}</div>
                      <div className="text-sm opacity-90">
                        ({stats.total_assessments > 0 ? ((stats.scheduled_consultations / stats.total_assessments) * 100).toFixed(0) : 0}%)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanelComplete;

