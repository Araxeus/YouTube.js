import Feed from '../../core/Feed.js';
import ItemSection from '../classes/ItemSection.js';
import { InnertubeError } from '../../utils/Utils.js';
import type Actions from '../../core/Actions.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type { ISearchResponse } from '../types/ParsedResponse.js';
import type { ApiResponse } from '../../core/Actions.js';

class Search extends Feed<ISearchResponse> {
  estimated_results: number;
  contents: ObservedArray<YTNode> | null;

  constructor(actions: Actions, data: ApiResponse | ISearchResponse) {
    super(actions, data);
    this.estimated_results = this.page.estimated_results;

    const item_section = this.memo.getType(ItemSection).first();

    if (!item_section)
      throw new InnertubeError('No item section found in search response.');

    this.contents = item_section.contents;
  }
}

export default Search;