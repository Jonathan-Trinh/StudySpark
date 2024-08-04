import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

export type Flashcard = {
  readonly front: string,
  readonly back: string,
};

// Keeps track of flashcard decks
const decks: Map<string, unknown> = new Map<string, unknown>();

// Keeps track of scores
const scores: string[] = [];

/** Handles request for /saveDecks by storing the given decks. */
export const saveDecks = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  const value = req.body.value;
  if (value === undefined || !Array.isArray(value)) {
    res.status(400).send('required argument "value" was missing or invalid');
    return;
  }
  const deck: boolean = decks.has(name);
  decks.set(name, value);
  res.send({ replaced: deck });

}
/** Handles request for /loadDecks by returning the deck requested. */
export const loadDecks = (req: SafeRequest, res: SafeResponse): void => {
  const name: string | undefined = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  } else if (decks.get(name) === undefined) {
    res.status(404).send('missing file');
    return;
  } else {
    res.send({ value: decks.get(name) })
  }
}
/** Handles request for /saveScores by storing the given decks. */
export const saveScores = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  const deck = req.body.deckName;
  if (deck === undefined || typeof deck !== 'string') {
    res.status(400).send('required argument "deckName" was missing');
    return;
  }
  const score = req.body.value;
  if (score === undefined) {
    res.status(400).send('required argument "value" was missing or invalid');
    return;
  }
  scores.push(`${name}, ${deck}: ${score}%`)
  res.send({msg: "success"})
}
/** Handles request for /loadScores by returning the scores requested. */
export const loadScores = (_req: SafeRequest, res: SafeResponse): void => {
  // Can't have an error since if an error were to happen it would have
  // been caught in the save scores function above.
  res.send({ value: scores.concat([]) })
}
/** Handles the list of saved decks */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  const names: Array<string> = Array.from(decks.keys())
  names.sort();
  res.send({ value: names });
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give multiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/** Used in tests to set the decks map back to empty. */
export const resetDecksForTesting = (): void => {
  // Do not use this function except in tests!
  decks.clear();
};
/** Used in tests to set the decks map back to empty. */
export const resetScoresForTesting = (): void => {
  // Do not use this function except in tests!
  scores.splice(0,scores.length);
};