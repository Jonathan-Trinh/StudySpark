"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const httpMocks = __importStar(require("node-mocks-http"));
const routes_1 = require("./routes");
describe('routes', function () {
    it('saveDecks', function () {
        // First branch, straight line code, error case (missing name)
        const req1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveDecks', body: { value: "some stuff" } });
        const res1 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');
        // Second branch, straight line code, error case (missing value)
        const req2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveDecks', body: { name: "A" } });
        const res2 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'required argument "value" was missing or invalid');
        // Third branch, Success!
        const req3 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Math", value: [{ front: "2+2", back: "4" }] }
        });
        const res3 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData(), { replaced: false });
        const req4 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Palindrome", value: [{ front: "101", back: "101" }] }
        });
        const res4 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), { replaced: false });
        // Called to clear all saved files created in this test
        //    to not effect future tests
        (0, routes_1.resetDecksForTesting)();
    });
    it('loadDecks', function () {
        // Test 1: undefined input
        const saveReq3 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: undefined, value: "file value" }
        });
        const saveResp3 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(saveReq3, saveResp3);
        const loadReq3 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDecks', query: { name: undefined } });
        const loadRes3 = httpMocks.createResponse();
        (0, routes_1.loadDecks)(loadReq3, loadRes3);
        assert.strictEqual(loadRes3._getStatusCode(), 400);
        assert.deepStrictEqual(loadRes3._getData(), 'required argument "name" was missing');
        // Test 2: undefined input
        const saveReq4 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: false, value: "file value" }
        });
        const saveResp4 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(saveReq4, saveResp4);
        const loadReq4 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDecks', query: { name: false } });
        const loadRes4 = httpMocks.createResponse();
        (0, routes_1.loadDecks)(loadReq4, loadRes4);
        assert.strictEqual(loadRes4._getStatusCode(), 400);
        assert.deepStrictEqual(loadRes4._getData(), 'required argument "name" was missing');
        // Error case: missing decks
        // Test 1: undefined decks
        const saveReq5 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "qwerty", value: undefined }
        });
        const saveResp5 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(saveReq5, saveResp5);
        const loadReq5 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDecks', query: { name: "qwerty" } });
        const loadRes5 = httpMocks.createResponse();
        (0, routes_1.loadDecks)(loadReq5, loadRes5);
        assert.strictEqual(loadRes5._getStatusCode(), 404);
        assert.deepStrictEqual(loadRes5._getData(), 'missing file');
        // Test 2: unsaved decks
        const saveReq6 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "abc", value: "test" }
        });
        const saveResp6 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(saveReq6, saveResp6);
        const loadReq6 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDecks', query: { name: "dash" } });
        const loadRes6 = httpMocks.createResponse();
        (0, routes_1.loadDecks)(loadReq6, loadRes6);
        assert.strictEqual(loadRes6._getStatusCode(), 404);
        assert.deepStrictEqual(loadRes6._getData(), 'missing file');
        // Valid Case: both inputs are proper
        // Test 1:
        const saveReq = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Math", value: [{ front: "4+4", back: "8" }] }
        });
        const saveResp = httpMocks.createResponse();
        (0, routes_1.saveDecks)(saveReq, saveResp);
        // Now we can actually (mock a) request to load the transcript
        const loadReq = httpMocks.createRequest({ method: 'GET', url: '/api/loadDecks', query: { name: "Math" } });
        const loadRes = httpMocks.createResponse();
        (0, routes_1.loadDecks)(loadReq, loadRes);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes._getData(), { value: [{ front: "4+4", back: "8" }] });
        (0, routes_1.resetDecksForTesting)();
        // Test 2: 
        const saveReq2 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Idk", value: [{ front: "Idk", back: "Idk" }] }
        });
        const saveResp2 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(saveReq2, saveResp2);
        // Now we can actually (mock a) request to load the transcript
        const loadReq2 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDecks', query: { name: "Idk" } });
        const loadRes2 = httpMocks.createResponse();
        (0, routes_1.loadDecks)(loadReq2, loadRes2);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes2._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes2._getData(), { value: [{ front: "Idk", back: "Idk" }] });
        (0, routes_1.resetDecksForTesting)();
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
        (0, routes_1.saveScores)(req1, res1);
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
        (0, routes_1.saveScores)(req2, res2);
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
        (0, routes_1.saveScores)(req3, res3);
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
        (0, routes_1.saveScores)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), ({ msg: "success" }));
        (0, routes_1.resetScoresForTesting)();
    });
    it('loadScores', function () {
        // 0 Scores
        const loadReq = httpMocks.createRequest({ method: 'GET', url: '/api/loadScores', query: { name: "Jerry", deckName: "CSE 331", value: 10 } });
        const loadRes = httpMocks.createResponse();
        (0, routes_1.loadScores)(loadReq, loadRes);
        assert.deepStrictEqual(loadRes._getData(), { value: [] });
        (0, routes_1.resetScoresForTesting)();
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
        (0, routes_1.saveScores)(req4, res4);
        const loadReq2 = httpMocks.createRequest({ method: 'GET', url: '/api/loadScores' });
        const loadRes2 = httpMocks.createResponse();
        (0, routes_1.loadScores)(loadReq2, loadRes2);
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
        (0, routes_1.saveScores)(req5, res5);
        const loadReq3 = httpMocks.createRequest({ method: 'GET', url: '/api/loadScores' });
        const loadRes3 = httpMocks.createResponse();
        (0, routes_1.loadScores)(loadReq3, loadRes3);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes3._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes3._getData(), { value: ["Jared,CSE 331:100", "Jerry,CSE 331:90"] });
        (0, routes_1.resetScoresForTesting)();
    });
    it('list', function () {
        // List call with empty 
        const req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { name: '' } });
        const res1 = httpMocks.createResponse();
        (0, routes_1.list)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepEqual(res1._getData(), { value: [] });
        // 1 Saved file 
        const savereq3 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Math", value: [{ front: "2+2", back: "4" }] }
        });
        const saveres3 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(savereq3, saveres3);
        const listReq2 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { name: "Math" } });
        const listRes2 = httpMocks.createResponse();
        (0, routes_1.list)(listReq2, listRes2);
        assert.strictEqual(listRes2._getStatusCode(), 200);
        assert.deepStrictEqual(listRes2._getData(), { value: ["Math"] });
        // 2 Saved files
        const savereq4 = httpMocks.createRequest({
            method: 'POST', url: '/api/saveDecks',
            body: { name: "Sat Practice", value: [{ front: "A", back: "The mitochondria are the powerhouses of cells" }] }
        });
        const saveres4 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(savereq4, saveres4);
        const saveResp4 = httpMocks.createResponse();
        (0, routes_1.saveDecks)(savereq4, saveResp4);
        const listReq3 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { name: ["Math", "Sat Practice"] } });
        const listRes3 = httpMocks.createResponse();
        (0, routes_1.list)(listReq3, listRes3);
        assert.strictEqual(listRes3._getStatusCode(), 200);
        assert.deepStrictEqual(listRes3._getData(), { value: ["Math", "Sat Practice"] });
        (0, routes_1.resetDecksForTesting)();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFpQztBQUNqQywyREFBNkM7QUFDN0MscUNBQTJIO0FBRzNILFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDZixFQUFFLENBQUMsV0FBVyxFQUFFO1FBQ1osOERBQThEO1FBQzlELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ2hDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEMsSUFBQSxrQkFBUyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV0QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFDbEMsc0NBQXNDLENBQUMsQ0FBQztRQUU1QyxnRUFBZ0U7UUFDaEUsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FDaEMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QyxJQUFBLGtCQUFTLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXRCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFF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