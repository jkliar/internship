import React, { useState } from 'react';
import { Student, Job, Company, Recommendation, UserRole } from '../types';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Users2, 
  Sparkles,
  TrendingUp,
  FileCheck,
  Check,
  BookOpen
} from 'lucide-react';

interface AcademicHomeProps {
  jobs: Job[];
  students: Student[];
  recommendations: Recommendation[];
  companies: Company[];
  onSwitchToRole: (role: UserRole, actorId: string) => void;
  onApplyQuick: (jobId: string) => void;
  currentRole: UserRole;
  currentActorId: string;
}

export default function AcademicHome({
  jobs,
  students,
  recommendations,
  companies,
  onSwitchToRole,
  onApplyQuick,
  currentRole,
  currentActorId
}: AcademicHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filter lists
  const majors = ['ALL', '컴퓨터공학과', '인공지능학과', '통계학과', '소프트웨어학과'];
  const regions = ['ALL', '서울', '경기', '대전', '원격/하이브리드'];

  // Match logic for filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMajor = selectedMajor === 'ALL' || 
                         job.title.includes(selectedMajor) || 
                         job.description.includes(selectedMajor) ||
                         // Guess compatibility
                         (selectedMajor === '컴퓨터공학과' && (job.title.includes('React') || job.title.includes('웹'))) ||
                         (selectedMajor === '인공지능학과' && (job.title.includes('데이터') || job.title.includes('과학') || job.title.includes('파이프라인')));

    const matchesRegion = selectedRegion === 'ALL' || 
                          (selectedRegion === '서울' && job.location.includes('서울')) ||
                          (selectedRegion === '경기' && job.location.includes('경기')) ||
                          (selectedRegion === '대전' && job.location.includes('대전')) ||
                          (selectedRegion === '원격/하이브리드' && (job.location.includes('하이브리드') || job.location.includes('재택')));

    return matchesSearch && matchesMajor && matchesRegion;
  });

  // Get outstanding verified students (with APPROVED recommendations)
  const verifiedStudents = students.filter(s => s.recommendationStatus === 'VERIFIED');

  // Find recommendation text for a student
  const getStudentRecommendation = (studentEmail: string) => {
    return recommendations.find(r => r.studentEmail === studentEmail && r.status === 'APPROVED');
  };

  // Stats calculate
  const totalVerifiedPartners = companies.filter(c => c.verificationStatus === 'VERIFIED').length;
  const activeApplicationsCount = recommendations.length;

  return (
    <div className="space-y-10" id="academic-homepage">
      
      {/* 🚀 Header Hero section (Hibrain style banner with premium look) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-indigo-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 px-3/5 py-1 rounded-full text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            대학 검증형 고신뢰 매칭 네트워크 (Hibrain Hub)
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight leading-tight">
              교수진이 직접 추천하는 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-blue-200 to-sky-100">
                1% 최상위 전문 인재
              </span>와 기업의 만남
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              어뷰징 없는 검증 필터링. 국내 우수 대학 소속 교수의 직접 디지털 날인 서명이 완료된 추천 신원 및 확실히 검증된 파트너 기업만 참여할 수 있는 전문 학술 매칭 센터입니다.
            </p>
          </div>

          {/* Search bar & statistics integration */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 flex flex-col md:flex-row gap-2 max-w-2xl shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 text-slate-900">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="전공 학과, 연구 인턴십, 또는 기업명을 검색하세요..." 
                className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition text-white px-6 py-2.5 rounded-xl font-bold text-sm shrink-0 flex items-center gap-1.5 shadow-md">
                <span>검색</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick info badges */}
          <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-slate-300 font-medium border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>전 학년 학부생/석박사 검증 완료</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>선별 인증된 파트너 벤처/중견 대기업</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>추천 무단 사용 방지 토큰 시스템</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Platforms Core Stats Panel (Hibrain statistics grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">누적 참여 교수진</div>
            <div className="text-xl font-extrabold text-slate-900">22 명</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">검증 인재 (이달)</div>
            <div className="text-xl font-extrabold text-slate-900">{students.length} 명</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">공식 교수 추천서</div>
            <div className="text-xl font-extrabold text-slate-900">{recommendations.length} 건</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">신원인증 파트너사</div>
            <div className="text-xl font-extrabold text-slate-900">{totalVerifiedPartners} 개소</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Structure: Jobs on leftmost side, verified outstanding talents spotlight on rightmost side. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Job Board Announcements (8/12 layout) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                🔥 모집 중인 핵심 산학연 인턴십 공고
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {filteredJobs.length}건
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">교수의 공식 추천 서명 검증이 완료된 대학 전용 특별 선발 채용입니다.</p>
            </div>

            {/* Region / Field toggles */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="text-xs border border-slate-300 rounded-lg p-1.5 bg-white font-medium focus:outline-indigo-500"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              >
                <option value="ALL">전체 전공 분야</option>
                {majors.slice(1).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select 
                className="text-xs border border-slate-300 rounded-lg p-1.5 bg-white font-medium focus:outline-indigo-500"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="ALL">전체 지역</option>
                {regions.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-10 text-center text-slate-400">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">설정된 조건에 부합하는 활성 채용 공고가 없습니다.</p>
                <button 
                  onClick={() => { setSelectedMajor('ALL'); setSelectedRegion('ALL'); setSearchQuery(''); }}
                  className="mt-3 text-[11px] text-indigo-600 font-bold hover:underline"
                >
                  필터 전체 초기화
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const comp = companies.find(c => c.id === job.companyId);
                return (
                  <div 
                    key={job.id}
                    id={`job-card-${job.id}`}
                    onClick={() => setSelectedJob(job)}
                    className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-200 shadow-3xs hover:shadow-xs cursor-pointer relative overflow-hidden"
                  >
                    {/* Header line detail */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{job.companyLogo || '🏢'}</span>
                          <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition">
                            {job.companyName}
                          </span>
                          {comp?.verificationStatus === 'VERIFIED' && (
                            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-[10px] text-emerald-700 px-1.5 py-0.2 rounded-full font-bold border border-emerald-100">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" /> 신원인증
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-slate-900">
                          {job.title}
                        </h3>
                      </div>

                      <span className="shrink-0 text-[10.5px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {job.salary}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Requirements Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {job.requirements.slice(0, 2).map((req, idx) => (
                        <span key={idx} className="text-[10px] bg-indigo-50 border border-indigo-100/70 text-indigo-700 px-2 py-0.5 rounded-md font-semibold font-mono">
                          {req}
                        </span>
                      ))}
                      {job.preferences.length > 0 && (
                        <span className="text-[10px] bg-purple-50 border border-purple-100/70 text-purple-700 px-2 py-0.5 rounded-md font-semibold">
                          우대: {job.preferences[0]}
                        </span>
                      )}
                    </div>

                    {/* Footer card detail */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span>|</span>
                        <span>지원자: <strong className="text-indigo-600">{job.applicantsCount}</strong>명</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>자세히 보기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Spotlight Excellent Recommendation Talents (5/12 layout) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-600" />
              ✨ 이달의 최고 검증 우수 인재
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                실명보증
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">교수진 승인코드를 검증받은 보증 인재 리스트입니다 (개인보호 안심 마스킹).</p>
          </div>

          <div className="relative space-y-4">
            {verifiedStudents.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400">
                <Users2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">인증 절차가 마무리된 우수 인재가 아직 출현하지 않았습니다.</p>
                <p className="text-[10px] text-slate-400 mt-1">김태진 교수 대시보드나 암호 생성 후 학생으로 등록해보세요.</p>
              </div>
            ) : (
              verifiedStudents.map((stud) => {
                const reco = getStudentRecommendation(stud.email);
                // Mask the name e.g. 강민수 -> 강*수 to make it professional
                const nameLength = stud.name.length;
                let maskedName = stud.name;
                if (nameLength === 3) {
                  maskedName = `${stud.name[0]}*${stud.name[2]}`;
                } else if (nameLength === 2) {
                  maskedName = `${stud.name[0]}*`;
                } else if (nameLength > 3) {
                  maskedName = `${stud.name.substring(0, 2)}*${stud.name.substring(nameLength - 1)}`;
                }

                return (
                  <div 
                    key={stud.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs relative overflow-hidden space-y-4 hover:border-slate-350 transition"
                  >
                    {/* Top Accent line for recommended profile */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-teal-400 to-indigo-500"></div>

                    {/* Student Basic Metadata */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800">
                            {maskedName} 학우 ({stud.university})
                          </span>
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-[9.5px] text-emerald-800 font-bold px-1.5 py-0.2 rounded-full border border-emerald-150">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 animate-pulse" /> 교수서명 완료
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {stud.major} · 학부생
                        </p>
                      </div>

                      {reco && (
                        <div className="text-right">
                          <div className="text-[10.5px] font-bold text-slate-700">
                            추천인: {reco.professorName}
                          </div>
                          <div className="text-[9.5px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded-md inline-block">
                            {reco.relationship}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bio Statement */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11.5px] text-slate-600 leading-normal">
                      <p className="italic font-medium">
                        "{stud.resume.bio || '대학 추천을 징증받은 인재입니다.'}"
                      </p>
                    </div>

                    {/* Technical skill chips */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">주요 검증 보유역량</div>
                      <div className="flex flex-wrap gap-1">
                        {stud.resume.skills.map((skill, idx) => (
                          <span key={idx} className="text-[10.5px] font-mono font-semibold bg-indigo-50/70 text-indigo-700 px-2 py-0.5 rounded-lg border border-indigo-150/40">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Advisor's strong points quotes */}
                    {reco && (
                      <div className="pt-2.5 border-t border-slate-100 space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3_h-3 text-slate-400" />
                          지도교수 평가 소견
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {reco.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {reco.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Simulate Switch to Application Interaction */}
                    <div className="pt-2.5 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => onSwitchToRole('STUDENT', stud.id)}
                        className="text-[11px] bg-slate-900 text-white hover:bg-slate-800 font-bold px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        지원이력 및 대시보드 바로가기
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 🤝 University Partners Section (Visual Branding to make it look realistic and reliable) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-3xs space-y-4">
        <div className="text-center space-y-0.5 max-w-md mx-auto">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">참여 협력 기관 리스트</h3>
          <p className="text-sm font-extrabold text-slate-800">국내 유수의 학문 기관 및 첨단 기술 기업이 공동 참여합니다.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center items-center pt-2">
          <div className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition">
            🏫 한국대학교
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition">
            🏫 글로벌대학교
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition">
            🏢 (주)네오소프트
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition">
            🏢 메타버스 테크
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition font-serif italic">
            KAIST 연계랩
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition font-mono">
            POSTECH 파트너십
          </div>
        </div>
      </div>

      {/* 🔍 Job Detail Dialog Modal Overlay */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                  채용 공고 상세 정보
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {selectedJob.title}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {selectedJob.companyName} · {selectedJob.location}
                </p>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-800 mb-1">💼 업무 소개 및 목표</div>
                <p>{selectedJob.description}</p>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <span className="text-indigo-600 font-bold">•</span> 지원 및 필수 전제조건
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium font-mono">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <span className="text-purple-600 font-bold">•</span> 선발 우대 사항
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                  {selectedJob.preferences.map((pref, idx) => (
                    <li key={idx}>{pref}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-[11px]">
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 text-blue-950">
                  <span className="block font-bold text-slate-550 text-[10px] uppercase">월 급여 수당</span>
                  <span className="font-extrabold text-xs">{selectedJob.salary}</span>
                </div>
                <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 text-purple-950">
                  <span className="block font-bold text-slate-550 text-[10px] uppercase">지원 자격 심사</span>
                  <span className="font-extrabold text-xs">교수 지도 서명 필수인증</span>
                </div>
              </div>

              {/* High visibility alert */}
              <div className="bg-amber-50 border border-amber-100/90 text-amber-900 rounded-xl p-3 text-[11px] leading-relaxed font-medium">
                ⚠️ 본 서비스는 학업 성과 보증에 동의하는 학생들을 매칭하기 위한 특화 플랫폼입니다. 
                현재 활성화된 학생 계정 대시보드에서 <strong>추천 검증</strong>(스승 승인코드 입력 혹은 추천서 수동 업로드)을 완료한 순간에만 '지원하기' 버튼이 즉시 잠금해제 작동하도록 설계되어 있습니다.
              </div>
            </div>

            {/* Application Simulation Actions inside modal */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end">
              <button 
                onClick={() => setSelectedJob(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                닫기
              </button>
              
              <button 
                onClick={() => {
                  setSelectedJob(null);
                  // Dynamic redirect based on login
                  if (currentRole === 'STUDENT') {
                    // Quick apply
                    onApplyQuick(selectedJob.id);
                  } else {
                    // Redirect and explain
                    alert(`현재 채용공고에 응모하기 위해 '🎓 학생 대시보드'로 전환합니다.`);
                    onSwitchToRole('STUDENT', currentActorId.startsWith('stud-') ? currentActorId : 'stud-jiwon');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1"
              >
                <span>인턴 지원하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
