export const AO = {
	module: 'URgYpPQzvxxfYQtjrIQ116bl3YBfcImo3JEnNo8Hlrk', // jEoqVF7arFV1VWYiLVkAju8Etxcmw7zVDnGxUes0Zjk
	scheduler: '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA',
	mu: 'fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY',
	src: {
		asset: 'XYz8buLR5LQdhOOzWuCt9kBjoXHMowouWpXcGm9wdEE',
		collection: 'aHN0YxA7Th1OQdtgv0slWv9LMrvYukvNgWdkotJsML0',
		collectionActivity: 'k8K8WIJb5kXOVvZRFXF5GIZW-7b2NtaTOd6G-E5MF0k',
		profile: 'WBhJpPafkykqZZgTr7TAsz48RKG4vbOEAH4rZ3JxIQ8',
		zone: 'M9G2B9Uvk8VK1pxloESeT4XScguRKSzLyd4as1HFOJ8',
	},
	collectionRegistry: 'TFWDmf8a3_nw43GCm_CuYlYoylHAjCcFGbgHfDaGcsg',
	profileRegistry: 'SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY'
};

export const CONTENT_TYPES: { [key: string]: { type: string; serialize: (data: any) => any } } = {
	'application/json': {
		type: 'application/json',
		serialize: (data: any) => JSON.stringify(data),
	},
};

export const GATEWAYS = {
	arweave: 'arweave.net',
	goldsky: 'arweave-search.goldsky.com',
};

export const LICENSES = {
	udl: {
		label: 'Universal Data License',
		address: 'dE0rmDfl9_OWjkDznNEXHaSO_JohJkRolvMzaCroUdw',
	},
};

export const TAGS = {
	keys: {
		access: 'Access-Fee',
		ans110: {
			title: 'Title',
			description: 'Description',
			topic: 'Topic:*',
			type: 'Type',
			implements: 'Implements',
			license: 'License',
		},
		assetType: 'Asset-Type',
		banner: 'Banner',
		bootloader: 'Bootloader',
		bootloaderInit: 'On-Boot',
		collectionId: 'Collection-Id',
		collectionName: 'Collection-Name',
		commericalUse: 'Commercial-Use',
		contentType: 'Content-Type',
		creator: 'Creator',
		currency: 'Currency',
		dataModelTraining: 'Data-Model-Training',
		dataProtocol: 'Data-Protocol',
		dateCreated: 'Date-Created',
		derivations: 'Derivations',
		description: 'Description',
		displayName: 'Display-Name',
		handle: 'Handle',
		implements: 'Implements',
		initialOwner: 'Initial-Owner',
		license: 'License',
		name: 'Name',
		paymentAddress: 'Payment-Address',
		paymentMode: 'Payment-Mode',
		profileCreator: 'Profile-Creator',
		profileIndex: 'Profile-Index',
		protocolName: 'Protocol-Name',
		renderWith: 'Render-With',
		thumbnail: 'Thumbnail',
		title: 'Title',
		topic: 'Topic',
		type: 'Type',
		zoneType: 'Zone-Type',
	},
	values: {
		document: 'Document',
	},
};

export const UPLOAD = {
	node1: 'https://up.arweave.net',
	node2: 'https://turbo.ardrive.io',
	batchSize: 1,
	chunkSize: 7500000,
	dispatchUploadSize: 100 * 1024,
};
