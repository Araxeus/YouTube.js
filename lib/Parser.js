'use strict';

const Utils = require('./Utils');
const Constants = require('./Constants');

/**
 * Takes raw data from the Innertube API and refines it. 
 * Mainly used for video data and search results, as those are more complex to parse.
 */
class Parser {
  constructor(session, data, args = {}) {
    this.session = session;
    this.data = data;
    this.args = args;
  }

  parse() {
    return this.args.client === 'YOUTUBE' ? ({
      SEARCH: () => this.#parseVideoSearch(),
      PLAYLIST: () => this.#parsePlaylist(),
      VIDEO_INFO: () => this.#parseVideoInfo()
    })[this.args.data_type]() : ({
      SEARCH: () => this.#parseMusicSearch(),
      PLAYLIST: () => this.#parseMusicPlaylist()
    })[this.args.data_type]();
  }

  #parseVideoSearch() {
    const response = {};

    const contents = this.data.contents.twoColumnSearchResultsRenderer
      .primaryContents.sectionListRenderer.contents[0].itemSectionRenderer
      .contents;

    // TODO: Implement search continuation
    // const continuation_token = this.data.contents.twoColumnSearchResultsRenderer
    //   .primaryContents.sectionListRenderer.contents[1].continuationItemRenderer
    //   .continuationEndpoint.continuationCommand.token;

    response.query = contents[0].showingResultsForRenderer && contents[0].showingResultsForRenderer.originalQuery.simpleText || this.args.query;
    response.corrected_query = contents[0].showingResultsForRenderer && contents[0].showingResultsForRenderer.correctedQueryEndpoint.searchEndpoint.query || this.args.query;
    response.estimated_results = parseInt(this.data.estimatedResults);

    response.videos = contents.map((data) => {
      if (!data.videoRenderer) return;
      const video = data.videoRenderer;
      return {
        title: video.title.runs[0].text,
        description: video.detailedMetadataSnippets && video.detailedMetadataSnippets[0].snippetText.runs.map((item) => item.text).join('') || 'N/A',
        author: video.ownerText.runs[0].text,
        id: video.videoId,
        url: `https://youtu.be/${video.videoId}`,
        channel_url: `${Constants.URLS.YT_BASE_URL}${video.ownerText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
        metadata: {
          view_count: video.viewCountText && video.viewCountText.simpleText || 'N/A',
          short_view_count_text: {
            simple_text: video.shortViewCountText && video.shortViewCountText.simpleText || 'N/A',
            accessibility_label: video.shortViewCountText && (video.shortViewCountText.accessibility && video.shortViewCountText.accessibility.accessibilityData.label || 'N/A') || 'N/A',
          },
          thumbnails: video.thumbnail.thumbnails,
          duration: {
            seconds: Utils.timeToSeconds(video.lengthText && video.lengthText.simpleText || '0'),
            simple_text: video.lengthText && video.lengthText.simpleText || 'N/A',
            accessibility_label: video.lengthText && video.lengthText.accessibility.accessibilityData.label || 'N/A'
          },
          published: video.publishedTimeText && video.publishedTimeText.simpleText || 'N/A',
          badges: video.badges && video.badges.map((item) => item.metadataBadgeRenderer.label) || 'N/A',
          owner_badges: video.ownerBadges && video.ownerBadges.map((item) => item.metadataBadgeRenderer.tooltip) || 'N/A '
        }
      };
    }).filter((video) => video);

    return response;
  }

  #parsePlaylist() {
    const details = this.data.sidebar.playlistSidebarRenderer.items[0];
    const metadata = {
      title: this.data.metadata.playlistMetadataRenderer.title,
      description: details.playlistSidebarPrimaryInfoRenderer.description.simpleText || 'N/A',
      total_items: details.playlistSidebarPrimaryInfoRenderer.stats[0].runs[0].text,
      last_updated: details.playlistSidebarPrimaryInfoRenderer.stats[2].runs[1].text,
      views: details.playlistSidebarPrimaryInfoRenderer.stats[1].simpleText
    }

    const playlist_content = this.data.contents.twoColumnBrowseResultsRenderer.tabs[0]
      .tabRenderer.content.sectionListRenderer.contents[0]
      .itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;

    const items = playlist_content.map((item) => {
      if (item.playlistVideoRenderer)
      return {
        id: item.playlistVideoRenderer.videoId,
        title: item.playlistVideoRenderer.title.runs[0].text,
        author: item.playlistVideoRenderer.shortBylineText.runs[0].text,
        duration: {
          seconds: Utils.timeToSeconds(item.playlistVideoRenderer.lengthText && item.playlistVideoRenderer.lengthText.simpleText || '0'),
          simple_text: item.playlistVideoRenderer.lengthText && item.playlistVideoRenderer.lengthText.simpleText || 'N/A',
          accessibility_label: item.playlistVideoRenderer.lengthText && item.playlistVideoRenderer.lengthText.accessibility.accessibilityData.label || 'N/A'
        },
        thumbnail: item.playlistVideoRenderer.thumbnail.thumbnails,
      }
    });

    return {
      ...metadata,
      items
    }
  }

  #parseMusicSearch() {
    const tabs = this.data.contents.tabbedSearchResultsRenderer.tabs;
    const contents = tabs[0].tabRenderer.content.sectionListRenderer.contents;

    if (contents.length <= 1)
      return { songs: [], videos: [], albums: [], playlists: [] };

    const songs_ms = contents.find((content) => content.musicShelfRenderer.title.runs[0].text == 'Songs');
    const songs = songs_ms.musicShelfRenderer.contents.map((item) => {
      const list_item = item.musicResponsiveListItemRenderer;
      if (list_item.playlistItemData)
        return {
          id: list_item.playlistItemData.videoId,
          title: list_item.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          artist: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].text,
          album: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[4].text,
          duration: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[6].text,
          thumbnail: list_item.thumbnail.musicThumbnailRenderer.thumbnail,
          getLyrics: () => this.session.getLyrics(list_item.playlistItemData.videoId)
        };
    }).filter((item) => item); // Filters out undefined items, which are usually generated by unavailable videos.

    const videos_ms = contents.find((content) => content.musicShelfRenderer.title.runs[0].text == 'Videos');
    const videos = videos_ms.musicShelfRenderer.contents.map((item) => {
      const list_item = item.musicResponsiveListItemRenderer;
      if (list_item.playlistItemData)
        return {
          id: list_item.playlistItemData.videoId,
          title: list_item.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          author: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].text,
          views: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[4].text,
          duration: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[6].text,
          thumbnail: list_item.thumbnail.musicThumbnailRenderer.thumbnail,
          getLyrics: () => this.session.getLyrics(list_item.playlistItemData.videoId)
        };
    }).filter((item) => item);

    const albums_ms = contents.find((content) => content.musicShelfRenderer.title.runs[0].text == 'Albums');
    const albums = albums_ms.musicShelfRenderer.contents.map((item) => {
      const list_item = item.musicResponsiveListItemRenderer;
      return {
        title: list_item.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
        author: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].text,
        year: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs.find((run) => /^[12][0-9]{3}$/.test(run.text)).text,
        thumbnail: list_item.thumbnail.musicThumbnailRenderer.thumbnail,
      };
    });

    const playlists_ms = contents.find((content) => content.musicShelfRenderer.title.runs[0].text == 'Community playlists');
    const playlists = playlists_ms.musicShelfRenderer.contents.map((item) => {
      const list_item = item.musicResponsiveListItemRenderer;
      const watch_playlist_endpoint = list_item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
        .playNavigationEndpoint.watchPlaylistEndpoint;

      return {
        id: watch_playlist_endpoint.playlistId,
        title: list_item.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
        author: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].text,
        channel_id: list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].navigationEndpoint.browseEndpoint.browseId,
        total_items: parseInt(list_item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[4].text.match(/\d+/g)),
      };
    });

    return { songs, videos, albums, playlists };
  }

  #parseMusicPlaylist() {
    const details = this.data.header.musicDetailHeaderRenderer;

    const metadata = {
      title: details.title.runs[0].text,
      description: details.description && details.description.runs.map((run) => run.text).join('') || 'N/A',
      total_items: parseInt(details.secondSubtitle.runs[0].text.match(/\d+/g)),
      duration: details.secondSubtitle.runs[2].text,
      year: details.subtitle.runs[4].text
    };

    const contents = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
    const playlist_content = contents[0].musicPlaylistShelfRenderer.contents;

    const items = playlist_content.map((item) => {
      const item_renderer = item.musicResponsiveListItemRenderer;
      const fixed_columns = item_renderer.fixedColumns;
      const flex_columns = item_renderer.flexColumns;

      return {
        id: item_renderer.playlistItemData && item_renderer.playlistItemData.videoId,
        title: flex_columns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
        author: flex_columns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
        duration: fixed_columns[0].musicResponsiveListItemFixedColumnRenderer.text.runs[0].text,
        thumbnail: item_renderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
      }
    }).filter((item) => item.id);

    return {
      ...metadata,
      items
    }
  }

  #parseVideoInfo() {
    const desktop_v = this.args.desktop_v;

    const playability_status = desktop_v && this.data.playabilityStatus ||
      this.data[2].playerResponse.playabilityStatus;

    if (playability_status.status == 'ERROR')
      throw new Error(`Could not retrieve details for this video: ${playability_status.status} - ${playability_status.reason}`);

    const details = desktop_v && this.data.videoDetails ||
      this.data[2].playerResponse.videoDetails;

    const microformat = desktop_v && this.data.microformat.playerMicroformatRenderer ||
      this.data[2].playerResponse.microformat.playerMicroformatRenderer;

    const streaming_data = desktop_v && this.data.streamingData ||
      this.data[2].playerResponse.streamingData;

    const response = {
      id: '',
      title: '',
      description: '',
      thumbnail: [],
      metadata: {}
    };

    const mf_raw_data = Object.entries(microformat);
    const dt_raw_data = Object.entries(details);

    mf_raw_data.forEach((entry) => {
      const key = Utils.camelToSnake(entry[0]);
      if (Constants.METADATA_KEYS.includes(key)) {
        key == 'view_count' && (response.metadata[key] = parseInt(entry[1])) ||
          key == 'owner_profile_url' && (response.metadata.channel_url = entry[1]) ||
          key == 'owner_channel_name' && (response.metadata.channel_name = entry[1]) ||
          (response.metadata[key] = entry[1]);
      } else {
        response[key] = entry[1];
      }
    });

    dt_raw_data.forEach((entry) => {
      const key = Utils.camelToSnake(entry[0]);
      if (Constants.BLACKLISTED_KEYS.includes(key)) return;
      if (Constants.METADATA_KEYS.includes(key)) {
        key == 'view_count' && (response.metadata[key] = parseInt(entry[1])) ||
          (response.metadata[key] = entry[1]);
      } else {
        key == 'short_description' && (response.description = entry[1]) ||
          key == 'thumbnail' && (response.thumbnail = entry[1].thumbnails.slice(-1)[0]) ||
          key == 'video_id' && (response.id = entry[1]) ||
          (response[key] = entry[1]);
      }
    });

    if (!desktop_v) {
      const dislike_available = this.data[3].response.contents.singleColumnWatchNextResults.results.results.contents[1]
        .slimVideoMetadataSectionRenderer.contents[1].slimVideoActionBarRenderer.buttons[1].slimMetadataToggleButtonRenderer
        .button.toggleButtonRenderer.defaultText.accessibility && true || false;

      response.metadata.likes = parseInt(this.data[3].response.contents.singleColumnWatchNextResults.results.results.contents[1]
        .slimVideoMetadataSectionRenderer.contents[1].slimVideoActionBarRenderer.buttons[0].slimMetadataToggleButtonRenderer
        .button.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/\D/g, ''));

      response.metadata.dislikes = dislike_available && parseInt(this.data[3].response.contents.singleColumnWatchNextResults.results.results.contents[1]
        .slimVideoMetadataSectionRenderer.contents[1].slimVideoActionBarRenderer.buttons[1].slimMetadataToggleButtonRenderer
        .button.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/\D/g, '')) || 0;
    }

    response.metadata.available_qualities = [...new Set(streaming_data.adaptiveFormats.filter(v => v.qualityLabel)
      .map(v => v.qualityLabel).sort((a, b) => + a.replace(/\D/gi, '') - + b.replace(/\D/gi, '')))];

    return response;
  }
}

module.exports = Parser;