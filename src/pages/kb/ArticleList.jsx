import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import kbService from '../../services/kbService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineBookOpen, HiOutlineEye, HiOutlineChevronRight } from 'react-icons/hi2';
import { TICKET_CATEGORIES, ROLES } from '../../config/constants';

const ArticleList = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await kbService.getArticles({
        search: searchQuery,
        category: selectedCategory === 'All' ? null : selectedCategory
      });
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const canManageKB = hasRole([ROLES.ADMIN, ROLES.AGENT, ROLES.MANAGER]);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Knowledge Base</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1 text-lg font-medium">Access official guides, troubleshooting steps, and company policies.</p>
        </div>
        {canManageKB && (
          <button 
            onClick={() => navigate('/kb/new')}
            className="btn-primary flex items-center gap-2 py-3 px-8 shadow-xl shadow-blue-600/30"
          >
            <HiOutlinePlus className="w-6 h-6" />
            Publish Article
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="card shadow-xl shadow-slate-200/50">
            <div className="card-header">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Categories</h3>
            </div>
            <div className="p-3 space-y-1">
              {['All', ...Object.values(TICKET_CATEGORIES)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {cat}
                  <HiOutlineChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === cat ? 'translate-x-0 opacity-100' : 'translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="lg:col-span-3 space-y-8">
          <div className="relative group">
            <HiOutlineMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search documentation, guides, and policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-14 text-lg py-5 shadow-lg shadow-slate-200/50"
            />
          </div>

          {loading ? (
            <Loading />
          ) : articles.length === 0 ? (
            <EmptyState 
              title="No documentation found" 
              message="We couldn't find any articles matching your search criteria."
              icon={HiOutlineBookOpen}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className="card hover:shadow-2xl hover:translate-y-[-4px] transition-all cursor-pointer group border-transparent hover:border-blue-100 dark:hover:border-blue-900/50"
                  onClick={() => navigate(`/kb/${article.id}`)}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className="badge badge-blue">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <HiOutlineEye className="w-4 h-4" />
                        {article.views} Views
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-4 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
                      {article.content.replace(/[#*`]/g, '')}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {article.author?.charAt(0) || 'A'}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{article.author}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(article.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
