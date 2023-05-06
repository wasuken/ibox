export interface Base {
  id: number;
  name: string;
}
export interface Tag extends Base {}
export interface Image extends Base {
  path: string;
  name: string;
  size: number;
  displayNo: number;
  groupImageId: number;
  createdAt: Date;
}
export interface Group extends Base {
  description: string;
  tags: Tag[];
  images: Image[];
  createdAt: Date;
}

export interface SearchParams {
  // 検索クエリ
  // undefinedなら空文字列
  query: string | undefined;
  // タグリスト
  // undefinedなら[]
  tag: string | undefined;
  // ページカーソル
  // undefinedなら0
  page: number | undefined;
}
