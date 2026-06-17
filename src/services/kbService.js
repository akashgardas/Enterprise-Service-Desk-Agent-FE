import api, { mockResponse } from './api';
import { mockArticles } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const kbService = {
  getArticles: async (filters = {}) => {
    if (USE_MOCK) {
      let filtered = [...mockArticles];
      if (filters.category) filtered = filtered.filter(a => a.category === filters.category);
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(query) || 
          a.content.toLowerCase().includes(query)
        );
      }
      return mockResponse(filtered);
    }
    return api.get('/articles', { params: filters });
  },

  getArticleById: async (id) => {
    if (USE_MOCK) {
      const article = mockArticles.find(a => a.id === id);
      if (article) {
        // Simulate view count increment
        article.views += 1;
        return mockResponse(article);
      }
      throw new Error('Article not found');
    }
    return api.get(`/articles/${id}`);
  },

  createArticle: async (articleData) => {
    if (USE_MOCK) {
      const newArticle = {
        id: `kb${Date.now()}`,
        ...articleData,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockArticles.unshift(newArticle);
      return mockResponse(newArticle);
    }
    return api.post('/articles', articleData);
  },

  updateArticle: async (id, updateData) => {
    if (USE_MOCK) {
      const index = mockArticles.findIndex(a => a.id === id);
      if (index !== -1) {
        mockArticles[index] = { 
          ...mockArticles[index], 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        };
        return mockResponse(mockArticles[index]);
      }
      throw new Error('Article not found');
    }
    return api.patch(`/articles/${id}`, updateData);
  },

  deleteArticle: async (id) => {
    if (USE_MOCK) {
      const index = mockArticles.findIndex(a => a.id === id);
      if (index !== -1) {
        mockArticles.splice(index, 1);
        return mockResponse({ success: true });
      }
      throw new Error('Article not found');
    }
    return api.delete(`/articles/${id}`);
  }
};

export default kbService;
