
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import kbService from '../../services/kbService';
import Loading from '../../components/common/Loading';
import { TICKET_CATEGORIES } from '../../config/constants';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineCheck
} from 'react-icons/hi2';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: TICKET_CATEGORIES.NETWORK,
    content: ''
  });
  const [loading, setLoading] = useState(id !== undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = id !== undefined;

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const { data } = await kbService.getArticleById(id);
          setFormData({
            title: data.title,
            category: data.category,
            content: data.content
          });
        } catch (err) {
          console.error('Failed to fetch article', err);
          setError('Failed to load article');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const articleData = {
        ...formData,
        author: user.name,
        authorId: user.id
      };

      if (isEditMode) {
        await kbService.updateArticle(id, articleData);
        setSuccess('Article updated successfully!');
      } else {
        await kbService.createArticle(articleData);
        setSuccess('Article created successfully!');
      }

      setTimeout(() => {
        navigate('/kb');
      }, 1500);
    } catch (err) {
      console.error('Failed to save article', err);
      setError('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await kbService.deleteArticle(id);
        navigate('/kb');
      } catch (err) {
        console.error('Failed to delete article', err);
        setError('Failed to delete article');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/kb')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back to Knowledge Base
        </button>
        {isEditMode && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors"
          >
            <HiOutlineTrash className="w-4 h-4" />
            Delete Article
          </button>
        )}
      </div>

      <div className="card card-3d shadow-xl shadow-slate-200/50">
        <div className="card-header border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Article' : 'Publish New Article'}
          </h2>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl text-green-700 dark:text-green-400">
              <HiOutlineCheck className="w-6 h-6" />
              <span className="font-semibold">{success}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-700 dark:text-red-400">
              <HiOutlineExclamationCircle className="w-6 h-6" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">
                Article Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input text-lg py-4"
                placeholder="e.g., How to Reset Your Password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input py-4"
              >
                {Object.values(TICKET_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">
              Article Content (Markdown supported)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input py-4 text-base h-96 font-mono"
              placeholder="Write your article here... Use # for headings, * for lists, etc."
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-3"
            >
              {saving ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiOutlineCheck className="w-5 h-5" />
              )}
              {isEditMode ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
