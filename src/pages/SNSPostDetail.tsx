import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Eye, User, Calendar, Instagram, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

interface SNSPostDetail {
  id: number;
  category: number;
  boardTitle: string;
  boardContent: string;
  viewCount: number;
  instagramLink?: string;
  images: string[];
  createdAt: string;
  modifiedAt: string | null;
  deletedAt: string | null;
  likeCount: number | null;
  comments: any[] | null;
  userId: number;
  nickname: string;
}

interface APIResponse {
  code: number;
  data: SNSPostDetail;
  message: string;
}

const SNSPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [postDetail, setPostDetail] = useState<SNSPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/v1/boards/sns/${id}`);
        
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }

        const data: APIResponse = await response.json();
        setPostDetail(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  // Instagram embed.js 동적 로딩
  useEffect(() => {
    if (postDetail?.instagramLink) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      const checkAndRender = setInterval(() => {
        const embedTarget = document.querySelector('.instagram-media');
        if (window.instgrm && embedTarget) {
          window.instgrm.Embeds.process();
          clearInterval(checkAndRender);
        }
      }, 300);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        clearInterval(checkAndRender);
      };
    }
  }, [postDetail]);

  const handleBack = () => {
    navigate('/board?category=sns');
  };

  const handleDelete = async () => {
    if (!isLoggedIn || !user || !id) {
      toast({
        title: "삭제 실패",
        description: "로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/boards/lost/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "게시글 삭제 완료",
          description: "게시글이 성공적으로 삭제되었습니다.",
        });
        navigate('/board?category=sns');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "게시글 삭제 실패",
          description: errorData.message || "게시글 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      toast({
        title: "게시글 삭제 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !postDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || '게시글을 찾을 수 없습니다'}
          </h1>
          <Button onClick={handleBack} variant="outline">
            SNS 홍보 게시판으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = isLoggedIn && user && user.id === postDetail.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                SNS 홍보
              </Badge>
              
              {/* 수정/삭제 버튼 */}
              {isAuthor && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => navigate(`/edit-sns-post/${id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50" disabled={isDeleting}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        {isDeleting ? '삭제 중...' : '삭제'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 게시글이 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {postDetail.boardTitle}
            </h1>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{postDetail.nickname}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(postDetail.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{postDetail.viewCount}</span>
              </div>
            </div>

            {/* Instagram Embed */}
            {postDetail.instagramLink && (
              <div className="mb-8 flex justify-center">
                <blockquote
                  className="instagram-media w-full max-w-lg"
                  data-instgrm-permalink={postDetail.instagramLink}
                  data-instgrm-version="14"
                ></blockquote>
              </div>
            )}

            {/* 첨부 이미지 */}
            {postDetail.images && postDetail.images.length > 0 && (
              <div className="mb-8">
                {postDetail.images.length === 1 ? (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={postDetail.images[0]}
                      alt="첨부 이미지"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {postDetail.images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <div className="aspect-square rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`첨부 이미지 ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {postDetail.boardContent}
              </p>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Heart className="w-5 h-5 mr-2" />
                  좋아요 {postDetail.likeCount || 0}
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  댓글 {postDetail.comments?.length || 0}
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>조회 {postDetail.viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNSPostDetail;