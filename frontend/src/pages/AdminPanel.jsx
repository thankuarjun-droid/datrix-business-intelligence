import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  FileText,
  Shield,
  Activity
} from 'lucide-react';

const API_URL = '/api';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    pending_users: 0,
    verified_users: 0,
    approved_users: 0,
    assessments_last_30_days: 0,
    new_users_last_7_days: 0
  });
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersResponse = await fetch(`${API_URL}/admin/users`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const usersList = usersData.users || [];
        setUsers(usersList);
        
        // Calculate stats from users data
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const calculatedStats = {
          pending_users: usersList.filter(u => u.status === 'pending').length,
          verified_users: usersList.filter(u => u.status === 'verified').length,
          approved_users: usersList.filter(u => u.is_approved).length,
          new_users_last_7_days: usersList.filter(u => new Date(u.created_at) > sevenDaysAgo).length,
          assessments_last_30_days: 0
        };
        setStats(calculatedStats);
      }
      
      // Fetch assessments
      const assessmentsResponse = await fetch(`${API_URL}/admin/assessments`);
      if (assessmentsResponse.ok) {
        const assessmentsData = await assessmentsResponse.json();
        setAssessments(assessmentsData.assessments || []);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/approve-user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`User approved! Assessment Token: ${data.assessment_token}`);
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        alert('User rejected successfully');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      verified: 'default',
      approved: 'success',
      suspended: 'destructive'
    };
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  const getGradeBadge = (grade) => {
    const colors = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-blue-100 text-blue-800',
      C: 'bg-yellow-100 text-yellow-800',
      D: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[grade] || 'bg-gray-100 text-gray-800'}>
        Grade {grade}
      </Badge>
    );
  };

  const filterUsersByStatus = (status) => {
    return users.filter(user => user.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Datrix™ Admin Panel</h1>
                <p className="text-sm text-gray-600">Business Intelligence Scanner Management</p>
              </div>
            </div>
            <Button onClick={fetchDashboardData} variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-yellow-600">{stats.pending_users}</span>
                <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Verified Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">{stats.verified_users}</span>
                <Users className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">{stats.approved_users}</span>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Assessments (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-purple-600">{stats.assessments_last_30_days}</span>
                <FileText className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Users (7d)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-indigo-600">{stats.new_users_last_7_days}</span>
                <TrendingUp className="w-8 h-8 text-indigo-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="pending">Pending ({filterUsersByStatus('pending').length})</TabsTrigger>
            <TabsTrigger value="verified">Verified ({filterUsersByStatus('verified').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({filterUsersByStatus('approved').length})</TabsTrigger>
            <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
          </TabsList>

          {/* Pending Users Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Registrations</CardTitle>
                <CardDescription>Users who have registered but not yet verified their account</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterUsersByStatus('pending').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          No pending users
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterUsersByStatus('pending').map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.business_name}</TableCell>
                          <TableCell>{user.mobile}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verified Users Tab */}
          <TabsContent value="verified">
            <Card>
              <CardHeader>
                <CardTitle>Verified Users Awaiting Approval</CardTitle>
                <CardDescription>Users who have verified their account and are waiting for admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterUsersByStatus('verified').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500">
                          No verified users awaiting approval
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterUsersByStatus('verified').map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.business_name}</TableCell>
                          <TableCell>{user.designation || 'N/A'}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveUser(user.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectUser(user.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Users Tab */}
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Users</CardTitle>
                <CardDescription>Users who have been approved and can take assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Assessment Token</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterUsersByStatus('approved').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          No approved users yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterUsersByStatus('approved').map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.business_name}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {user.assessment_token?.substring(0, 16)}...
                            </code>
                          </TableCell>
                          <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Completed Assessments</CardTitle>
                <CardDescription>All business intelligence assessments completed by users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          No assessments completed yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">
                            {assessment.users?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>{assessment.users?.business_name || 'N/A'}</TableCell>
                          <TableCell>{assessment.total_score}/{assessment.max_score}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${assessment.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm">{assessment.percentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getGradeBadge(assessment.overall_grade)}</TableCell>
                          <TableCell>{new Date(assessment.completed_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;

