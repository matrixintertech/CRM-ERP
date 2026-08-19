export const VISIBLE_EVIDENCE_COUNT = 3;


/*
 * Backend signed URL expires
 * after 300 seconds.
 *
 * Keep frontend cache slightly
 * shorter than URL lifetime.
 */
export const SIGNED_URL_STALE_TIME =
  4 * 60 * 1000;


export const SIGNED_URL_GC_TIME =
  5 * 60 * 1000;