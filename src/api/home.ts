import { requestArticleListType } from "@/types/home";
import request from "@/utils/request";

/** 首页-文章列表 */
export const getKnowledgeListApi = (params: requestArticleListType) => {
  return request.get(`/patient/home/knowledge`, { params })
}

/** 首页-关注 */
export const likeApi = (params: { type: string; id: string }) => {
  return request.post(`/like`, params)
}