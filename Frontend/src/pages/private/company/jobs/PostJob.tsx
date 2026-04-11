import React from 'react';
import { Button } from '@/components/ui/button';

const PostJob: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post a New Job</h1>
        <p className="text-slate-500 font-medium">Fill in the details below to create a new recruitment drive.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Job Title</label>
              <input 
                type="text" 
                placeholder="e.g., Software Engineer" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Employment Type</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 bg-white">
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Package (LPA)</label>
              <input 
                type="text" 
                placeholder="e.g., 8-12" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <input 
                type="text" 
                placeholder="e.g., Bangalore, India" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Min CGPA Required</label>
              <input 
                type="text" 
                placeholder="e.g., 7.0" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Application Deadline</label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Job Description</label>
            <textarea 
              rows={4} 
              placeholder="Describe the role, responsibilities, and requirements..." 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-none"
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">Eligible Branches</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'].map((branch) => (
                <label key={branch} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{branch}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Selection Process</label>
            <textarea 
              rows={2} 
              placeholder="e.g., Aptitude Test → Technical Interview → HR Interview" 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button size="lg" className="px-8 font-bold">Post Job</Button>
          <Button variant="outline" size="lg" className="px-8 font-bold">Save as Draft</Button>
        </div>
      </div>
    </div>
  );
};

export default PostJob;

