/** 首页-文章列表-请求参数 */
export interface requestArticleListType {
	current?: number;
	pageSize?: number;
	type?: string;
}

/** 首页-文章列表类型 */
export interface articleListType {
	commentNumber: number;
	likeFlag: number;
	creatorName: string;
	creatorAvatar: string;
	creatorTitles: string;
	creatorHospatalName: string;
	creatorDep: string;
	hospatalGrade: string;
	id: string;
	content: string;
	coverUrl: string[];
	creatorId: string;
	title: string;
	topic: string;
	collectionNumber: string;
}

/** 首页-关注-医生信息类型 */
export interface doctorListType {
	likeFlag: number;
	id: string;
	name: string;
	avatar: string;
	major: string;
	score: string;
	consultationNum: string;
	serviceFee: string;
	positionalTitles: string;
	hospitalName: string;
	gradeName: string;
	depName: string;
}