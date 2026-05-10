import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';

interface CompanyApprovalPendingProps {
  isOpen: boolean;
}

const CompanyApprovalPending: React.FC<CompanyApprovalPendingProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      preventOutsideClick={true}
      className="max-w-md border-none bg-transparent shadow-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#1e1f26] rounded-[2rem]">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />

          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              
              {/* Icon Section */}
              <div className="relative">
                <div className="h-24 w-24 rounded-[2rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-inner">
                  <Building2 className="h-12 w-12 text-amber-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/10 shadow-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <div className="flex justify-center mb-2">
                  <Badge variant="outline" className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400">
                    Verification Required
                  </Badge>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Account Not Approved
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Your company account is currently under review by the university administration. You will have full access once your credentials are verified.
                </p>
              </div>

              {/* Status Steps */}
              <div className="w-full space-y-3 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Step 1</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Registration Submitted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] to-transparent" />
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="text-left relative z-10">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Step 2</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Admin Verification In Progress</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  SCPMS Security Protocols
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Modal>
  );
};

export default CompanyApprovalPending;
