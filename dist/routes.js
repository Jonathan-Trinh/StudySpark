"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetScoresForTesting = exports.resetDecksForTesting = exports.list = exports.loadScores = exports.saveScores = exports.loadDecks = exports.saveDecks = void 0;
// Keeps track of flashcard decks
const decks = new Map();
// Keeps track of scores
const scores = [];
/** Handles request for /saveDecks by storing the given decks. */
const saveDecks = (req, res) => {
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
    const deck = decks.has(name);
    decks.set(name, value);
    res.send({ replaced: deck });
};
exports.saveDecks = saveDecks;
/** Handles request for /loadDecks by returning the deck requested. */
const loadDecks = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    else if (decks.get(name) === undefined) {
        res.status(404).send('missing file');
        return;
    }
    else {
        res.send({ value: decks.get(name) });
    }
};
exports.loadDecks = loadDecks;
/** Handles request for /saveScores by storing the given decks. */
const saveScores = (req, res) => {
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
    scores.push(`${name}, ${deck}: ${score}%`);
    res.send({ msg: "success" });
};
exports.saveScores = saveScores;
/** Handles request for /loadScores by returning the scores requested. */
const loadScores = (_req, res) => {
    // Can't have an error since if an error were to happen it would have
    // been caught in the save scores function above.
    res.send({ value: scores.concat([]) });
};
exports.loadScores = loadScores;
/** Handles the list of saved decks */
const list = (_req, res) => {
    const names = Array.from(decks.keys());
    names.sort();
    res.send({ value: names });
};
exports.list = list;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give multiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
/** Used in tests to set the decks map back to empty. */
const resetDecksForTesting = () => {
    // Do not use this function except in tests!
    decks.clear();
};
exports.resetDecksForTesting = resetDecksForTesting;
/** Used in tests to set the decks map back to empty. */
const resetScoresForTesting = () => {
    // Do not use this function except in tests!
    scores.splice(0, scores.length);
};
exports.resetScoresForTesting = resetScoresForTesting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFZQSxpQ0FBaUM7QUFDakMsTUFBTSxLQUFLLEdBQXlCLElBQUksR0FBRyxFQUFtQixDQUFDO0FBRS9ELHdCQUF3QjtBQUN4QixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7QUFFNUIsaUVBQWlFO0FBQzFELE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDckUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDM0IsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU87S0FDUjtJQUNELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUN6RSxPQUFPO0tBQ1I7SUFDRCxNQUFNLElBQUksR0FBWSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUUvQixDQUFDLENBQUE7QUFmWSxRQUFBLFNBQVMsYUFlckI7QUFDRCxzRUFBc0U7QUFDL0QsTUFBTSxTQUFTLEdB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