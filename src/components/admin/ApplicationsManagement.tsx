import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Filter,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BubbleCard from '@/components/ui/BubbleCard';
import { useApplications, Application, ApplicationStatus } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Eye },
  accepted: { label: 'Accepted', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
};

export default function ApplicationsManagement() {
  const { allApplications, isLoadingAll, updateApplicationStatus } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('pending');

  const filteredApps = allApplications.filter(app => {
    const matchesSearch = app.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.discord_username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenApp = (app: Application) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || '');
    setNewStatus(app.status);
  };

  const handleUpdateStatus = () => {
    if (!selectedApp) return;
    updateApplicationStatus.mutate({
      applicationId: selectedApp.id,
      status: newStatus,
      adminNotes,
    });
    setSelectedApp(null);
  };

  const statusCounts = {
    all: allApplications.length,
    pending: allApplications.filter(a => a.status === 'pending').length,
    reviewing: allApplications.filter(a => a.status === 'reviewing').length,
    accepted: allApplications.filter(a => a.status === 'accepted').length,
    rejected: allApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <BubbleCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Applications Management
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="pl-10 bg-white/5 w-64 border-white/10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | 'all')}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="reviewing">Reviewing ({statusCounts.reviewing})</SelectItem>
              <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoadingAll ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-4 text-muted-foreground font-medium">Applicant</th>
                <th className="pb-4 text-muted-foreground font-medium">Discord</th>
                <th className="pb-4 text-muted-foreground font-medium">PR Score</th>
                <th className="pb-4 text-muted-foreground font-medium">Status</th>
                <th className="pb-4 text-muted-foreground font-medium">Applied</th>
                <th className="pb-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;
                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-fused-blue/30 flex items-center justify-center border border-white/20">
                          {app.ign[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium">{app.ign}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {app.discord_username || '-'}
                    </td>
                    <td className="py-4">
                      {app.pr_score ? (
                        <span className="text-primary font-medium">{app.pr_score} PR</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-4">
                      <Badge className={cn("border", status.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground text-sm">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenApp(app)}
                        className="border-white/10 hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl bg-background/95 backdrop-blur border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Application from {selectedApp?.ign}
            </DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/5">
                <div>
                  <span className="text-xs text-muted-foreground uppercase">IGN</span>
                  <p className="font-medium">{selectedApp.ign}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Discord</span>
                  <p className="font-medium">{selectedApp.discord_username || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">PR Score</span>
                  <p className="font-medium text-primary">{selectedApp.pr_score || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Region</span>
                  <p className="font-medium">{selectedApp.region || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Age</span>
                  <p className="font-medium">{selectedApp.age || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Availability</span>
                  <p className="font-medium">{selectedApp.availability || '-'}</p>
                </div>
              </div>

              {/* Why Join */}
              <div className="p-4 rounded-lg bg-white/5">
                <span className="text-xs text-muted-foreground uppercase">Why do they want to join?</span>
                <p className="mt-2">{selectedApp.why_join}</p>
              </div>

              {/* Experience */}
              {selectedApp.experience && (
                <div className="p-4 rounded-lg bg-white/5">
                  <span className="text-xs text-muted-foreground uppercase">Experience</span>
                  <p className="mt-2">{selectedApp.experience}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Admin Notes
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Update Status</label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ApplicationStatus)}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updateApplicationStatus.isPending}
                  className="mt-6 bg-primary hover:bg-primary/90"
                >
                  {updateApplicationStatus.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BubbleCard>
  );
}
