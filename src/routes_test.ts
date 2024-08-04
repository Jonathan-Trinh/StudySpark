import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { list, loadDecks, loadScores, resetDecksForTesting, resetScoresForTesting, saveDecks, saveScores } from './routes';


describe('routes', function () {
    it('saveDecks', function () {
        // First branch, straight line code, error case (missing name)
        const req1 = httpMocks.createRequest(
            { method: 'POST', url: '/api/saveDecks', body: { value: "some stuff" } });
        const res1 = httpMocks.createResponse();
        saveDecks(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(),
            'required argument "name" was missing');

        // Second branch, straight line code, error case (missing value)
        const req2 = httpMocks.createRequest(
            { method: 'POST', url: '/api/saveDecks', body: { name: "A" } });
        const res2 = httpMocks.createResponse();
        saveDecks(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(),
            'required argument "value" was missing or invalid');

        // Third branch, Success!
        const req3 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Math", value: [{ front: "2+2", back: "4" }] }
        });
        const res3 = httpMocks.createResponse();
        saveDecks(req3, res3);

        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData(), { replaced: false });

        const req4 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Palindrome", value: [{ front: "101", back: "101" }] }
        });
        const res4 = httpMocks.createResponse();
        saveDecks(req4, res4);

        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), { replaced: false });

        // Called to clear all saved files created in this test
        //    to not effect future tests
        resetDecksForTesting();
    });

    it('loadDecks', function () {
        // Test 1: undefined input
        const saveReq3 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: undefined, value: "file value" }
        });
        const saveResp3 = httpMocks.createResponse();
        saveDecks(saveReq3, saveResp3);
        const loadReq3 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadDecks', query: { name: undefined } });
        const loadRes3 = httpMocks.createResponse();
        loadDecks(loadReq3, loadRes3);
        assert.strictEqual(loadRes3._getStatusCode(), 400);
        assert.deepStrictEqual(loadRes3._getData(), 'required argument "name" was missing');
        // Test 2: undefined input
        const saveReq4 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: false, value: "file value" }
        });
        const saveResp4 = httpMocks.createResponse();
        saveDecks(saveReq4, saveResp4);
        const loadReq4 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadDecks', query: { name: false } });
        const loadRes4 = httpMocks.createResponse();
        loadDecks(loadReq4, loadRes4);
        assert.strictEqual(loadRes4._getStatusCode(), 400);
        assert.deepStrictEqual(loadRes4._getData(), 'required argument "name" was missing');
        // Error case: missing decks
        // Test 1: undefined decks
        const saveReq5 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "qwerty", value: undefined }
        });
        const saveResp5 = httpMocks.createResponse();
        saveDecks(saveReq5, saveResp5);
        const loadReq5 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadDecks', query: { name: "qwerty" } });
        const loadRes5 = httpMocks.createResponse();
        loadDecks(loadReq5, loadRes5);
        assert.strictEqual(loadRes5._getStatusCode(), 404);
        assert.deepStrictEqual(loadRes5._getData(), 'missing file');
        // Test 2: unsaved decks
        const saveReq6 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "abc", value: "test" }
        });
        const saveResp6 = httpMocks.createResponse();
        saveDecks(saveReq6, saveResp6);
        const loadReq6 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadDecks', query: { name: "dash" } });
        const loadRes6 = httpMocks.createResponse();
        loadDecks(loadReq6, loadRes6);
        assert.strictEqual(loadRes6._getStatusCode(), 404);
        assert.deepStrictEqual(loadRes6._getData(), 'missing file');
        // Valid Case: both inputs are proper
        // Test 1:
        const saveReq = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Math", value: [{ front: "4+4", back: "8" }] }
        });
        const saveResp = httpMocks.createResponse();
        saveDecks(saveReq, saveResp);
        // Now we can actually (mock a) request to load the transcript
        const loadReq = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadDecks', query: { name: "Math" } });
        const loadRes = httpMocks.createResponse();
        loadDecks(loadReq, loadRes);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes._getData(), { value: [{ front: "4+4", back: "8" }] });
        resetDecksForTesting();
        // Test 2: 
        const saveReq2 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Idk", value: [{ front: "Idk", back: "Idk" }] }
        });
        const saveResp2 = httpMocks.createResponse();
        saveDecks(saveReq2, saveResp2);
        // Now we can actually (mock a) request to load the transcript
        const loadReq2 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadDecks', query: { name: "Idk" } });
        const loadRes2 = httpMocks.createResponse();
        loadDecks(loadReq2, loadRes2);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes2._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes2._getData(), { value: [{ front: "Idk", back: "Idk" }] });
        resetDecksForTesting();
    });
    it('saveScores', function () {
        // Missing player Name 
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: '/saveScores',
            body: {
                name: undefined,
                deckName: '??',
                value: 100
            }
        });
        const res1 = httpMocks.createResponse();
        saveScores(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');
        // Missing deck name
        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: '/saveScores',
            body: {
                name: 'Jonathan',
                deckName: undefined,
                value: 100
            }
        });
        const res2 = httpMocks.createResponse();
        saveScores(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'required argument "deckName" was missing');
        // Test case for missing value
        const req3 = httpMocks.createRequest({
            method: 'POST',
            url: '/saveScores',
            body: {
                name: 'Jon',
                deckName: 'Math',
                value: undefined
            }
        });
        const res3 = httpMocks.createResponse();
        saveScores(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        assert.deepStrictEqual(res3._getData(), 'required argument "value" was missing or invalid');

        // Test case for valid inputs
        const req4 = httpMocks.createRequest({
            method: 'POST',
            url: '/saveScores',
            body: {
                name: 'Jared',
                deckName: 'CSE 331',
                value: 100
            }
        });
        const res4 = httpMocks.createResponse();
        saveScores(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), ({ msg: "success" }));
        resetScoresForTesting();
    })
    it('loadScores', function () {
        // 0 Scores
        const loadReq = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadScores', query: { name: "Jerry", deckName: "CSE 331", value: 10 } });
        const loadRes = httpMocks.createResponse();
        loadScores(loadReq, loadRes);
        assert.deepStrictEqual(loadRes._getData(), { value: [] });
        resetScoresForTesting();
        // 1 Score
        const req4 = httpMocks.createRequest({
            method: 'POST',
            url: '/saveScores',
            body: {
                name: 'Jared',
                deckName: 'CSE 331',
                value: 100
            }
        });
        const res4 = httpMocks.createResponse();
        saveScores(req4, res4);
        const loadReq2 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadScores' });
        const loadRes2 = httpMocks.createResponse();
        loadScores(loadReq2, loadRes2);
        assert.strictEqual(loadRes2._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes2._getData(), { value: ["Jared,CSE 331:100"] });
        // 2 Scores
        const req5 = httpMocks.createRequest({
            method: 'POST',
            url: '/saveScores',
            body: {
                name: 'Jerry',
                deckName: 'CSE 331',
                value: 90
            }
        });
        const res5 = httpMocks.createResponse();
        saveScores(req5, res5);

        const loadReq3 = httpMocks.createRequest(
            { method: 'GET', url: '/api/loadScores' });
        const loadRes3 = httpMocks.createResponse();
        loadScores(loadReq3, loadRes3);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes3._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes3._getData(), { value: ["Jared,CSE 331:100","Jerry,CSE 331:90"] });
        resetScoresForTesting();
    })

    it('list', function () {
        // List call with empty 
        const req1 = httpMocks.createRequest(
            { method: 'GET', url: '/api/list', query: { name: '' } });
        const res1 = httpMocks.createResponse();
        list(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepEqual(res1._getData(), { value: [] });


        // 1 Saved file 
        const savereq3 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Math", value: [{ front: "2+2", back: "4" }] }
        });
        const saveres3 = httpMocks.createResponse();
        saveDecks(savereq3, saveres3);
        const listReq2 = httpMocks.createRequest(
            { method: 'GET', url: '/api/list', query: { name: "Math" } });
        const listRes2 = httpMocks.createResponse();
        list(listReq2, listRes2);
        assert.strictEqual(listRes2._getStatusCode(), 200);
        assert.deepStrictEqual(listRes2._getData(), { value: ["Math"] });
        // 2 Saved files
        const savereq4 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Sat Practice", value: [{ front: "A", back: "The mitochondria are the powerhouses of cells" }] }
        });
        const saveres4 = httpMocks.createResponse();
        saveDecks(savereq4, saveres4);
        const saveResp4 = httpMocks.createResponse();
        saveDecks(savereq4, saveResp4);
        const listReq3 = httpMocks.createRequest(
            { method: 'GET', url: '/api/list', query: { name: ["Math", "Sat Practice"] } });
        const listRes3 = httpMocks.createResponse();
        list(listReq3, listRes3);
        assert.strictEqual(listRes3._getStatusCode(), 200);
        assert.deepStrictEqual(listRes3._getData(), { value: ["Math", "Sat Practice"] });
        resetDecksForTesting()
    });


});
