import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import kbService from '../../services/kbService';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineShare, HiOutlinePrinter } from 'react-icons/hi2';
import { ROLES } from '../../config/constants';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const { data } = await kbService.getArticleById(id);
      setArticle(data);
    } catch (err) {
      setError(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await kbService.deleteArticle(id);
        navigate('/kb');
      } catch (err) {
        alert('Failed to delete article');
      }
    }
  };

  if (loading) return <Loading fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchArticle} />;
  if (!article) return null;

  const canEdit = hasRole([ROLES.ADMIN, ROLES.AGENT]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/kb')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back to Knowledge Base
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 text-text-secondary hover:bg-bg-secondary rounded-lg transition-colors" title="Print">
            <HiOutlinePrinter className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:bg-bg-secondary rounded-lg transition-colors" title="Share">
            <HiOutlineShare className="w-5 h-5" />
          </button>
          {canEdit && (
            <>
              <div className="w-px h-6 bg-border-color mx-1"></div>
              <button 
                onClick={() => navigate(`/kb/edit/${article.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl transition-all font-semibold text-sm"
              >
                <HiOutlinePencilSquare className="w-5 h-5" />
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-all font-semibold text-sm"
              >
                <HiOutlineTrash className="w-5 h-5" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <article className="bg-bg-card rounded-3xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-text-secondary text-sm">•</span>
            <span className="text-text-secondary text-sm">Last updated {new Date(article.updatedAt).toLocaleDateString()}</span>
            <span className="text-text-secondary text-sm">•</span>
            <span className="text-text-secondary text-sm">{article.views} views</span>
          </div>

          <h1 className="text-4xl font-extrabold text-text-primary mb-10 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 mb-12 p-4 bg-bg-secondary/50 rounded-2xl border border-border-color/50">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg uppercase">
              {article.author?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-bold text-text-primary">{article.author}</p>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Article Author</p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-text-primary space-y-6">
            {article.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold pt-6 border-b border-border-color pb-2">{line.substring(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-xl font-bold pt-4">{line.substring(4)}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
              }
              if (line.match(/^\d+\./)) {
                return <li key={i} className="ml-6 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
              }
              if (line.startsWith('`')) {
                return <code key={i} className="block p-4 bg-bg-secondary rounded-xl font-mono text-sm border border-border-color my-4">{line.replace(/`/g, '')}</code>;
              }
              return line.trim() ? <p key={i} className="leading-relaxed text-lg">{line}</p> : <br key={i} />;
            })}
          </div>
        </div>
      </article>

      <div className="card p-8 bg-primary-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary-600/20">
        <div>
          <h3 className="text-xl font-bold mb-1">Was this article helpful?</h3>
          <p className="text-primary-100">Your feedback helps us improve our documentation.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all active:scale-95 shadow-lg">
            Yes, it helped
          </button>
          <button className="px-8 py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-all active:scale-95 border border-primary-500">
            No, I need help
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
