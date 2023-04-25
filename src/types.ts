export interface Base {
  id: number;
  name: string;
}
export interface Tag extends Base {}
export interface Image extends Base {
  path: string;
  createdAt: Date;
}
export interface Group extends Base {
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
  tagList: Tag[] | undefined;
  // ページカーソル
  // undefinedなら0
  page: number | undefined;
}
