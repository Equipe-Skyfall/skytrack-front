import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Tipos para conteúdo educacional
export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'tutorial' | 'quiz';
  category: 'meteorologia' | 'climatologia' | 'sistemas' | 'analise-dados';
  level: 'iniciante' | 'intermediario' | 'avancado';
  duration?: number; // em minutos
  imageUrl?: string;
  contentUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  isBookmarked?: boolean;
}

export interface ContentFilter {
  type: string;
  category: string;
  level: string;
  searchTerm: string;
}

export interface ProgressData {
  totalContent: number;
  completedContent: number;
  inProgressContent: number;
  bookmarkedContent: number;
}

export const useEducacaoPage = () => {
  const { user } = useAuth();
  
  // Estado dos dados
  const [contents, setContents] = useState<EducationalContent[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado da UI
  const [filters, setFilters] = useState<ContentFilter>({
    type: '',
    category: '',
    level: '',
    searchTerm: '',
  });
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  // Simulação de carregamento de conteúdo educacional
  const loadEducationalContent = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      const mockContents: EducationalContent[] = [
        {
          id: '1',
          title: 'Introdução à Meteorologia',
          description: 'Conceitos básicos sobre fenômenos meteorológicos e como interpretá-los.',
          type: 'video',
          category: 'meteorologia',
          level: 'iniciante',
          duration: 15,
          imageUrl: '/images/meteorologia-intro.jpg',
          contentUrl: '/videos/meteorologia-intro.mp4',
          tags: ['meteorologia', 'clima', 'tempo'],
          createdAt: '2024-01-01T00:00:00.000Z',
          views: 1205,
          likes: 89,
          isBookmarked: false,
        },
        {
          id: '2',
          title: 'Análise de Dados Climáticos',
          description: 'Como interpretar e analisar dados coletados pelas estações meteorológicas.',
          type: 'tutorial',
          category: 'analise-dados',
          level: 'intermediario',
          duration: 30,
          imageUrl: '/images/analise-dados.jpg',
          contentUrl: '/tutorials/analise-dados',
          tags: ['dados', 'análise', 'estatística'],
          createdAt: '2024-01-05T00:00:00.000Z',
          views: 856,
          likes: 67,
          isBookmarked: true,
        },
        {
          id: '3',
          title: 'Sistemas de Monitoramento',
          description: 'Entenda como funcionam os sistemas de monitoramento meteorológico.',
          type: 'article',
          category: 'sistemas',
          level: 'avancado',
          duration: 20,
          imageUrl: '/images/sistemas-monitoramento.jpg',
          contentUrl: '/articles/sistemas-monitoramento',
          tags: ['sistemas', 'monitoramento', 'tecnologia'],
          createdAt: '2024-01-10T00:00:00.000Z',
          views: 643,
          likes: 45,
          isBookmarked: false,
        },
        {
          id: '4',
          title: 'Quiz: Conhecimentos Básicos',
          description: 'Teste seus conhecimentos sobre meteorologia básica.',
          type: 'quiz',
          category: 'meteorologia',
          level: 'iniciante',
          duration: 10,
          imageUrl: '/images/quiz-basico.jpg',
          contentUrl: '/quiz/conhecimentos-basicos',
          tags: ['quiz', 'avaliação', 'básico'],
          createdAt: '2024-01-15T00:00:00.000Z',
          views: 2341,
          likes: 156,
          isBookmarked: false,
        },
      ];
      
      const mockProgress: ProgressData = {
        totalContent: mockContents.length,
        completedContent: 2,
        inProgressContent: 1,
        bookmarkedContent: mockContents.filter(c => c.isBookmarked).length,
      };
      
      setContents(mockContents);
      setProgress(mockProgress);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conteúdo educacional');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducationalContent();
  }, []);

  // Handlers da página
  const onFilterChange = (newFilters: Partial<ContentFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const onClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      level: '',
      searchTerm: '',
    });
  };

  const onSelectContent = (content: EducationalContent) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  const onCloseContentModal = () => {
    setSelectedContent(null);
    setShowContentModal(false);
  };

  const onToggleBookmark = async (contentId: string) => {
    try {
      setContents(prev => prev.map(content => 
        content.id === contentId 
          ? { ...content, isBookmarked: !content.isBookmarked }
          : content
      ));
      
      // Atualizar progresso
      const updatedContents = contents.map(content => 
        content.id === contentId 
          ? { ...content, isBookmarked: !content.isBookmarked }
          : content
      );
      setProgress(prev => prev ? {
        ...prev,
        bookmarkedContent: updatedContents.filter(c => c.isBookmarked).length,
      } : null);
    } catch (error: any) {
      alert(error.message || 'Erro ao favoritar conteúdo');
    }
  };

  const onLikeContent = async (contentId: string) => {
    try {
      setContents(prev => prev.map(content => 
        content.id === contentId 
          ? { ...content, likes: content.likes + 1 }
          : content
      ));
    } catch (error: any) {
      alert(error.message || 'Erro ao curtir conteúdo');
    }
  };

  const onViewContent = async (contentId: string) => {
    try {
      setContents(prev => prev.map(content => 
        content.id === contentId 
          ? { ...content, views: content.views + 1 }
          : content
      ));
    } catch (error: any) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  // Filtros aplicados
  const filteredContents = contents.filter(content => {
    const matchType = !filters.type || content.type === filters.type;
    const matchCategory = !filters.category || content.category === filters.category;
    const matchLevel = !filters.level || content.level === filters.level;
    const matchSearch = !filters.searchTerm || 
      content.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    return matchType && matchCategory && matchLevel && matchSearch;
  });

  // Computed values
  const progressPercentage = progress 
    ? Math.round((progress.completedContent / progress.totalContent) * 100)
    : 0;

  const contentsByCategory = {
    meteorologia: contents.filter(c => c.category === 'meteorologia').length,
    climatologia: contents.filter(c => c.category === 'climatologia').length,
    sistemas: contents.filter(c => c.category === 'sistemas').length,
    'analise-dados': contents.filter(c => c.category === 'analise-dados').length,
  };

  const contentsByType = {
    video: contents.filter(c => c.type === 'video').length,
    article: contents.filter(c => c.type === 'article').length,
    tutorial: contents.filter(c => c.type === 'tutorial').length,
    quiz: contents.filter(c => c.type === 'quiz').length,
  };

  const bookmarkedContents = contents.filter(c => c.isBookmarked);
  const popularContents = contents.sort((a, b) => b.views - a.views).slice(0, 3);

  return {
    // Estado dos dados
    user,
    contents,
    progress,
    loading,
    error,
    
    // Estado da UI
    filters,
    selectedContent,
    showContentModal,
    
    // Handlers
    onFilterChange,
    onClearFilters,
    onSelectContent,
    onCloseContentModal,
    onToggleBookmark,
    onLikeContent,
    onViewContent,
    loadEducationalContent,
    
    // Computed values
    filteredContents,
    progressPercentage,
    contentsByCategory,
    contentsByType,
    bookmarkedContents,
    popularContents,
  };
};