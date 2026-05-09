import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, CheckCircle2, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileApprovalPendingProps {
  onClose?: () => void;
  onContactSupport?: () => void;
}

const ProfileApprovalPending: React.FC<ProfileApprovalPendingProps> = ({ onClose, onContactSupport }) => {
  return (
    <div className="flex items-center justify-center p-4 min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="relative overflow-hidden border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem]">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-8">
              
              {/* Icon Section */}
              <div className="relative">
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl"
                >
                  <ShieldAlert className="h-12 w-12 text-amber-600 dark:text-amber-500" />
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white dark:bg-slate-800 border-4 border-transparent shadow-lg flex items-center justify-center"
                >
                  <Clock className="h-5 w-5 text-amber-600 animate-spin-slow" />
                </motion.div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge variant="warning" className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Pending Approval
                    </Badge>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    🔒 Account Under <span className="text-amber-600">Verification</span>
                  </h2>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto"
                >
                  Your student profile is currently awaiting approval from the university administration. 
                  <span className="block mt-2 font-bold text-slate-900 dark:text-slate-200">
                    Profile editing will be enabled after verification is completed.
                  </span>
                </motion.p>
              </div>

              {/* Status Timeline / Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4"
              >
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 1</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Profile Submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Step 2</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Under Review</p>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button 
                  onClick={onClose}
                  className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl h-14 font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Got it
                </Button>
                <Button 
                  onClick={onContactSupport}
                  variant="outline"
                  className="flex-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl h-14 font-black transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Contact Support
                </Button>
              </motion.div>

              {/* Footer Note */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">
                SCPMS SECURE VERIFICATION SYSTEM
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileApprovalPending;
