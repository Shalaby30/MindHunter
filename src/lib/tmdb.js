const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWNhNDNmZDQwYmIyMTc0YjBlYmY3ODI1MzBkNjZhYyIsIm5iZiI6MTcyNTM4ODg1OC40NjY1NjYsInN1YiI6IjY2YWM0ZGU1YzQ0ZDZjMjAzZDYzMWE3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PUiqDxRUk7aB9BTN_tsnkJj3c-4TbZHJ59UaYIGgRHk";

export const IMG = {
  poster: (path, size = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  backdrop: (path, size = "w1280") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
};

async function tmdbFetch(endpoint, params = {}, { cache } = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
    // auth & account data must never be cached (tokens are single-use)
    ...(cache === "no-store"
      ? { cache: "no-store" }
      : { next: { revalidate: 3600 } }),
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${endpoint}`);
  }

  return res.json();
}

// Normalize movie / tv results into one shape the UI can consume
export function normalizeTitle(item, forcedType) {
  const mediaType = forcedType || item.media_type || "movie";
  return {
    id: item.id,
    mediaType,
    title: item.title || item.name || "Untitled",
    overview: item.overview || "",
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : null,
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    genreIds: item.genre_ids || [],
  };
}

export async function getTrendingAll() {
  const data = await tmdbFetch("/trending/all/week");
  return data.results
    .filter((i) => i.media_type === "movie" || i.media_type === "tv")
    .map((i) => normalizeTitle(i));
}

export async function getTrendingMovies() {
  const data = await tmdbFetch("/trending/movie/week");
  return data.results.map((i) => normalizeTitle(i, "movie"));
}

export async function getTrendingTv() {
  const data = await tmdbFetch("/trending/tv/week");
  return data.results.map((i) => normalizeTitle(i, "tv"));
}

export async function getTopRatedMovies() {
  const data = await tmdbFetch("/movie/top_rated");
  return data.results.map((i) => normalizeTitle(i, "movie"));
}

export async function getNowPlaying() {
  const data = await tmdbFetch("/movie/now_playing");
  return data.results.map((i) => normalizeTitle(i, "movie"));
}

export async function getAiringTodayTv() {
  const data = await tmdbFetch("/tv/airing_today");
  return data.results.map((i) => normalizeTitle(i, "tv"));
}

export async function getGenres() {
  const [movie, tv] = await Promise.all([
    tmdbFetch("/genre/movie/list"),
    tmdbFetch("/genre/tv/list"),
  ]);
  const map = {};
  [...movie.genres, ...tv.genres].forEach((g) => {
    map[g.id] = g.name;
  });
  return map;
}

// ---------- detail pages ----------

export const IMG_PROFILE = (path, size = "w185") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

function formatRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function normalizeDetail(item, mediaType) {
  return {
    ...normalizeTitle(item, mediaType),
    tagline: item.tagline || "",
    genres: (item.genres || []).map((g) => g.name),
    runtime:
      mediaType === "movie"
        ? formatRuntime(item.runtime)
        : item.episode_run_time?.[0]
          ? formatRuntime(item.episode_run_time[0])
          : null,
    status: item.status || null,
    seasons: item.number_of_seasons || null,
    episodes: item.number_of_episodes || null,
    seasonList: (item.seasons || [])
      .filter((s) => s.season_number > 0)
      .map((s) => ({
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        airDate: s.air_date,
        poster: s.poster_path,
        overview: s.overview || "",
      })),
    creators: (item.created_by || []).map((c) => c.name),
    director:
      mediaType === "movie"
        ? item.credits?.crew?.find((c) => c.job === "Director")?.name || null
        : null,
    cast: (item.credits?.cast || []).slice(0, 14).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile: c.profile_path,
    })),
    trailer:
      item.videos?.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
      ) ||
      item.videos?.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      ) ||
      item.videos?.results?.find((v) => v.site === "YouTube") ||
      null,
    similar: (item.similar?.results || [])
      .slice(0, 12)
      .map((i) => normalizeTitle(i, mediaType)),
  };
}

export async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  });
  return normalizeDetail(data, "movie");
}

export async function getTvDetails(id) {
  const data = await tmdbFetch(`/tv/${id}`, {
    append_to_response: "credits,videos,similar",
  });
  return normalizeDetail(data, "tv");
}

export async function getSeasonDetails(tvId, seasonNumber) {
  const data = await tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
  return {
    seasonNumber: data.season_number,
    name: data.name,
    overview: data.overview || "",
    poster: data.poster_path,
    airDate: data.air_date,
    episodes: (data.episodes || []).map((ep) => ({
      id: ep.id,
      episodeNumber: ep.episode_number,
      name: ep.name,
      overview: ep.overview || "",
      still: ep.still_path,
      airDate: ep.air_date,
      runtime: ep.runtime || null,
      rating: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : null,
    })),
  };
}

// client-side: fetch the best trailer key for a title on demand
export async function getTrailerKey(mediaType, id) {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}/videos`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const videos = data.results || [];
    const pick =
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      videos.find((v) => v.site === "YouTube");
    return pick?.key || null;
  } catch {
    return null;
  }
}

// ---------- discover / browse ----------

export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Box Office", movieOnly: true },
  { value: "first_air_date.desc", label: "Newest", tvOnly: true },
];

export async function discoverTitles(mediaType, { genre, sort, page } = {}) {
  const params = {
    page: String(page || 1),
    sort_by: sort || "popularity.desc",
    "vote_count.gte": "50",
    include_adult: "false",
  };
  if (genre) params.with_genres = String(genre);

  const data = await tmdbFetch(`/discover/${mediaType}`, params);
  return {
    results: data.results.map((i) => normalizeTitle(i, mediaType)),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
}

export async function getGenreList(mediaType) {
  const data = await tmdbFetch(`/genre/${mediaType}/list`);
  return data.genres;
}

// ---------- moods ----------

// Each mood maps to a TMDB discover recipe (genre ids are TMDB's own)
export const MOODS = [
  {
    key: "laugh",
    label: "Make Me Laugh",
    tagline: "Comedies and feel-good picks",
    movieGenres: "35",
    tvGenres: "35",
    sort: "popularity.desc",
  },
  {
    key: "thrill",
    label: "Edge of My Seat",
    tagline: "Thrillers, crime and suspense",
    movieGenres: "53,80",
    tvGenres: "80,9648",
    sort: "vote_average.desc",
  },
  {
    key: "cry",
    label: "Need a Good Cry",
    tagline: "Heavy drama and bittersweet romance",
    movieGenres: "18,10749",
    tvGenres: "18",
    sort: "vote_average.desc",
  },
  {
    key: "think",
    label: "Bend My Mind",
    tagline: "Mysteries and sci-fi that demand attention",
    movieGenres: "9648,878",
    tvGenres: "9648,10765",
    sort: "vote_average.desc",
  },
  {
    key: "scare",
    label: "Scare Me",
    tagline: "Horror for a lights-on night",
    movieGenres: "27",
    tvGenres: "9648,10765",
    sort: "popularity.desc",
  },
  {
    key: "escape",
    label: "Take Me Away",
    tagline: "Adventure and fantasy worlds",
    movieGenres: "12,14",
    tvGenres: "10765,10759",
    sort: "popularity.desc",
  },
  {
    key: "family",
    label: "Family Night",
    tagline: "Safe picks everyone can enjoy",
    movieGenres: "10751,16",
    tvGenres: "10751,10762",
    sort: "popularity.desc",
  },
  {
    key: "learn",
    label: "Show Me Something Real",
    tagline: "Documentaries and true stories",
    movieGenres: "99,36",
    tvGenres: "99",
    sort: "vote_average.desc",
  },
];

export async function discoverByMood(moodKey, mediaType, page = 1) {
  const mood = MOODS.find((m) => m.key === moodKey);
  if (!mood) throw new Error(`Unknown mood: ${moodKey}`);

  const genres = mediaType === "tv" ? mood.tvGenres : mood.movieGenres;
  const data = await tmdbFetch(`/discover/${mediaType}`, {
    page: String(page),
    sort_by: mood.sort,
    with_genres: genres,
    "vote_count.gte": "100",
    include_adult: "false",
  });
  return {
    results: data.results.map((i) => normalizeTitle(i, mediaType)),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
}

export async function searchTitles(mediaType, query, page = 1) {
  const data = await tmdbFetch(`/search/${mediaType}`, {
    query,
    page: String(page),
    include_adult: "false",
  });
  return {
    results: data.results.map((i) => normalizeTitle(i, mediaType)),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
}

export async function searchMulti(query, page = 1) {
  const data = await tmdbFetch("/search/multi", {
    query,
    page: String(page),
    include_adult: "false",
  });
  return {
    results: data.results
      .filter((i) => i.media_type === "movie" || i.media_type === "tv")
      .map((i) => normalizeTitle(i)),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
}

// ---------- people ----------

export function normalizePerson(p) {
  return {
    id: p.id,
    name: p.name,
    profile: p.profile_path,
    knownFor: p.known_for_department || null,
    popularity: p.popularity ? Math.round(p.popularity) : null,
  };
}

export async function getTrendingPeople() {
  const data = await tmdbFetch("/trending/person/week");
  return data.results
    .filter((p) => p.profile_path)
    .slice(0, 20)
    .map(normalizePerson);
}

export async function getPersonDetails(id) {
  const data = await tmdbFetch(`/person/${id}`, {
    append_to_response: "combined_credits,images",
  });

  const seen = new Set();
  const credits = (data.combined_credits?.cast || [])
    .filter(
      (c) =>
        (c.media_type === "movie" || c.media_type === "tv") &&
        c.poster_path &&
        !seen.has(`${c.media_type}-${c.id}`) &&
        seen.add(`${c.media_type}-${c.id}`)
    )
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 30)
    .map((c) => normalizeTitle(c));

  const crewCredits = (data.combined_credits?.crew || [])
    .filter(
      (c) =>
        (c.media_type === "movie" || c.media_type === "tv") &&
        c.poster_path &&
        (c.job === "Director" || c.job === "Creator" || c.job === "Writer") &&
        !seen.has(`${c.media_type}-${c.id}`) &&
        seen.add(`${c.media_type}-${c.id}`)
    )
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 20)
    .map((c) => normalizeTitle(c));

  return {
    id: data.id,
    name: data.name,
    biography: data.biography || "",
    profile: data.profile_path,
    birthday: data.birthday || null,
    deathday: data.deathday || null,
    placeOfBirth: data.place_of_birth || null,
    knownFor: data.known_for_department || null,
    credits,
    crewCredits,
  };
}

// ---------- watch providers ----------

export async function getWatchProviders(mediaType, id) {
  try {
    const data = await tmdbFetch(`/${mediaType}/${id}/watch/providers`);
    const us = data.results?.US;
    if (!us) return null;
    const map = (list) =>
      (list || []).slice(0, 8).map((p) => ({
        id: p.provider_id,
        name: p.provider_name,
        logo: p.logo_path,
      }));
    return {
      link: us.link || null,
      stream: map(us.flatrate),
      rent: map(us.rent),
      buy: map(us.buy),
    };
  } catch {
    return null;
  }
}

// ---------- TMDB user auth ----------

async function tmdbPost(endpoint, body, sessionId) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  if (sessionId) url.searchParams.set("session_id", sessionId);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.status_message || "TMDB auth failed");
  return data;
}

export async function createRequestToken() {
  const data = await tmdbFetch(
    "/authentication/token/new",
    {},
    { cache: "no-store" }
  );
  return data.request_token;
}

export async function createSession(requestToken) {
  const data = await tmdbPost("/authentication/session/new", {
    request_token: requestToken,
  });
  return data.session_id;
}

export async function getAccount(sessionId) {
  const data = await tmdbFetch(
    "/account",
    { session_id: sessionId },
    { cache: "no-store" }
  );
  return {
    id: data.id,
    username: data.username,
    name: data.name || data.username,
    avatar: data.avatar?.tmdb?.avatar_path || null,
  };
}

export async function deleteSession(sessionId) {
  try {
    await tmdbPost("/authentication/session", { session_id: sessionId });
  } catch {
    // best effort
  }
}

// fetch the user's own lists from TMDB
export async function getAccountList(listType, mediaType, sessionId) {
  // listType: "favorite" | "watchlist"
  const data = await tmdbFetch(
    `/account/account_id/${listType}/${mediaType === "tv" ? "tv" : "movies"}`,
    { session_id: sessionId },
    { cache: "no-store" }
  );
  return (data.results || []).map((i) => normalizeTitle(i, mediaType));
}

// add/remove an item on the user's TMDB account
export async function markOnAccount(listType, mediaType, mediaId, active, sessionId) {
  // listType: "favorite" | "watchlist"
  await tmdbPost(
    `/account/account_id/${listType}`,
    {
      media_type: mediaType,
      media_id: mediaId,
      [listType]: active,
    },
    sessionId
  );
}
