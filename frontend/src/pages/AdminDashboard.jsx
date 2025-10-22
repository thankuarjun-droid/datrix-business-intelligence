import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Users, CheckCircle, Clock, RefreshCw, Mail, Building2, Phone } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    approved: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Calculate stats
      const total = usersData?.length || 0;
      const pending = usersData?.filter(u => u.status === 'pending').length || 0;
      const verified = usersData?.filter(u => u.status === 'verified').length || 0;
      const approved = usersData?.filter(u => u.status === 'approved').length || 0;

      setStats({ total, pending, verified, approved });

      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('assessments')
        .select(`
          *,
          users (
            full_name,
            email,
            business_name
          )
        `)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (!assessmentsError) {
        setAssessments(assessmentsData || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAssessmentToken = () => {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  const approveUser = async (userId, userEmail) => {
    try {
      const assessmentToken = generateAssessmentToken();
      
      const { error } = await supabase
        .from('users')
        .update({
          is_approved: true,
          status: 'approved',
          assessment_token: assessmentToken,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      alert(`User approved! Assessment link:\n\n${window.location.origin}/assess/${assessmentToken}\n\nCopy this link and send it to ${userEmail}`);
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user: ' + error.message);
    }
  };

  const rejectUser = async (userId) => {
    if (!confirm('Are you sure you want to reject this user?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      alert('User rejected');
      fetchData();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user: ' + error.message);
    }
  };

  const copyAssessmentLink = (token) => {
    const link = `${window.location.origin}/assess/${token}`;
    navigator.clipboard.writeText(link);
    alert('Assessment link copied to clipboard!');
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status] || ''}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Datrix™ Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and assessments</p>
          <Button onClick={fetchData} className="mt-4" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>{user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.designation}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                      {user.mobile && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Phone className="w-3 h-3" />
                          {user.mobile}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <div>{user.business_name}</div>
                          <div className="text-sm text-gray-500">{user.business_type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.status === 'verified' && (
                          <Button 
                            size="sm" 
                            onClick={() => approveUser(user.id, user.email)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                        )}
                        {user.status === 'approved' && user.assessment_token && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyAssessmentLink(user.assessment_token)}
                          >
                            Copy Link
                          </Button>
                        )}
                        {user.status !== 'suspended' && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => rejectUser(user.id)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div>{assessment.users?.full_name}</div>
                      <div className="text-sm text-gray-500">{assessment.users?.email}</div>
                    </TableCell>
                    <TableCell>{assessment.users?.business_name}</TableCell>
                    <TableCell>
                      <div className="font-medium">{assessment.total_score} / {assessment.max_score}</div>
                      <div className="text-sm text-gray-500">{assessment.percentage}%</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        assessment.overall_grade === 'A' ? 'bg-green-100 text-green-800' :
                        assessment.overall_grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        assessment.overall_grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        Grade {assessment.overall_grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(assessment.completed_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {assessments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No assessments completed yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

