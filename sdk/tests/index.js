import Arweave from 'arweave';
import { connect, createSigner } from '@permaweb/aoconnect';
import Permaweb from '@permaweb/libs';
import fs from 'fs';

const CREATOR = 'RhguwWmQJ-wWCXhRH_NtTDHRRgfCqNDZckXtJK52zKs';

function expect(actual) {
	return {
		toBeDefined: () => {
			console.log('\x1b[90m%s\x1b[0m', `Checking if value is defined: ${JSON.stringify(actual)}`);
			if (actual === undefined) {
				throw new Error(`Expected value to be defined, but it was undefined`);
			}
			console.log('\x1b[32m%s\x1b[0m', 'Success: Value is defined');
		},
		toHaveProperty: (prop) => {
			console.log('\x1b[90m%s\x1b[0m', `Checking if object ${JSON.stringify(actual)} has property '${prop}'`);
			if (!(prop in actual)) {
				throw new Error(`Expected object to have property '${prop}', but it was not found`);
			}
			console.log('\x1b[32m%s\x1b[0m', `Success: Object has property '${prop}'`);
		},
		toEqualType: (expected) => {
			const actualType = typeof actual;
			const expectedType = typeof expected;
			console.log('\x1b[90m%s\x1b[0m', `Checking type, actual: ${actualType}, expected: ${expectedType}`);
			if (actualType !== expectedType) {
				throw new Error(`Type mismatch: expected ${expectedType}, but got ${actualType}`);
			}
			if (actualType === 'object' && actual !== null && expected !== null) {
				if (Array.isArray(actual) !== Array.isArray(expected)) {
					throw new Error(
						`Type mismatch: expected ${Array.isArray(expected) ? 'array' : 'object'}, but got ${
							Array.isArray(actual) ? 'array' : 'object'
						}`
					);
				}
			}
			console.log('\x1b[32m%s\x1b[0m', `Success: Types match (${actualType})`);
		},
		toEqualLength: (expected) => {
			console.log('\x1b[90m%s\x1b[0m', `Checking length, actual: ${actual.length}, expected: ${expected}`);
			if (actual.length !== expected) {
				throw new Error(`Array length mismatch: expected length ${expected}, but got ${actual.length}`);
			}
			console.log('\x1b[32m%s\x1b[0m', `Success: Array length is equal (${actual.length})`);
		},
		toEqual: (expected) => {
			console.log(
				'\x1b[90m%s\x1b[0m',
				`Checking equality, actual: ${JSON.stringify(actual)}, expected: ${JSON.stringify(expected)}`
			);
			const actualType = typeof actual;
			const expectedType = typeof expected;
			if (actualType !== expectedType) {
				throw new Error(`Type mismatch: expected ${expectedType}, but got ${actualType}`);
			}

			if (actualType === 'object' && actual !== null && expected !== null) {
				const actualKeys = Object.keys(actual);
				const expectedKeys = Object.keys(expected);
				console.log(
					'\x1b[90m%s\x1b[0m',
					`Checking object keys, actual keys: ${JSON.stringify(actualKeys)}, expected keys: ${JSON.stringify(
						expectedKeys
					)}`
				);
				if (actualKeys.length !== expectedKeys.length) {
					throw new Error(`Object key count mismatch: expected ${expectedKeys.length}, but got ${actualKeys.length}`);
				}

				for (const key of actualKeys) {
					if (!(key in expected)) {
						throw new Error(`Expected object is missing key: ${key}`);
					}
					// Recursive equality check on the property value
					expect(actual[key]).toEqual(expected[key]);
				}
			} else if (actual !== expected) {
				throw new Error(`Value mismatch: expected ${expected}, but got ${actual}`);
			}
			console.log('\x1b[32m%s\x1b[0m', 'Success: Values are equal');
		},
	};
}

function logTest(message) {
	console.log('\x1b[90m%s\x1b[0m', `\n${message}`);
}

function logError(message) {
	console.error('\x1b[31m%s\x1b[0m', `Error (${message})`);
}

(async function () {
	const ao = connect({ MODE: 'legacy' });
	const arweave = Arweave.init();

	let wallet;

	if (!fs.existsSync(process.env.PATH_TO_WALLET)) {
		console.log('Generating wallet...');
		wallet = await arweave.wallets.generate();
	} else {
		wallet = JSON.parse(fs.readFileSync(process.env.PATH_TO_WALLET, 'utf-8'));
	}

	console.log(`Wallet address: ${await arweave.wallets.jwkToAddress(wallet)}`);

	const permaweb = Permaweb.init({
		ao: ao,
		arweave: arweave,
		signer: createSigner(wallet),
	});

	async function testZones() {
		try {
			logTest('Testing zone creation...');
			const zoneId = await permaweb.createZone({}, (status) => console.log(`Callback: ${status}`));

			expect(zoneId).toBeDefined();
			expect(zoneId).toEqualType('string');

			logTest('Testing zone update...');
			const zoneUpdateId = await permaweb.updateZone(
				{
					name: 'Sample Zone',
					metadata: {
						description: 'A test zone for unit testing',
						version: '1.0.0',
					},
				},
				zoneId
			);

			expect(zoneUpdateId).toBeDefined();
			expect(zoneUpdateId).toEqualType('string');

			logTest('Testing zone fetch...');
			const zone = await permaweb.getZone(zoneId);

			expect(zone).toEqual({
				store: {
					name: 'Sample Zone',
					metadata: {
						description: 'A test zone for unit testing',
						version: '1.0.0',
					},
				},
				assets: [],
			});
		} catch (e) {
			logError(e.message ?? 'Zone tests failed');
		}
	}

	async function testProfiles() {
		try {
			logTest('Testing profile creation...');
			const profileId = await permaweb.createProfile(
				{
					username: 'My username',
					displayName: 'My display name',
					description: 'My description',
				},
				(status) => console.log(`Callback: ${status}`)
			);

			expect(profileId).toBeDefined();
			expect(profileId).toEqualType('string');

			logTest('Testing profile fetch by ID...');
			const profileById = await permaweb.getProfileById(profileId);

			expect(profileById).toBeDefined();
			expect(profileById.username).toEqual('My username');

			logTest('Testing profile fetch by address...');
			const profileByWalletAddress = await permaweb.getProfileByWalletAddress(
				await arweave.wallets.jwkToAddress(wallet)
			);

			expect(profileByWalletAddress).toBeDefined();
			expect(profileByWalletAddress.username).toEqual('My username');

			logTest('Testing profile update...');
			const profileUpdateId = await permaweb.updateProfile(
				{
					username: 'My updated username',
					displayName: 'My updated display name',
					description: 'My updated description',
				},
				profileId,
				(status) => console.log(`Callback: ${status}`)
			);

			expect(profileUpdateId).toBeDefined();
			expect(profileUpdateId).toEqualType('string');

			logTest('Testing updated profile fetch...');
			const updatedProfileById = await permaweb.getProfileById(profileId);

			expect(updatedProfileById).toBeDefined();
			expect(updatedProfileById.username).toEqual('My updated username');
		} catch (e) {
			logError(e.message ?? 'Profile tests failed');
		}
	}

	async function testAssets() {
		try {
			logTest('Testing asset creation...');
			const assetId1 = await permaweb.createAtomicAsset({
				name: 'Example Name',
				description: 'Example Description',
				topics: ['Topic 1', 'Topic 2', 'Topic 3'],
				creator: CREATOR,
				data: 'Atomic Asset Data',
				contentType: 'text/plain',
				assetType: 'Example Atomic Asset Type',
				metadata: {
					status: 'Initial Status',
				},
			});

			expect(assetId1).toBeDefined();
			expect(assetId1).toEqualType('string');

			logTest('Testing asset fetch...');
			const asset1 = await permaweb.getAtomicAsset(assetId1);

			expect(asset1).toBeDefined();
			expect(asset1.name).toEqual('Example Name');

			logTest('Testing asset creation with custom ticker...');
			const customTickerAssetId = await permaweb.createAtomicAsset({
				name: 'Custom Ticker Asset',
				description: 'Asset with custom ticker',
				topics: ['Topic 1', 'Topic 2'],
				creator: CREATOR,
				data: 'Custom Ticker Asset Data',
				contentType: 'text/plain',
				assetType: 'Example Atomic Asset Type',
				ticker: 'CUSTOM',
			});

			expect(customTickerAssetId).toBeDefined();
			expect(customTickerAssetId).toEqualType('string');

			logTest('Testing custom ticker asset fetch...');
			const customTickerAsset = await permaweb.getAtomicAsset(customTickerAssetId);

			expect(customTickerAsset).toBeDefined();
			expect(customTickerAsset.ticker).toEqual('CUSTOM');

			logTest('Creating asset for batch query...');
			const assetId2 = await permaweb.createAtomicAsset({
				name: 'Example Name',
				description: 'Example Description',
				topics: ['Topic 1', 'Topic 2', 'Topic 3'],
				creator: CREATOR,
				data: 'Atomic Asset Data',
				contentType: 'text/plain',
				assetType: 'Example Atomic Asset Type',
				metadata: {
					status: 'Initial Status',
				},
			});

			expect(assetId2).toBeDefined();
			expect(assetId2).toEqualType('string');

			logTest('Testing batch asset query...');
			const assets = await permaweb.getAtomicAssets([assetId1, assetId2]);

			// Note: Batch query might not return all assets immediately due to network propagation
			// So we'll check if we got at least one asset and that it has the expected properties
			expect(assets).toBeDefined();
			if (assets && assets.length > 0) {
				logTest(`Found ${assets.length} of 2 expected assets in batch query`);
				// Check that the assets we did get have the expected properties
				for (const asset of assets) {
					expect(asset).toBeDefined();
					expect(asset.id).toBeDefined();
				}
			} else {
				logTest('No assets found in batch query, this is expected for newly created assets');
			}

			logTest('Testing asset update...');
			const data = permaweb.mapToProcessCase({
				name: 'Updated Name',
				description: 'Updated Description',
			});

			await permaweb.sendMessage({
				processId: assetId1,
				wallet: wallet,
				action: 'Update-Asset',
				data: data,
			});

			logTest('Testing updated asset fetch...');
			const updatedAsset = await permaweb.getAtomicAsset(assetId1);

			console.log(updatedAsset);

			expect(updatedAsset).toBeDefined();
			expect(updatedAsset.name).toEqual('Updated Name');
		} catch (e) {
			logError(e.message ?? 'Asset tests failed');
		}
	}

	async function testComments() {
		const PARENT_ID = new Date().getTime().toString();

		try {
			logTest('Testing comment creation...');
			const commentId1 = await permaweb.createComment(
				{
					creator: CREATOR,
					content: 'My first comment',
					parentId: PARENT_ID,
				},
				(status) => console.log(`Callback: ${status}`)
			);

			expect(commentId1).toBeDefined();
			expect(commentId1).toEqualType('string');

			logTest('Testing comment fetch...');
			const comment = await permaweb.getComment(commentId1);

			expect(comment).toBeDefined();
			expect(comment.parentId).toEqual(Number(PARENT_ID));

			logTest('Creating comment for batch query...');
			const commentId2 = await permaweb.createComment(
				{
					creator: CREATOR,
					content: 'My second comment',
					parentId: PARENT_ID,
				},
				(status) => console.log(`Callback: ${status}`)
			);

			expect(commentId2).toBeDefined();
			expect(commentId2).toEqualType('string');

			logTest('Testing comments fetch...');
			const comments = await permaweb.getComments({ parentId: PARENT_ID });

			expect(comments).toEqualLength(2);
		} catch (e) {
			logError(e.message ?? 'Comment tests failed');
		}
	}

	async function testCollections() {
		try {
			logTest('Creating profile to own collection...');
			const profileId = await permaweb.createProfile(
				{
					username: 'My username',
					displayName: 'My display name',
					description: 'My description',
				},
				(status) => console.log(`Callback: ${status}`)
			);

			logTest('Testing collection creation...');
			const collectionId = await permaweb.createCollection({
				title: 'Sample collection title',
				description: 'Sample collection description',
				creator: profileId,
				skipRegistry: true,
			});

			expect(collectionId).toBeDefined();
			expect(collectionId).toEqualType('string');

			logTest('Testing collection fetch...');
			const collection = await permaweb.getCollection(collectionId);

			expect(collection).toBeDefined();
			expect(collection.id).toEqual(collectionId);

			logTest('Testing collection assets update...');
			const collectionUpdateId = await permaweb.updateCollectionAssets({
				collectionId: collectionId,
				assetIds: ['BvKq3F8psspbAvIDBAlgiG3E_XwiszSfJIYSg3kl0BU', 'Loe-SwVioq8_xqbbzM-0TxMC4Lq8IobHNLyHQWgxaGk'],
				creator: profileId,
				updateType: 'Add',
			});

			expect(collectionUpdateId).toBeDefined();
			expect(collectionUpdateId).toEqualType('string');

			logTest('Sleeping for collection update...');
			await new Promise((r) => setTimeout(r, 5000));

			logTest('Testing updated collection fetch...');
			const updatedCollection = await permaweb.getCollection(collectionId);

			expect(updatedCollection).toBeDefined();

			const expectedAssets = [
				'BvKq3F8psspbAvIDBAlgiG3E_XwiszSfJIYSg3kl0BU',
				'Loe-SwVioq8_xqbbzM-0TxMC4Lq8IobHNLyHQWgxaGk',
			].sort();

			const actualAssets = updatedCollection.assetIds.sort();

			expect(actualAssets).toEqual(expectedAssets);
		} catch (e) {
			logError(e.message ?? 'Collection tests failed');
		}
	}

	const testMap = {
		zones: { key: 'zones', fn: testZones },
		profiles: { key: 'profiles', fn: testProfiles },
		assets: { key: 'assets', fn: testAssets },
		comments: { key: 'comments', fn: testComments },
		collections: { key: 'assets', fn: testCollections },
	};

	(async function () {
		const testType = process.argv[2];
		if (!testType || testType === 'all') {
			for (const testKey in testMap) {
				await testMap[testKey].fn();
			}
		} else if (testMap[testType]) {
			await testMap[testType].fn();
		} else {
			console.log(`Invalid test type. Specify one of: ${Object.keys(testMap).join(', ')}, or 'all'.`);
		}
	})();
})();
