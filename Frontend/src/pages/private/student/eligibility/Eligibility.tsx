import { 
  CheckCircle, 
  Briefcase, 
  Bell, 
  XCircle,
  Info,
  TrendingUp,
  Search,
  Filter,
  User
} from 'lucide-react';

const Eligibility = () => {
  const eligibilitySummary = [
    { label: 'Eligible Companies', value: '5', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Not Eligible', value: '2', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  ];

  const companies = [
    { 
      name: 'Google', 
      role: 'SDE Intern', 
      minCGPA: '8.0+', 
      branches: 'CSE, IT', 
      status: 'Eligible', 
      reason: 'All criteria met',
      active: true 
    },
    { 
      name: 'Microsoft', 
      role: 'Full Stack Dev', 
      minCGPA: '7.5+', 
      branches: 'CSE, IT, ECE', 
      status: 'Eligible', 
      reason: 'All criteria met',
      active: true 
    },
    { 
      name: 'Amazon', 
      role: 'Data Analyst', 
      minCGPA: '8.5+', 
      branches: 'CSE', 
      status: 'Eligible', 
      reason: 'All criteria met',
      active: true 
    },
    { 
      name: 'Goldman Sachs', 
      role: 'Quant Analyst', 
      minCGPA: '9.0+', 
      branches: 'CSE, Math', 
      status: 'Not Eligible', 
      reason: 'CGPA below 9.0 (yours: 8.7)',
      active: false 
    },
    { 
      name: 'Apple', 
      role: 'iOS Developer', 
      minCGPA: '8.0+', 
      branches: 'CSE', 
      status: 'Eligible', 
      reason: 'All criteria met',
      active: true 
    },
  ];

  const studentProfile = {
    cgpa: 8.7,
    branch: 'CSE',
    backlogs: 'No Backlogs'
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10 py-2">
        <div className="flex items-center gap-2 text-gray-600">
          <CheckCircle className="w-5 h-5" />
          <h2 className="font-bold text-xl text-gray-800">Eligibility Status</h2>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {eligibilitySummary.map((stat) => (
          <div key={stat.label} className={`bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${stat.border} flex items-center gap-6 hover:translate-y-[-4px] transition-all duration-300`}>
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Summary Strip */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Your Eligibility Profile</h3>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <span className="w-3.5 h-3.5"><Info /></span>
              <span>Eligibility is based on current profile data</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current CGPA</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-xl font-bold text-gray-800">{studentProfile.cgpa} <span className="text-sm text-gray-400 font-medium">/ 10.0</span></span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Branch</p>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span className="text-xl font-bold text-gray-800">{studentProfile.branch}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Backlogs</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                <span className="text-xl font-bold text-gray-800">{studentProfile.backlogs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company List */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h3 className="text-lg font-bold text-gray-800">Company-wise Eligibility</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search companies..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {companies.map((company, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                company.active 
                  ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200 px-6' 
                  : 'bg-red-50/30 border-red-100 hover:border-red-200 px-6'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shadow-sm ${
                    company.active ? 'bg-white text-emerald-600' : 'bg-white text-red-600'
                  }`}>
                    {company.active ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{company.name}</h4>
                      <span className="text-gray-400">—</span>
                      <span className="font-semibold text-gray-600">{company.role}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Min CGPA: <span className="text-gray-900 font-bold">{company.minCGPA}</span></span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-xs text-gray-500 font-medium">Branches: <span className="text-gray-900 font-bold">{company.branches}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold ${
                      company.active ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {company.reason}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      company.active 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    }`}>
                      {company.status}
                    </span>
                  </div>
                  {company.active && (
                     <button className="text-[10px] font-bold text-blue-600 hover:underline">View Job Details</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eligibility;

