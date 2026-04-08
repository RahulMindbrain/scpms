import { 
  Briefcase, 
  Bell, 
  Search,
  MapPin,
  Clock,
  BriefcaseBusiness
} from 'lucide-react';
import { useState } from 'react';

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'SDE Intern',
      company: 'Google',
      location: 'Bangalore',
      salary: '₹45 LPA',
      deadline: 'Apr 15, 2026',
      eligible: true,
      postedAt: '2 days ago',
      logo: 'Go',
      logoBg: 'bg-blue-600'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Microsoft',
      location: 'Hyderabad',
      salary: '₹38 LPA',
      deadline: 'Apr 18, 2026',
      eligible: true,
      postedAt: '3 days ago',
      logo: 'Mi',
      logoBg: 'bg-blue-700'
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'Amazon',
      location: 'Mumbai',
      salary: '₹28 LPA',
      deadline: 'Apr 20, 2026',
      eligible: true,
      postedAt: '5 days ago',
      logo: 'Am',
      logoBg: 'bg-cyan-600'
    },
    {
      id: 4,
      title: 'Quant Analyst',
      company: 'Goldman Sachs',
      location: 'Bangalore',
      salary: '₹55 LPA',
      deadline: 'Apr 12, 2026',
      eligible: false,
      postedAt: '1 week ago',
      logo: 'Go',
      logoBg: 'bg-blue-400'
    },
    {
      id: 5,
      title: 'System Engineer',
      company: 'Infosys',
      location: 'Pune',
      salary: '₹6.5 LPA',
      deadline: 'Apr 25, 2026',
      eligible: true,
      postedAt: '1 day ago',
      logo: 'In',
      logoBg: 'bg-cyan-700'
    },
    {
      id: 6,
      title: 'iOS Developer',
      company: 'Apple',
      location: 'Hyderabad',
      salary: '₹42 LPA',
      deadline: 'Apr 22, 2026',
      eligible: true,
      postedAt: '4 days ago',
      logo: 'Ap',
      logoBg: 'bg-blue-800'
    }
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10 py-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-5 h-5" />
          <h2 className="font-bold text-xl text-gray-800">Job Listings</h2>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative cursor-pointer group">
            <Bell className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">5</span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-cyan-600/20 border-2 border-white">PS</div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 relative group">
            {/* Eligibility Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              job.eligible 
                ? 'bg-blue-600 text-white border border-blue-600' 
                : 'bg-red-100 text-red-500 border border-red-100'
            }`}>
              {job.eligible ? 'Eligible' : 'Not Eligible'}
            </div>

            <div className="flex gap-5">
              {/* Logo */}
              <div className={`w-14 h-14 ${job.logoBg} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                {job.logo}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mt-1">
                  <BriefcaseBusiness className="w-3.5 h-3.5" />
                  <span>{job.company}</span>
                </div>
                
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-y-3 mt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                    <span className="text-blue-600 font-bold">₹</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{job.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium italic">Posted {job.postedAt}</span>
              <button 
                disabled={!job.eligible}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                  job.eligible 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' 
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Search className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-xl font-medium">No jobs found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default JobListing;

