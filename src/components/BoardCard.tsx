
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, User, Instagram, Heart } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  views: number;
  instagramLink?: string;
  images?: string[]; // 여러 이미지를 위한 배열
  // 실종/목격 구분 필드
  missingType?: 'MS' | 'WT';
}

interface BoardCardProps {
  post: Post;
}

const BoardCard = ({ post }: BoardCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (post.category === 'sns') {
      navigate(`/sns-post/${post.id}`);
    } else if (post.category === 'adoption') {
      navigate(`/adoption-review/${post.id}`);
    } else if (post.category === 'missing') {
      navigate(`/missing-animal/${post.id}`);
    } else {
      console.log('Navigate to general post detail:', post.id);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'adoption':
        return '입양 후기';
      case 'sns':
        return 'SNS 홍보';
      case 'missing':
        // missingType에 따라 실종/목격 구분
        return post.missingType === 'MS' ? '실종' : post.missingType === 'WT' ? '목격' : '실종/목격';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'adoption':
        return 'bg-green-100 text-green-800';
      case 'sns':
        return 'bg-blue-100 text-blue-800';
      case 'missing':
        // missingType에 따라 색상 구분
        return post.missingType === 'MS' ? 'bg-red-100 text-red-800' : 
               post.missingType === 'WT' ? 'bg-orange-100 text-orange-800' : 
               'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 대표 이미지를 결정하는 함수
  const getThumbnailImage = () => {
    // SNS 게시물이고 Instagram 링크가 있는 경우
    if (post.category === 'sns' && post.instagramLink) {
      const postId = post.instagramLink.split('/p/')[1]?.split('/')[0];
      if (postId) {
        return `https://images.unsplash.com/photo-1611095564982-c1cb2cccefae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
      }
    }

    // 여러 이미지가 있는 경우 첫 번째 이미지 사용
    if (post.images && post.images.length > 0) {
      return post.images[0];
    }
    
    // 기본 imageUrl이 있는 경우
    if (post.imageUrl) {
      return post.imageUrl;
    }
    
    // 이미지가 없는 경우 기본 아이콘 이미지 반환
    return null;
  };

  const thumbnailImage = getThumbnailImage();

  return (
    <Card 
      className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        {thumbnailImage ? (
          <img 
            src={thumbnailImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
            <Heart className="w-16 h-16 text-orange-400" />
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`${getCategoryColor(post.category)} hover:${getCategoryColor(post.category)} text-xs flex items-center gap-1`}>
            {post.category === 'sns' && <Instagram className="w-3 h-3" />}
            {getCategoryLabel(post.category)}
          </Badge>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{post.views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardCard;
