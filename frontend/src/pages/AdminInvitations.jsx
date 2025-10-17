import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Link as LinkIcon,
  Mail,
  Building,
  User
} from 'lucide-react';
import { 
  createInvitation, 
  getInvitations, 
  getInvitationStats,
  resendInvitation,
  deleteInvitation 
} from '../services/invitationService';
import navviLogo from '../assets/navvi-logo.svg';

const AdminInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_mobile: '',
    company_name: '',
    company_type: '',
    designation: '',
    notes: '',
    expires_in_days: '30',
    payment_amount: ''
  });

  useEffect(() => {
    loadInvitations();
    loadStats();
  }, [statusFilter, searchQuery]);

  const loadInvitations = async () => {
    setLoading(true);
    const result = await getInvitations({ status: statusFilter, search: searchQuery });
    if (result.success) {
      setInvitations(result.invitations);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await getInvitationStats();
    if (result.success) {
      setStats(result.stats);
    }
  };

  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expires_in_days));

    const invitationData = {
      ...formData,
      expires_at: expiresAt.toISOString(),
      payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null
    };

    const result = await createInvitation(invitationData);
    
    if (result.success) {
      setGeneratedLink(result.assessmentLink);
      setLinkDialogOpen(true);
      setCreateDialogOpen(false);
      
      // Reset form
      setFormData({
        client_name: '',
        client_email: '',
        client_mobile: '',
        company_name: '',
        company_type: '',
        designation: '',
        notes: '',
        expires_in_days: '30',
        payment_amount: ''
      });

      // Reload data
      loadInvitations();
      loadStats();
    } else {
      alert('Error creating invitation: ' + result.error);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Assessment link copied to clipboard!');
  };

  const handleResend = async (invitationId) => {
    if (confirm('This will expire the current link and generate a new one. Continue?')) {
      const result = await resendInvitation(invitationId);
      if (result.success) {
        setGeneratedLink(result.assessmentLink);
        setLinkDialogOpen(true);
        loadInvitations();
        loadStats();
      } else {
        alert('Error resending invitation: ' + result.error);
      }
    }
  };

  const handleDelete = async (invitationId) => {
    if (confirm('Are you sure you want to delete this invitation?')) {
      const result = await deleteInvitation(invitationId);
      if (result.success) {
        loadInvitations();
        loadStats();
      } else {
        alert('Error deleting invitation: ' + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'secondary', icon: Clock, text: 'Pending' },
      in_progress: { variant: 'default', icon: BarChart3, text: 'In Progress' },
      completed: { variant: 'success', icon: CheckCircle, text: 'Completed' },
      expired: { variant: 'destructive', icon: XCircle, text: 'Expired' }
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={navviLogo} alt="Navvi Logo" className="h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessment Invitations</h1>
                <p className="text-sm text-gray-600">Datrix™ Business Intelligence Scanner</p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Invitation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Assessment Invitation</DialogTitle>
                  <DialogDescription>
                    Generate a unique assessment link for a client
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateInvitation} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client_name">Client Name *</Label>
                      <Input
                        id="client_name"
                        required
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client_email">Email *</Label>
                      <Input
                        id="client_email"
                        type="email"
                        required
                        value={formData.client_email}
                        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="ABC Garments Ltd"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client_mobile">Mobile</Label>
                      <Input
                        id="client_mobile"
                        value={formData.client_mobile}
                        onChange={(e) => setFormData({ ...formData, client_mobile: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_type">Company Type</Label>
                      <Select
                        value={formData.company_type}
                        onValueChange={(value) => setFormData({ ...formData, company_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="exporter">Exporter</SelectItem>
                          <SelectItem value="both">Manufacturer & Exporter</SelectItem>
                          <SelectItem value="trader">Trader</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="Managing Director"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expires_in_days">Link Validity (Days)</Label>
                      <Input
                        id="expires_in_days"
                        type="number"
                        min="1"
                        max="365"
                        value={formData.expires_in_days}
                        onChange={(e) => setFormData({ ...formData, expires_in_days: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_amount">Payment Amount (₹)</Label>
                      <Input
                        id="payment_amount"
                        type="number"
                        step="0.01"
                        value={formData.payment_amount}
                        onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Internal notes about this invitation..."
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Generate Link</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Invitations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
              <div className="text-sm text-gray-600">Expired</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>Manage assessment invitations and links</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading invitations...</div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No invitations found. Create your first invitation to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {invitation.client_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {invitation.client_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            {invitation.company_name}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(invitation.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(invitation.expires_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = `${window.location.origin}/assess/${invitation.token}`;
                                handleCopyLink(link);
                              }}
                              title="Copy Link"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {invitation.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResend(invitation.id)}
                                title="Resend"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(invitation.id)}
                              title="Delete"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Link Generated Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Assessment Link Generated!
            </DialogTitle>
            <DialogDescription>
              Share this unique link with your client to start the assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Assessment Link</span>
              </div>
              <div className="text-sm text-gray-900 break-all font-mono bg-white p-2 rounded border">
                {generatedLink}
              </div>
            </div>
            <Button onClick={() => handleCopyLink(generatedLink)} className="w-full">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvitations;

