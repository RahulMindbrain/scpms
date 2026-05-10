import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileApprovalPendingProps {
  onClose?: () => void;
  onContactSupport?: () => void;
}

const ProfileApprovalPending: React.FC<ProfileApprovalPendingProps> = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm"
      >
        <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 rounded-xl">


          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-5">

              {/* Icon Section */}
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
                  <ShieldAlert className="h-10 w-10 text-amber-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <div className="flex justify-center mb-2">
                  <Badge variant="outline" className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                    Pending Approval
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Account Under Verification
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                  Your student profile is currently awaiting approval from the university administration.
                </p>
              </div>

              {/* Status Timeline */}
              <div className="w-full grid grid-cols-1 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="h-8 w-8 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Step 1</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Profile Submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20">
                  <div className="h-8 w-8 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wider">Step 2</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Under Review</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full flex flex-col sm:flex-row gap-3 pt-2"
              >


              </motion.div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  SCPMS Verification System
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileApprovalPending;
